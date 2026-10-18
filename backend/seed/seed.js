import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import Listing from "../src/models/Listing.js";
import Interaction from "../src/models/Interaction.js";
import users from "./data/users.js";
import listings from "./data/listings.js";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteMany({});
    await Listing.deleteMany({});
    await Interaction.deleteMany({});

    await User.insertMany(users);
    await Listing.insertMany(listings);

    console.log(`Seeded ${users.length} users and ${listings.length} listings`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
