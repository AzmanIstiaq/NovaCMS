import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const protect = (req, res, next) => {
  try {
    //Read authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    //extract token
    const token = authHeader.split(" ")[1];

    //verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    //attach user to request
    req.user = {
      ...decoded,
      _id: decoded.userId,
      userId: decoded.userId,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userRole = req.user.role;

    //Admin can access all routes
    if (userRole === "admin") {
      return next();
    }

    if (userRole !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    return next();
  };
};
