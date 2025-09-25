import React, { useState, useEffect } from "react";
import feather from "feather-icons";

const Dashboard = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello 👋, how can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState(null);
  const [search, setSearch] = useState(""); // ✅ search input

  useEffect(() => {
    feather.replace();
  }, [messages, answer]); // refresh icons when view changes

  const faqs = [
    {
      q: "How do I reset my password?",
      a: "Try these steps:\n1. Go to the Settings page.\n2. Click Reset Password.\n3. Enter your new password and confirm it.\n4. Save changes.",
    },
    {
      q: "How to connect to VPN?",
      a: "Download the VPN client, install it, and log in using company credentials.",
    },
    { q: "How to request leave?", a: "Open HR portal → Leave request form." },
    {
      q: "How to report a bug?",
      a: "Go to 'Create Ticket' and select Bug category.",
    },
    {
      q: "How to access payslip?",
      a: "Login → Payroll → Payslip section.",
    },
  ];

  const handleFaqClick = (ans) => {
    setAnswer(ans);
  };

  // ✅ Search handler
  const handleSearch = () => {
    if (search.trim() !== "") {
      const match = faqs.find((f) =>
        f.q.toLowerCase().includes(search.toLowerCase())
      );
      if (match) {
        setAnswer(match.a);
      } else {
        setAnswer(`(AI Response for "${search}" will be shown here...)`);
      }
    }
  };

  const handleSendMessage = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      const newMessages = [...messages, { from: "user", text: input }];
      setMessages(newMessages);
      setInput("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "I may have an idea..." },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search knowledge..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
            <i data-feather="search"></i> {/* Feather search icon */}
          
        </button>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        {!answer ? (
          <>
            <h2 className="faq-title">Common FAQs</h2>
            {faqs.map((f, idx) => (
              <div
                key={idx}
                className="faq-item"
                onClick={() => handleFaqClick(f.a)}
              >
                {f.q}
              </div>
            ))}
          </>
        ) : (
          <div className="answer-section">
            <p>{answer}</p>
            {/* ✅ Back button */}
            <button
              className="btn-back"
              onClick={() => setAnswer(null)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="cards-container">
        <div className="card create-ticket">
          <i data-feather="plus-circle" className="card-icon"></i>
          <span className="card-text">Create Ticket</span>
        </div>
        <div className="card my-tickets">
          <i data-feather="clipboard" className="card-icon"></i>
          <span className="card-text">My Tickets</span>
        </div>
      </div>

      {/* Chatbot Button */}
      <button className="chatbot-btn" onClick={() => setChatOpen(!chatOpen)}>
        <i data-feather="message-square"></i>
      </button>

      {/* Chatbot Panel */}
      {chatOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">Helpdesk Chat</div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${msg.from === "bot" ? "bot" : "user"}`}
              >
                {msg.text}
                {msg.from === "bot" && (
                  <div className="chat-reaction">
                    <i data-feather="thumbs-up" className="thumbs-up"></i>
                    <i data-feather="thumbs-down" className="thumbs-down"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="chatbot-input-container">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleSendMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
