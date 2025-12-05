import { useState, useEffect } from "react";
import { fetchChannels, createChannel } from "../utils/api";

function Channels({ user, onSelectChannel }) {
  const [channels, setChannels] = useState([]);
  const [newChannel, setNewChannel] = useState("");
  const [search, setSearch] = useState("");

  const loadChannels = async () => {
    try {
      const list = await fetchChannels();
      setChannels(list || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateChannel = async () => {
    if (!newChannel.trim()) return;
    try {
      await createChannel(newChannel.trim());
      setNewChannel("");
      loadChannels();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadChannels(); }, []);

  const filteredChannels = channels.filter(ch => (ch.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <input type="text" placeholder="Search channels" value={search} onChange={e => setSearch(e.target.value)} className="input" />
      <div style={{ display: "flex", margin: "10px 0" }}>
        <input type="text" placeholder="New channel" value={newChannel} onChange={e => setNewChannel(e.target.value)} className="input" />
        <button onClick={handleCreateChannel} className="btn-primary" style={{ marginLeft: "10px", width: 120 }}>Create</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredChannels.map(ch => (
          <li key={ch._id} className="channel-item">
            <span>{ch.name}</span>
            <button className="btn-primary" style={{ width: 100 }} onClick={() => onSelectChannel(ch._id)}>Open</button>
          </li>
        ))}
        {filteredChannels.length === 0 && (
          <li style={{ opacity: 0.8, padding: 8 }}>
            No channels found. Create one to start chatting!
          </li>
        )}
      </ul>
    </div>
  );
}

export default Channels;
