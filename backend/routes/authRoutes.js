import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Registration route
router.post("/register", registerUser);

// Temporary test login route (bypass controller for debugging)
router.post("/login", (req, res) => {
  console.log('Direct login route hit:', req.body);
  try {
    // Call the actual login function
    return loginUser(req, res);
  } catch (error) {
    console.error('Login error:', error);
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
