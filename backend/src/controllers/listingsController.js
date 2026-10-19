import Listing from "../models/Listing.js";

export const getListings = async (req, res, next) => {
  try {
    const { category, location } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = location;
    }

    const listings = await Listing.find(filter).sort({ _id: 1 });
    res.json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing);
  } catch (error) {
    next(error);
  }
};
