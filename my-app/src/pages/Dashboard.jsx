import React, { useState, useEffect, useRef } from "react";
import feather from "feather-icons";

const Dashboard = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello 👋, how can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState(null);
  const [search, setSearch] = useState(""); // search input

  const ws = useRef(null);

  // Initialize WebSocket
  useEffect(() => {
  ws.current = new WebSocket('ws://127.0.0.1:8000/ws/chat/123?token="mysecretkey123"');


 // replace 123 with dynamic user ID
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    };
    ws.current.onclose = () => console.log("WebSocket closed");
    return () => ws.current.close();
  }, []);

  useEffect(() => {
    feather.replace();
  }, [messages, answer]);

  // FAQs
  const faqs = [
    { q: "How do I reset my password?", a: "Go to Settings → Reset Password → Enter new password → Save." },
    { q: "How to connect to VPN?", a: "Download VPN client → Install → Login with credentials." },
    { q: "How to request leave?", a: "Open HR portal → Leave request form." },
    { q: "How to report a bug?", a: "Go to 'Create Ticket' → Select Bug category." },
    { q: "How to access payslip?", a: "Login → Payroll → Payslip section." },
  ];

  // FAQ click handler
  const handleFaqClick = (ans) => setAnswer(ans);

  // Search handler
  const handleSearch = () => {
    if (search.trim() !== "") {
      const match = faqs.find((f) => f.q.toLowerCase().includes(search.toLowerCase()));
      if (match) setAnswer(match.a);
      else setAnswer(`(AI Response for "${search}" will be shown here...)`);
    }
  };

  // Chat input send handler
  const handleSendMessage = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      const userMessage = input;
      setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
      setInput("");
      ws.current.send(JSON.stringify({ message: userMessage }));
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
          <i data-feather="search"></i>
        </button>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        {!answer ? (
          <>
            <h2 className="faq-title">Common FAQs</h2>
            {faqs.map((f, idx) => (
              <div key={idx} className="faq-item" onClick={() => handleFaqClick(f.a)}>
                {f.q}
              </div>
            ))}
          </>
        ) : (
          <div className="answer-section">
            <p>{answer}</p>
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

      {/* Cards Section */}
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

      {/* Chatbot Toggle Button */}
      <button className="chatbot-btn" onClick={() => setChatOpen(!chatOpen)}>
        <i data-feather="message-square"></i>
      </button>

      {/* Chatbot Panel */}
      {chatOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">Helpdesk Chat</div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.from === "bot" ? "bot" : "user"}`}>
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
