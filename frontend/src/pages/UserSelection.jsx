import { useState, useEffect } from "react";
import { getUsers } from "../services/api";
import { setStoredUser } from "../utils/storage";

const DEFAULT_USERS = [
  { _id: 1, name: "Alex" },
  { _id: 2, name: "Sarah" },
];

export default function UserSelection({ onSelectUser }) {
  const [users, setUsers] = useState(DEFAULT_USERS);

  useEffect(() => {
    getUsers()
      .then((data) => {
        if (data && data.length > 0) setUsers(data);
      })
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  const handleSelect = (user) => {
    setStoredUser(user);
    onSelectUser(user);
  };

  return (
    <div className="user-selection">
      <h1>MarketMind</h1>
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
