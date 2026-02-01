import { logger } from "../utils/logger.js";
import { config } from "../config/config.js";

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  
  // Log the error with context
  logger.error(`${req.method} ${req.path} - ${status}: ${err.message}`, {
    method: req.method,
    path: req.path,
    status,
    error: err.message,
    stack: err.stack,
    user: req.user?.userId || 'anonymous'
  });

  res.status(status).json({
    message: err.message || "Internal Server Error",
    ...(config.nodeEnv === "development" && { 
      stack: err.stack,
      details: {
        method: req.method,
        path: req.path,
        status
      }
    }),
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};