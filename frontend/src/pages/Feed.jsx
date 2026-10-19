import { clearStoredUser } from "../utils/storage";
import ListingCard from "../components/ListingCard";

export default function Feed({
  user,
  listings,
  savedListingIds,
  onToggleSave,
  onViewDetails,
  onLogout,
}) {
  const handleLogout = () => {
    clearStoredUser();
    onLogout();
  };

  return (
    <div className="feed-page">
      <header className="feed-header">
        <div className="header-left">
          <h1>MarketMind</h1>
        </div>
        <div className="header-right">
          <span className="current-user">{user.name}</span>
          <button type="button" className="switch-btn logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <div className="listings-grid">
        {listings.map((listing) => (
          <ListingCard
            key={listing._id}
            listing={listing}
            userId={user._id}
            isSaved={savedListingIds.has(listing._id)}
            onToggleSave={onToggleSave}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
}
