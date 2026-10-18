import { getRecommendations } from "../services/recommendationService.js";
import User from "../models/User.js";

export const getUserRecommendations = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const recommendations = await getRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
};
