import { useState } from "react";
import { FiEye, FiBookmark, FiPhone, FiCheck } from "react-icons/fi";
import { createInteraction } from "../services/api";

export default function ActionButtons({ userId, listingId }) {
  const [clicked, setClicked] = useState({});

  const handleAction = async (type) => {
    try {
      await createInteraction({ userId, listingId, type });
      setClicked((prev) => ({ ...prev, [type]: true }));
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
        {clicked.VIEW ? <FiCheck className="btn-icon" /> : <FiEye className="btn-icon" />}
        {clicked.VIEW ? "Viewed" : "View"}
      </button>
      <button
        className={`action-btn save ${clicked.SAVE ? "active" : ""}`}
        onClick={() => handleAction("SAVE")}
      >
        {clicked.SAVE ? <FiCheck className="btn-icon" /> : <FiBookmark className="btn-icon" />}
        {clicked.SAVE ? "Saved" : "Save"}
      </button>
      <button
        className={`action-btn contact ${clicked.CONTACT ? "active" : ""}`}
        onClick={() => handleAction("CONTACT")}
      >
        {clicked.CONTACT ? <FiCheck className="btn-icon" /> : <FiPhone className="btn-icon" />}
        {clicked.CONTACT ? "Contacted" : "Contact"}
      </button>
    </div>
  );
}
