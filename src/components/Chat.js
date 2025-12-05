import { useState, useEffect, useRef } from "react";
import { fetchMessages, sendMessage } from "../utils/api";

function Chat({ user, channelId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const BACKEND_URL = "https://mini-team-chat-2.onrender.com";

  const messagesEndRef = useRef(null);
  const token = user?.token || (() => {
    try { return JSON.parse(localStorage.getItem('user'))?.token; } catch { return undefined; }
  })();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const loadMessages = async () => {
    try {
      const res = await fetchMessages(channelId);
      setMessages(res || []);
      scrollToBottom();
    } catch (err) { console.error(err); }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await sendMessage(channelId, user?.username || user?.email || "anonymous", input.trim());
      setInput("");
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    loadMessages();
    const sse = new EventSource(`${BACKEND_URL}/api/messages/stream/${channelId}?token=${encodeURIComponent(token || '')}`);
    sse.onmessage = e => {
      const newMsg = JSON.parse(e.data);
      setMessages(prev => Array.isArray(prev) ? [...prev, newMsg] : [newMsg]);
      scrollToBottom();
    };
    sse.onerror = () => sse.close();
    return () => sse.close();
  }, [channelId]);

  const isMine = (msg) => {
    const myId = user?.id;
    return (msg.sender === myId) || (msg.sender?._id === myId);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px", border: "1px solid #444", marginBottom: "10px", backgroundColor: "#111", display: "flex", flexDirection: "column" }}>
        {Array.isArray(messages) && messages.map(msg => (
          <div key={msg._id || Math.random()} className={`message-bubble ${isMine(msg) ? 'message-me' : 'message-other'}`}>
            <b>{(msg.sender && msg.sender.username) ? msg.sender.username : (msg.sender || 'unknown')}</b>
            <div>{msg.text || msg.content}</div>
          </div>
        ))}
        {Array.isArray(messages) && messages.length === 0 && (
          <div style={{ opacity: 0.8, textAlign: 'center', marginTop: 20 }}>No messages yet. Be the first to say hi!</div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <div style={{ display: "flex" }}>
        <input type="text" placeholder="Type a message" value={input} onChange={e => setInput(e.target.value)} className="input" />
        <button onClick={handleSend} className="btn-primary" style={{ marginLeft: "10px", width: 120 }}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
