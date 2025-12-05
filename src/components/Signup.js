import { useState } from "react";
import axios from "axios";

function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    if (!username || !password) return setError("Enter both fields");
    try {
      await axios.post("https://mini-team-chat-2.onrender.com/api/auth/signup", {
  username,
  password
});

      setSuccess("Signup successful! Redirecting to login...");
      setError("");
      setTimeout(() => onSignup(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setSuccess("");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Sign Up</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: "100%", marginBottom: "10px", padding: "8px" }} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", marginBottom: "10px", padding: "8px" }} />
      <button onClick={handleSignup} style={{ width: "100%", padding: "8px" }}>Sign Up</button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
    </div>
  );
}

export default Signup;
