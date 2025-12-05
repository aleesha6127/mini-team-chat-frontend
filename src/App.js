import { useState, useEffect } from "react";
import Auth from "./Auth";
import Channels from "./components/Channels";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState(null); // {username, email}
  const [selectedChannel, setSelectedChannel] = useState(null);

  // Keep user logged in on refresh
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored && !user) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setSelectedChannel(null);
  };

  // Show login/signup if not logged in
  if (!user) {
    return (
      <div style={{ width: "300px", margin: "50px auto", color: "#fff" }}>
        <Auth
          onLogin={(userData) => {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }}
        />
      </div>
    );
  }

  // After login: Channels + Chat
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)",
      color: "white"
    }}>
      {/* Sidebar */}
      <div style={{
        width: "250px",
        backgroundColor: "#111",
        padding: "10px",
        overflowY: "auto"
      }}>
        <h2 style={{ textAlign: "center" }}>Channels</h2>
        <button onClick={handleLogout} style={{ width: "100%", marginBottom: "10px" }}>Logout</button>
        <Channels
          user={user}
          onSelectChannel={(channelId) => setSelectedChannel(channelId)}
        />
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, padding: "10px" }}>
        {selectedChannel ? (
          <Chat
            user={user}
            channelId={selectedChannel}
          />
        ) : (
          <p style={{ textAlign: "center", marginTop: "50px" }}>
            Select a channel to start chatting
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
