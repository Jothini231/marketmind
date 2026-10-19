import { useState, useEffect } from "react";
import { getListingImage } from "../services/api";
import ActionButtons from "./ActionButtons";

export default function ListingCard({
  listing,
  userId,
  isSaved,
  onToggleSave,
  onViewDetails,
}) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getListingImage(listing._id)
      .then((data) => {
        if (isMounted) setImageUrl(data.imageUrl);
      })
      .catch(() => {
        if (isMounted) setImageUrl(null);
      });

    return () => {
      isMounted = false;
    };
  }, [listing._id]);

  const formatPrice = (price) => `Rs. ${price.toLocaleString()}`;

  return (
    <div className="listing-card">
      <div className="card-image" onClick={() => onViewDetails && onViewDetails(listing._id)} style={{ cursor: "pointer" }}>
        {imageUrl ? (
          <img src={imageUrl} alt={listing.title} />
        ) : (
          <div className="placeholder-img">
            {listing.category === "vehicle" ? "🚗" : "🏠"}
          </div>
        )}
        <span className="category-badge">{listing.category}</span>
      </div>
      <div className="card-body">
        <h3
          className="card-title"
          onClick={() => onViewDetails && onViewDetails(listing._id)}
          style={{ cursor: "pointer" }}
        >
          {listing.title}
        </h3>
        <p className="card-price">{formatPrice(listing.price)}</p>
        <p className="card-location">📍 {listing.location}</p>
        {listing.attributes && (
          <div className="card-attributes">
            {listing.category === "vehicle" && (
              <>
                {listing.attributes.make && <span>{listing.attributes.make}</span>}
                {listing.attributes.year && <span>{listing.attributes.year}</span>}
              </>
            )}
            {listing.category === "property" && (
              <>
                {listing.attributes.propertyType && (
                  <span>{listing.attributes.propertyType}</span>
                )}
                {listing.attributes.bedrooms && (
                  <span>{listing.attributes.bedrooms} bed</span>
                )}
                {listing.attributes.landSize && (
                  <span>{listing.attributes.landSize}</span>
                )}
              </>
            )}
          </div>
        )}
        <ActionButtons
          userId={userId}
          listingId={listing._id}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onViewDetails={onViewDetails}
        />
      </div>
    </div>
  );
}
