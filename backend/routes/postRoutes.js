import express from "express";
import {
  createPost,
  getPostBySlug,
  updatePost,
  deletePost,
  getPublishedPosts,
  getPostsById,
} from "../controllers/postController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPublishedPosts);
router.get("/:slug", getPostBySlug);

// Route to create a new post (editor or admin role required)
router.post("/", protect, requireRole("editor"), createPost);
router.get("/id/:id", protect, requireRole("editor"), getPostsById);
router.put("/id/:id", protect, requireRole("editor"), updatePost);
router.delete("/:id", protect, requireRole("admin"), deletePost);

export default router;
