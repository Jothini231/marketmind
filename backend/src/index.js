import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import usersRouter from "./routes/users.js";
import listingsRouter from "./routes/listings.js";
import interactionsRouter from "./routes/interactions.js";
import recommendationsRouter from "./routes/recommendations.js";
import imagesRouter from "./routes/images.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/interactions", interactionsRouter);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/images", imagesRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export default app;
