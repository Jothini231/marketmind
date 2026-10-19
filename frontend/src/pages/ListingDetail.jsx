import { useState, useEffect, useRef } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { getListingById, getListingImage, createInteraction } from "../services/api";
import ActionButtons from "../components/ActionButtons";

export default function ListingDetail({
  listingId,
  user,
  onBack,
  onLogout,
  isSaved,
  onToggleSave,
}) {
  const [listing, setListing] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const viewRecordedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    getListingById(listingId)
      .then((data) => {
        if (isMounted) setListing(data);
      })
      .catch((err) => console.error("Failed to load listing:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    getListingImage(listingId)
      .then((data) => {
        if (isMounted) setImageUrl(data.imageUrl);
      })
      .catch(() => {});

    if (!viewRecordedRef.current && user?._id) {
      viewRecordedRef.current = true;
      createInteraction({
        userId: user._id,
        listingId,
        type: "VIEW",
      }).catch((err) => console.error("Failed to record view:", err));
    }

    return () => {
      isMounted = false;
    };
  }, [listingId, user?._id]);


  if (!listing) {
    return (
      <div className="feed-page">
        <header className="feed-header">
          <div className="header-left">
            <h1>MarketMind</h1>
          </div>
          <div className="header-right">
            <span className="current-user">{user.name}</span>
            <button type="button" className="switch-btn logout-btn" onClick={onLogout}>
              Log Out
            </button>
          </div>
        </header>
        <button
          type="button"
          className="back-btn icon-only"
          onClick={onBack}
          aria-label="Back to Feed"
          title="Back to Feed"
        >
          <FiArrowLeft className="back-icon" />
        </button>
        <p style={{ marginTop: "20px" }}>Listing not found.</p>
      </div>
    );
  }

  const formatPrice = (price) => `Rs. ${price.toLocaleString()}`;

  return (
    <div className="feed-page detail-page">
      <header className="feed-header">
        <div className="header-left">
          <h1>MarketMind</h1>
        </div>
        <div className="header-right">
          <span className="current-user">{user.name}</span>
          <button type="button" className="switch-btn logout-btn" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </header>

      <div style={{ marginBottom: "20px" }}>
        <button
          type="button"
          className="back-btn icon-only"
          onClick={onBack}
          aria-label="Back to Feed"
          title="Back to Feed"
        >
          <FiArrowLeft className="back-icon" />
        </button>
      </div>

      <div className="detail-container">
        <div className="detail-image-box">
          {imageUrl ? (
            <img src={imageUrl} alt={listing.title} className="detail-img" />
          ) : (
            <div className="placeholder-img detail-placeholder">
              {listing.category === "vehicle" ? "🚗" : "🏠"}
            </div>
          )}
          <span className="category-badge">{listing.category}</span>
        </div>

        <div className="detail-info">
          <h2 className="detail-title">{listing.title}</h2>
          <p className="detail-price">{formatPrice(listing.price)}</p>
          <p className="card-location">📍 {listing.location}</p>

          <div className="detail-attributes-box">
            <h3>Specifications</h3>
            {listing.category === "vehicle" && (
              <div className="attributes-grid">
                <div><strong>Make:</strong> {listing.attributes?.make || "N/A"}</div>
                <div><strong>Model:</strong> {listing.attributes?.model || "N/A"}</div>
                <div><strong>Year:</strong> {listing.attributes?.year || "N/A"}</div>
              </div>
            )}
            {listing.category === "property" && (
              <div className="attributes-grid">
                <div><strong>Property Type:</strong> {listing.attributes?.propertyType || "N/A"}</div>
                <div><strong>Bedrooms:</strong> {listing.attributes?.bedrooms || "N/A"}</div>
                <div><strong>Land Size:</strong> {listing.attributes?.landSize || "N/A"}</div>
              </div>
            )}
          </div>

          <div className="detail-actions">
            <ActionButtons
              userId={user._id}
              listingId={listing._id}
              isSaved={isSaved}
              onToggleSave={onToggleSave}
              onViewDetails={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
