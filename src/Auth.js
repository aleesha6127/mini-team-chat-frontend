import { useState } from "react";

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function validateSignup({ username, email, password }) {
  const errors = {};
  if (!username || username.trim().length < 3) errors.username = "Username must be at least 3 characters";
  if (!email || !validateEmail(email)) errors.email = "Please enter a valid email";
  if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";
  return errors;
}

function validateLogin({ username, password }) {
  const errors = {};
  if (!username || username.trim().length < 3) errors.username = "Please enter a valid username";
  if (!password) errors.password = "Password is required";
  return errors;
}

export default function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const API_BASE = "https://mini-team-chat-2.onrender.com/api/auth";


  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");

    if (isSignup) {
      const errs = validateSignup({ username, email, password });
      setErrors(errs);
      if (Object.keys(errs).length) return;
    } else {
      const errs = validateLogin({ username, password });
      setErrors(errs);
      if (Object.keys(errs).length) return;
    }

    try {
      setLoading(true);
      if (isSignup) {
        const res = await fetch(`${API_BASE}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Signup failed");
        setSuccess("Signup successful! You can log in now.");
        setIsSignup(false);
        setUsername(""); setEmail(""); setPassword("");
      } else {
        const res = await fetch(`${API_BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        const user = { id: data.user?.id, username: data.user?.username, token: data.token };
        localStorage.setItem("user", JSON.stringify(user));
        onLogin(user);
      }
    } catch (err) {
      setApiError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    if (!validateEmail(resetEmail)) {
      setResetError("Please enter a valid email");
      return;
    }
    try {
      setResetLoading(true);
      await new Promise(res => setTimeout(res, 800));
      setResetSuccess("If an account exists, a reset link has been sent.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 style={{ marginBottom: 8 }}>{isSignup ? "Create account" : "Welcome back"}</h2>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>{isSignup ? "Sign up to start chatting" : "Login to continue"}</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Username</label>
          <input className="input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="yourname" />
          {errors.username && <div className="error-text">{errors.username}</div>}
        </div>
        {isSignup && (
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>
        )}
        <div style={{ marginBottom: 8 }}>
          <label>Password</label>
          <div className="input-password-wrapper">
            <input className="input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" />
            <button type="button" className="icon-btn" aria-label="Toggle password visibility" onClick={() => setShowPassword(v => !v)}>{showPassword ? "🙈" : "👁️"}</button>
          </div>
          {errors.password && <div className="error-text">{errors.password}</div>}
          <div style={{ marginTop: 8 }}>
            <button type="button" className="link-btn" onClick={() => { setShowForgot(v => !v); setResetError(""); setResetSuccess(""); }}>Forgot password?</button>
          </div>
        </div>
        {showForgot && (
          <div style={{ marginBottom: 12, background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8 }}>
            <form onSubmit={handleForgot}>
              <label>Reset email</label>
              <input className="input" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="you@example.com" />
              {resetError && <div className="error-text" style={{ marginTop: 6 }}>{resetError}</div>}
              {resetSuccess && <div className="success-text" style={{ marginTop: 6 }}>{resetSuccess}</div>}
              <button className="btn-primary" type="submit" disabled={resetLoading} style={{ marginTop: 8 }}>
                {resetLoading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </div>
        )}
        {apiError && <div className="error-text" style={{ marginBottom: 12 }}>{apiError}</div>}
        {success && <div className="success-text" style={{ marginBottom: 12 }}>{success}</div>}
        <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
        </button>
      </form>
      <div style={{ marginTop: 12, textAlign: "center" }}>
        {isSignup ? (
          <span>Have an account? <button type="button" className="link-btn" onClick={() => { setIsSignup(false); setErrors({}); setApiError(""); setSuccess(""); }}>Login</button></span>
        ) : (
          <span>New here? <button type="button" className="link-btn" onClick={() => { setIsSignup(true); setErrors({}); setApiError(""); setSuccess(""); }}>Create account</button></span>
        )}
      </div>
    </div>
  );
}
