import { useState, useEffect } from "react";
import { getStoredUser } from "./utils/storage";
import UserSelection from "./pages/UserSelection";
import Feed from "./pages/Feed";
import "./index.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setCurrentUser(stored);
    }
  }, []);

  if (!currentUser) {
    return <UserSelection onSelectUser={setCurrentUser} />;
  }

  return <Feed user={currentUser} onLogout={() => setCurrentUser(null)} />;
}
