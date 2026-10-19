import express from "express";
import { getListings, getListingById } from "../controllers/listingsController.js";

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListingById);

export default router;
