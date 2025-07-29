import React, { useState, useEffect, useRef } from "react";

const Preview = ({ jsx, css }) => {
  const [iframeContent, setIframeContent] = useState("");
  // Use a ref to track the latest version of the code to prevent stale closures
  const latestCode = useRef({ jsx, css });
  latestCode.current = { jsx, css };

  useEffect(() => {
    // A flag to know if the component is still mounted
    let isMounted = true;
    let timeoutId;

    const attemptTranspilation = () => {
      // If the component has unmounted, stop trying.
      if (!isMounted) return;

      // If Babel isn't ready, try again shortly.
      if (!window.Babel) {
        timeoutId = setTimeout(attemptTranspilation, 50);
        return;
      }

      // Once Babel is ready, proceed.
      try {
        const { jsx: currentJsx, css: currentCss } = latestCode.current;
        if (!currentJsx) return;

        const cleanedJsx = currentJsx.replace(/import.*?;/g, "");
        const transpiledJs = window.Babel.transform(cleanedJsx, {
          presets: [["react", { runtime: "automatic" }]],
        }).code;

        const html = `
          <html>
            <head>
              <style>${currentCss || ""}</style>
            </head>
            <body>
              <div id="root"></div>
              <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              <script type="module">
                try {
                  const App = (() => {
                    ${transpiledJs.replace(/export default/, "return")}
                  })();
                  
                  const root = ReactDOM.createRoot(document.getElementById('root'));
                  root.render(React.createElement(App));
                } catch (e) {
                  const root = document.getElementById('root');
                  root.innerHTML = \`<div style="color: red; font-family: sans-serif;"><h3>Runtime Error:</h3><pre>\${e.message}</pre></div>\`;
                }
              </script>
            </body>
          </html>
        `;
        if (isMounted) {
          setIframeContent(html);
        }
      } catch (error) {
        if (isMounted) {
          setIframeContent(
            `<div style="color: red; font-family: sans-serif;"><h3>Transpilation Error:</h3><pre>${error.message}</pre></div>`
          );
        }
      }
    };

    if (jsx) {
      attemptTranspilation();
    } else {
      setIframeContent("");
    }

    // Cleanup function: runs when the component unmounts or props change
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [jsx, css]);

  return (
    <div
      style={{
        flexGrow: 1,
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
      }}>
      <iframe
        srcDoc={iframeContent}
        title="Component Preview"
        sandbox="allow-scripts"
        width="100%"
        height="100%"
        frameBorder="0"
      />
    </div>
  );
};

export default Preview;
