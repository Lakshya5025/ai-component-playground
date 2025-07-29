import React, { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";
import "./DashboardPage.css";

import useAppStore from "../store/store";
import { getSessions } from "../services/api";
import SessionList from "../components/SessionList";
import MainContent from "../components/MainContent";
import ChatPanel from "../components/ChatPanel";

const DashboardPage = () => {
  const { setSessions } = useAppStore();

  useEffect(() => {
    const fetchUserSessions = async () => {
      try {
        const response = await getSessions();
        setSessions(response.data);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    };
    fetchUserSessions();
  }, [setSessions]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1>AI React component</h1>
        </div>
        <div className="header-right">
          <button className="icon-btn">
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
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button className="icon-btn" onClick={() => signOut(auth)}>
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
          <div className="user-profile">
            <img
              src={`https://i.pravatar.cc/32?u=${auth.currentUser?.uid}`}
              alt="User Avatar"
            />
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <SessionList />
        <MainContent />
        <ChatPanel />
      </main>
    </div>
  );
};

export default DashboardPage;
