import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Basic in-memory login limiter to slow brute-force attempts (dependency-free)
const loginLimiter = (() => {
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const max = 20;
  const hits = new Map(); // key: ip, value: { count, expires }

  const clean = () => {
    const now = Date.now();
    for (const [ip, meta] of hits.entries()) {
      if (meta.expires <= now) hits.delete(ip);
    }
  };

  setInterval(clean, windowMs).unref();

  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();
    const meta = hits.get(ip) || { count: 0, expires: now + windowMs };
    if (meta.expires <= now) {
      meta.count = 0;
      meta.expires = now + windowMs;
    }
    meta.count += 1;
    hits.set(ip, meta);

    if (meta.count > max) {
      return res
        .status(429)
        .json({ message: "Too many login attempts. Please try again later." });
    }
    next();
  };
})();

// Registration route
router.post("/register", registerUser);

// Temporary test login route (bypass controller for debugging)
router.post("/login", loginLimiter, (req, res) => {
  try {
    // Call the actual login function
    return loginUser(req, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login error: " + error.message });
  }
});

// Protected route example
router.get("/me", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

// Admin-only route
router.get("/admin", protect, requireRole("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

export default router;
