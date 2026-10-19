import { useState, useEffect } from "react";
import { getStoredUser } from "./utils/storage";
import {
  getRecommendations,
  getUserSavedListingIds,
  createInteraction,
  unsaveListing,
} from "./services/api";
import UserSelection from "./pages/UserSelection";
import Feed from "./pages/Feed";
import ListingDetail from "./pages/ListingDetail";
import "./index.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [feedListings, setFeedListings] = useState([]);
  const [savedListingIds, setSavedListingIds] = useState(new Set());
  const [activeListingId, setActiveListingId] = useState(() => {
    const match = window.location.pathname.match(/\/listings\/(.+)/);
    return match ? match[1] : null;
  });

  // Load user session and initial feed
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setCurrentUser(stored);
      loadUserFeedAndSaves(stored._id);
    }
  }, []);

  // Listen for browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/\/listings\/(.+)/);
      setActiveListingId(match ? match[1] : null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const loadUserFeedAndSaves = (userId) => {
    Promise.all([
      getRecommendations(userId),
      getUserSavedListingIds(userId),
    ])
      .then(([recs, savedIds]) => {
        setFeedListings(recs);
        setSavedListingIds(new Set(savedIds));
      })
      .catch((err) => console.error("Failed to load user feed:", err));
  };

  const handleSelectUser = (user) => {
    setCurrentUser(user);
    loadUserFeedAndSaves(user._id);
  };

  const handleNavigateDetail = (listingId) => {
    setActiveListingId(listingId);
    window.history.pushState({}, "", `/listings/${listingId}`);
  };

  const handleBackToFeed = () => {
    setActiveListingId(null);
    window.history.pushState({}, "", "/");
  };

  const handleToggleSave = async (listingId) => {
    if (!currentUser) return;
    const isCurrentlySaved = savedListingIds.has(listingId);

    // Optimistically update bookmark state
    setSavedListingIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlySaved) {
        next.delete(listingId);
      } else {
        next.add(listingId);
      }
      return next;
    });

    try {
      if (isCurrentlySaved) {
        await unsaveListing({ userId: currentUser._id, listingId });
      } else {
        await createInteraction({ userId: currentUser._id, listingId, type: "SAVE" });
      }
    } catch (err) {
      console.error("Save toggle error:", err);
      // Rollback on failure
      setSavedListingIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) {
          next.add(listingId);
        } else {
          next.delete(listingId);
        }
        return next;
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setFeedListings([]);
    setSavedListingIds(new Set());
    setActiveListingId(null);
    window.history.pushState({}, "", "/");
  };

  if (!currentUser) {
    return <UserSelection onSelectUser={handleSelectUser} />;
  }

  if (activeListingId) {
    return (
      <ListingDetail
        listingId={activeListingId}
        user={currentUser}
        onBack={handleBackToFeed}
        onLogout={handleLogout}
        isSaved={savedListingIds.has(activeListingId)}
        onToggleSave={handleToggleSave}
      />
    );
  }

  return (
    <Feed
      user={currentUser}
      listings={feedListings}
      savedListingIds={savedListingIds}
      onToggleSave={handleToggleSave}
      onViewDetails={handleNavigateDetail}
      onLogout={handleLogout}
    />
  );
}
