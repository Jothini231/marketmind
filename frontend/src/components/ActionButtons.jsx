import { useState } from "react";
import { FiEye, FiBookmark, FiPhone, FiCheck } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import { createInteraction } from "../services/api";

export default function ActionButtons({
  userId,
  listingId,
  isSaved,
  onToggleSave,
  onViewDetails,
}) {
  const [contacted, setContacted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const handleContact = async () => {
    if (contacted || contactLoading) return;
    setContactLoading(true);
    try {
      await createInteraction({ userId, listingId, type: "CONTACT" });
      setContacted(true);
    } catch (err) {
      console.error("Failed to contact seller:", err);
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="action-buttons">
      {onViewDetails && (
        <button
          type="button"
          className="action-btn view"
          onClick={() => onViewDetails(listingId)}
          aria-label="View listing details"
        >
          <FiEye className="btn-icon" /> View
        </button>
      )}

      <button
        type="button"
        className={`action-btn bookmark-btn ${isSaved ? "saved" : ""}`}
        onClick={() => onToggleSave && onToggleSave(listingId)}
        aria-label={isSaved ? "Unsave listing" : "Save listing"}
        aria-pressed={!!isSaved}
      >
        {isSaved ? (
          <BsBookmarkFill className="btn-icon bookmark-icon-saved" />
        ) : (
          <FiBookmark className="btn-icon" />
        )}
        <span className="bookmark-text">{isSaved ? "Saved" : "Save"}</span>
      </button>

      <button
        type="button"
        className={`action-btn contact ${contacted ? "active" : ""}`}
        onClick={handleContact}
        disabled={contactLoading}
        aria-label="Contact seller"
      >
        {contacted ? (
          <>
            <FiCheck className="btn-icon" /> Contacted
          </>
        ) : (
          <>
            <FiPhone className="btn-icon" /> Contact
          </>
        )}
      </button>
    </div>
  );
}
