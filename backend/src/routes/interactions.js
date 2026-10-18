import express from "express";
import {
  createInteraction,
  getUserInteractions,
} from "../controllers/interactionsController.js";

const router = express.Router();

router.post("/", createInteraction);
router.get("/:userId", getUserInteractions);

export default router;
