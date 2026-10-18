import Interaction, { INTERACTION_TYPES } from "../models/Interaction.js";
import User from "../models/User.js";
import Listing from "../models/Listing.js";

export const createInteraction = async (req, res, next) => {
  try {
    const { userId, listingId, type } = req.body;

    if (!userId || !listingId || !type) {
      return res.status(400).json({ error: "userId, listingId, and type are required" });
    }

    if (!INTERACTION_TYPES.includes(type)) {
      return res.status(400).json({
        error: `Invalid interaction type. Must be one of: ${INTERACTION_TYPES.join(", ")}`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const interaction = await Interaction.findOneAndUpdate(
      { userId, listingId, type },
      { $setOnInsert: { userId, listingId, type, createdAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(interaction);
  } catch (error) {
    next(error);
  }
};

export const getUserInteractions = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const interactions = await Interaction.find({ userId })
      .populate("listingId")
      .sort({ createdAt: -1 });

    res.json(interactions);
  } catch (error) {
    next(error);
  }
};
