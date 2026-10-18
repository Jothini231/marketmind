import Listing from "../models/Listing.js";
import { getPresignedImageUrl } from "../services/s3Service.js";

const DEFAULT_VEHICLE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80";
const DEFAULT_PROPERTY_PLACEHOLDER =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80";

export const getListingImageUrl = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    let imageUrl = null;

    if (listing.imageKey) {
      imageUrl = await getPresignedImageUrl(listing.imageKey);
    }

    if (!imageUrl) {
      imageUrl =
        listing.category === "vehicle"
          ? DEFAULT_VEHICLE_PLACEHOLDER
          : DEFAULT_PROPERTY_PLACEHOLDER;
    }

    res.json({ listingId, imageUrl });
  } catch (error) {
    next(error);
  }
};
