import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import usersRouter from "./routes/users.js";
import listingsRouter from "./routes/listings.js";
import interactionsRouter from "./routes/interactions.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/interactions", interactionsRouter);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
