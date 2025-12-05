// src/utils/api.js
import axios from "axios";

// ----------------- BASE URL -----------------
const BASE_URL = "https://mini-team-chat-2.onrender.com/api";

function getAuthHeaders() {
  try {
    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  } catch {
    return {};
  }
}

// ----------------- USER AUTH -----------------
export async function signup(username, email, password) {
  try {
    const res = await axios.post(`${BASE_URL}/auth/signup`, {
      username,
      password,
    });
    return res.data;
  } catch (err) {
    console.error("Signup error:", err.response?.data || err.message);
    throw err;
  }
}

export async function login(email, password) {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, { username: email, password });
    return res.data;
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw err;
  }
}

// ----------------- MESSAGES -----------------
export async function sendMessage(channelId, sender, text) {
  if (!channelId || !sender || !text) throw new Error("channelId, sender, text required");
  const res = await axios.post(`${BASE_URL}/messages/${channelId}`, { content: text }, { headers: getAuthHeaders() });
  return res.data;
}


export async function fetchMessages(channelId) {
  try {
    const res = await axios.get(`${BASE_URL}/messages/${channelId}`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("Fetch messages error:", err.response?.data || err.message);
    throw err;
  }
}

// ----------------- CHANNELS -----------------
export async function fetchChannels() {
  try {
    const res = await axios.get(`${BASE_URL}/channels`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("Fetch channels error:", err.response?.data || err.message);
    throw err;
  }
}

export async function createChannel(name, createdBy) {
  try {
    const res = await axios.post(`${BASE_URL}/channels`, { name }, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("Create channel error:", err.response?.data || err.message);
    throw err;
  }
}
