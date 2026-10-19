import { useState } from "react";
import { FiEye, FiBookmark, FiPhone } from "react-icons/fi";
import { createInteraction } from "../services/api";

export default function ActionButtons({ userId, listingId, onInteraction }) {
  const [clicked, setClicked] = useState({});

  const handleAction = async (type) => {
    try {
      await createInteraction({ userId, listingId, type });
      setClicked((prev) => ({ ...prev, [type]: true }));
      if (onInteraction) {
        onInteraction();
      }
    } catch (err) {
      console.error("Interaction failed:", err);
    }
  };

  return (
    <div className="action-buttons">
      <button
        className={`action-btn view ${clicked.VIEW ? "active" : ""}`}
        onClick={() => handleAction("VIEW")}
      >
        <FiEye className="btn-icon" /> View
      </button>
      <button
        className={`action-btn save ${clicked.SAVE ? "active" : ""}`}
        onClick={() => handleAction("SAVE")}
      >
        <FiBookmark className="btn-icon" /> Save
      </button>
      <button
        className={`action-btn contact ${clicked.CONTACT ? "active" : ""}`}
        onClick={() => handleAction("CONTACT")}
      >
        <FiPhone className="btn-icon" /> Contact
      </button>
    </div>
  );
}
