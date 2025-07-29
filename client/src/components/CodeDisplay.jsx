import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./CodeDisplay.css"; // Create this new CSS file

const CodeDisplay = ({ jsx, css }) => {
  const [activeTab, setActiveTab] = useState("jsx");

  return (
    <div className="code-display-container">
      <div className="code-tabs">
        <button
          className={activeTab === "jsx" ? "active" : ""}
          onClick={() => setActiveTab("jsx")}>
          JSX
        </button>
        <button
          className={activeTab === "css" ? "active" : ""}
          onClick={() => setActiveTab("css")}>
          CSS
        </button>
      </div>
      <div className="code-content-area">
        <SyntaxHighlighter
          language={activeTab}
          style={oneLight}
          customStyle={{
            margin: 0,
            borderRadius: "0 0 0.5rem 0.5rem",
            background: "#F9FAFB",
          }}
          codeTagProps={{ style: { fontFamily: '"Fira Code", monospace' } }}>
          {activeTab === "jsx" ? jsx || "" : css || ""}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeDisplay;
