import { logger } from "../utils/logger.js";
import { config } from "../config/config.js";

export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    status = 400;
    message = "Invalid resource identifier";
  } else if (err.code === 11000) {
    status = 409;
    message = "A resource with that unique value already exists";
  } else if (err instanceof SyntaxError && "body" in err) {
    status = 400;
    message = "Invalid JSON payload";
  }
  
  // Log the error with context
  logger.error(`${req.method} ${req.path} - ${status}: ${message}`, {
    method: req.method,
    path: req.path,
    status,
    error: err.message,
    stack: err.stack,
    user: req.user?.userId || 'anonymous'
  });

  res.status(status).json({
    message,
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
