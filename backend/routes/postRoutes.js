import express from "express";
import {
  createPost,
  getPostBySlug,
  updatePost,
  deletePost,
  getPublishedPosts,
} from "../controllers/postController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new post (editor or admin role required)
router.post("/", protect, requireRole("editor"), createPost);
router.get("/:slug", getPostBySlug);
router.put("/:id", protect, requireRole("editor"), updatePost);
router.delete("/:id", protect, requireRole("admin"), deletePost);
router.get("/", getPublishedPosts);

export default router;
