import express from "express";
import { getListingImageUrl } from "../controllers/imagesController.js";

const router = express.Router();

router.get("/:listingId", getListingImageUrl);

export default router;
