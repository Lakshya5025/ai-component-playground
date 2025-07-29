import React, { useState, useEffect, useRef } from "react";
import useAppStore from "../store/store";
import { generateCode } from "../services/api";
import "./ChartPanel.css";

const ChatPanel = () => {
  const { activeSession, setActiveSession } = useAppStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeSession || loading) return;

    setLoading(true);
    const userMessage = {
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };
    const updatedMessages = [...(activeSession.messages || []), userMessage];
    setActiveSession({ ...activeSession, messages: updatedMessages });
    const currentInput = input;
    setInput("");

    try {
      const response = await generateCode(activeSession.id, currentInput);

      // 👇 ADD THIS LINE to see the server's response
      console.log("Data received from server:", response.data);

      setActiveSession(response.data);
    } catch (error) {
      console.error("Failed to generate code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="chat-panel">
      <div className="chat-panel-header">
        <h3>Chat log</h3>
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
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
        </button>
      </div>
      <div className="chat-messages-area">
        {(activeSession?.messages || []).map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.role}`}>
            <div className="message-bubble">
              <p className="message-content">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-wrapper ai">
            <div className="message-bubble">...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Text npot"
            disabled={loading || !activeSession}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading || !activeSession}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </aside>
  );
};

export default ChatPanel;
