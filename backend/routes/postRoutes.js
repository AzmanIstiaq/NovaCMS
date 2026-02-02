import express from "express";
import {
  createPost,
  getPostBySlug,
  updatePost,
  deletePost,
  getPublishedPosts,
  getUserPosts,
  getPostsById,
  submitForReview,
  publishPost,
  unpublishPost,
  archivePost,
  unarchivePost,
} from "../controllers/postController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get all published posts (no authentication required)
router.get("/", getPublishedPosts);

// Route to get all posts for authenticated user (Dashboard)
router.get("/user", protect, getUserPosts);

// Auth
router.post("/", protect, createPost); // author, editor, admin
router.get("/id/:id", protect, getPostsById); // author, editor, admin
router.put("/id/:id", protect, updatePost); // author, editor, admin
router.delete("/id/:id", protect, requireRole("admin"), deletePost); // admin

// workflow actions
router.patch("/id/:id/submit", protect, submitForReview);
router.patch("/id/:id/publish", protect, requireRole("editor"), publishPost);
router.patch("/id/:id/unpublish", protect, requireRole("editor"), unpublishPost);
router.patch("/id/:id/archive", protect, requireRole("editor"), archivePost);
router.patch("/id/:id/unarchive", protect, requireRole("editor"), unarchivePost);

// slug route (no authentication required)
router.get("/:slug", getPostBySlug);

export default router;
