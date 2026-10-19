import { useState, useEffect, useCallback } from "react";
import { getRecommendations } from "../services/api";
import { clearStoredUser } from "../utils/storage";
import ListingCard from "../components/ListingCard";

export default function Feed({ user, onLogout }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = useCallback(() => {
    setLoading(true);
    getRecommendations(user._id)
      .then(setListings)
      .catch((err) => console.error("Failed to fetch recommendations:", err))
      .finally(() => setLoading(false));
  }, [user._id]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleLogout = () => {
    clearStoredUser();
    onLogout();
  };

  return (
    <div className="feed-page">
      <header className="feed-header">
        <div className="header-left">
          <h1>MarketFeed</h1>
          <span className="current-user">
            {user.name}
          </span>
        </div>
        <button className="switch-btn" onClick={handleLogout}>
          Switch User
        </button>
      </header>

      {loading ? (
        <div className="loading">Loading recommendations...</div>
      ) : (
        <div className="listings-grid">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              userId={user._id}
              onInteraction={fetchFeed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
