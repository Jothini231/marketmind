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
