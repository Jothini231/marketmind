import express from "express";
import {
  createInteraction,
  removeInteraction,
  getUserInteractions,
  getUserSavedListingIds,
} from "../controllers/interactionsController.js";

const router = express.Router();

router.post("/", createInteraction);
router.post("/unsave", removeInteraction);
router.get("/:userId", getUserInteractions);
router.get("/:userId/saved", getUserSavedListingIds);

export default router;
