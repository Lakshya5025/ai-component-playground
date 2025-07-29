import React from "react";
import useAppStore from "../store/store";
import Preview from "./Preview";
import CodeDisplay from "./CodeDisplay";

const MainContent = () => {
  const { activeSession } = useAppStore();
  console.log("MainContent is rendering. Active session data:", activeSession);

  return (
    <main className="main-content">
      <div className="panel-container">
        <div className="panel-header">
          <h3>Preview</h3>
          <div className="panel-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>
        <div className="panel-content preview-content">
          {activeSession?.latestCode?.jsx ? (
            <Preview
              jsx={activeSession.latestCode.jsx}
              css={activeSession.latestCode.css}
            />
          ) : (
            <div className="empty-placeholder">
              Your component preview will appear here.
            </div>
          )}
        </div>
      </div>
      <div className="panel-container">
        <div className="panel-header">
          <h3>Code Output</h3>
        </div>
        <div className="panel-content code-content">
          {activeSession?.latestCode?.jsx ? (
            <CodeDisplay
              jsx={activeSession.latestCode.jsx}
              css={activeSession.latestCode.css}
            />
          ) : (
            <div className="empty-placeholder">
              Generated code will appear here.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
