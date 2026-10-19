import { useState, useEffect } from "react";
import { getListingImage } from "../services/api";
import ActionButtons from "./ActionButtons";

export default function ListingCard({ listing, userId }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    getListingImage(listing._id)
      .then((data) => setImageUrl(data.imageUrl))
      .catch(() => setImageUrl(null));
  }, [listing._id]);

  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  return (
    <div className="listing-card">
      <div className="card-image">
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
        <h3 className="card-title">{listing.title}</h3>
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
        />
      </div>
    </div>
  );
}
