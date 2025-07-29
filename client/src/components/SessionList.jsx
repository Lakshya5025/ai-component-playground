import React from "react";
import useAppStore from "../store/store";
import { createSession } from "../services/api";
import "./SessionList.css";

const SessionList = () => {
  const { sessions, setSessions, activeSession, setActiveSession } =
    useAppStore();

  const handleNewSession = async () => {
    try {
      const response = await createSession();
      const newSession = response.data;
      setSessions([newSession, ...sessions]);
      setActiveSession(newSession);
    } catch (error) {
      console.error("Failed to create new session:", error);
    }
  };

  const UserIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
  const ChevronIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <aside className="session-list-container">
      <h3>Previous Chats</h3>
      <button className="new-session-btn" onClick={handleNewSession}>
        New Chat
      </button>
      <div className="sessions-scroll-area">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`session-item ${
              activeSession?.id === session.id ? "active" : ""
            }`}
            onClick={() => setActiveSession(session)}>
            <div className="session-item-left">
              <span className="icon">
                <UserIcon />
              </span>
              <span className="session-name">{session.name}</span>
            </div>
            <span className="chevron">
              <ChevronIcon />
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SessionList;
