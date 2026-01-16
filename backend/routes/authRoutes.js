import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Registration route
router.post("/register", registerUser);
// Login route
router.post("/login", loginUser);

// Protected route example
router.get("/me", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

// Admin-only route
router.get("/admin", protect, requireRole("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

export default router;
