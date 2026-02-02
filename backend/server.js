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

// Only start the HTTP server once MongoDB is reachable
let server = null;
// start server ONCE
app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});

// connect to DB separately
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info("Connected to MongoDB successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error.message);
    logger.info("Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();
