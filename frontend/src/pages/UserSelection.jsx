import { useState, useEffect } from "react";
import { getUsers } from "../services/api";
import { setStoredUser } from "../utils/storage";

export default function UserSelection({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => console.error("Failed to fetch users:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (user) => {
    setStoredUser(user);
    onSelectUser(user);
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-selection">
      <h1>MarketFeed</h1>
      <p>Select a user to view personalized listings</p>
      <div className="user-buttons">
        {users.map((user) => (
          <button
            key={user._id}
            className="user-btn"
            onClick={() => handleSelect(user)}
          >
            <span className="user-name">{user.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
