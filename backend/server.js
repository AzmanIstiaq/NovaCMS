import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

import { config } from "./config/config.js";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to Nova CMS Backend!");
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Track MongoDB connection across invocations (important for serverless)
let mongoPromise = null;
const connectDB = async () => {
  // Reuse existing connection when possible
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!mongoPromise) {
    mongoPromise = mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    mongoPromise
      .then(() => logger.info("Connected to MongoDB successfully"))
      .catch((error) => {
        logger.error("MongoDB connection error:", error.message);
        // Reset promise so the next request retries
        mongoPromise = null;
      });
  }
  return mongoPromise;
};

// Kick off DB connection on cold start
connectDB();

// In Vercel serverless, the platform provides the listener. For local dev, start it here.
if (process.env.VERCEL !== "1") {
  app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`);
  });
}

// Export the app for Vercel (@vercel/node accepts an Express handler)
export default app;
