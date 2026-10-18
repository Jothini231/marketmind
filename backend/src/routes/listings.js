import express from "express";
import { getListings } from "../controllers/listingsController.js";

const router = express.Router();

router.get("/", getListings);

export default router;
