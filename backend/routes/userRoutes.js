import express from "express";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
} from "../controllers/userController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get all users (admin role required)
router.get("/", protect, requireRole("admin"), getAllUsers);

// Route to update user role (admin role required)
router.put("/:id/role", protect, requireRole("admin"), updateUserRole);

// Route to update user status (admin role required)
router.put("/:id/status", protect, requireRole("admin"), updateUserStatus);

export default router;
