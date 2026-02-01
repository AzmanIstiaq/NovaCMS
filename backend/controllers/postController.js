import Posts from "../models/Posts.js";
import { logger } from "../utils/logger.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

export const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // Manual payload validation
  if (typeof title !== "string" || title.length < 3) {
    return res.status(400).json({ message: "Invalid title: must be at least 3 characters" });
  }
  
  if (typeof title !== "string" || title.length > 200) {
    return res.status(400).json({ message: "Invalid title: must be less than 200 characters" });
  }
  
  if (typeof content !== "string" || content.length < 10) {
    return res.status(400).json({ message: "Invalid content: must be at least 10 characters" });
  }
  
  if (typeof content !== "string" || content.length > 10000) {
    return res.status(400).json({ message: "Invalid content: must be less than 10,000 characters" });
  }

  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  // Check for existing slug
  const existingPost = await Posts.findOne({ slug });
  if (existingPost) {
    return res
      .status(400)
      .json({ message: "Post with this title already exists" });
  }

  // Create new post
  const newPost = new Posts({
    title,
    slug,
    content,
    status:"draft",
    author: req.user._id,
  });

  // Save post to database
  await newPost.save();

  // Respond with success message
  res
    .status(201)
    .json({ message: "Post created successfully", post: newPost });
});

// Get a single post by slug(public)
export const getPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await Posts.findOne({ slug, status: "published" }).populate(
    "author",
    "name"
  );

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json(post);
});

// Update a post(author or admin)
export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Manual payload validation
  if (title !== undefined) {
    if (typeof title !== "string" || title.length < 3) {
      return res.status(400).json({ message: "Invalid title: must be at least 3 characters" });
    }
    
    if (typeof title !== "string" || title.length > 200) {
      return res.status(400).json({ message: "Invalid title: must be less than 200 characters" });
    }
  }
  
  if (content !== undefined) {
    if (typeof content !== "string" || content.length < 10) {
      return res.status(400).json({ message: "Invalid content: must be at least 10 characters" });
    }
    
    if (typeof content !== "string" || content.length > 10000) {
      return res.status(400).json({ message: "Invalid content: must be less than 10,000 characters" });
    }
  }

  const post = await Posts.findById(id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Check if the user is the author or an admin
  const isAuthor = post.author.toString() === req.user._id.toString();
  const isEditorOrAdmin = req.user.role === "editor" || req.user.role === "admin";

  if (!isAuthor && !isEditorOrAdmin) {
    return res.status(403).json({
      message: "Forbidden: You cannot edit this post",
    });
  }

  // Update post fields
  if (title) post.title = title;
  if (content) post.content = content;

  await post.save();

  res.status(200).json({ message: "Post updated successfully", post });
});

// Delete Post(Admin only)
export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Posts.findById(id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  await post.deleteOne();

  res.status(200).json({ message: "Post deleted successfully" });
});

// Get all published posts with pagination (public)
export const getPublishedPosts = asyncHandler(async (req, res) => {
  // Manual query parameter validation
  const pageParam = req.query.page;
  const limitParam = req.query.limit;
  
  let page = 1;
  let limit = 10;
  
  if (pageParam !== undefined) {
    if (typeof pageParam !== "string" || !/^\d+$/.test(pageParam)) {
      return res.status(400).json({ message: "Invalid page: must be a positive integer" });
    }
    page = parseInt(pageParam);
    if (page < 1) {
      return res.status(400).json({ message: "Invalid page: must be at least 1" });
    }
  }
  
  if (limitParam !== undefined) {
    if (typeof limitParam !== "string" || !/^\d+$/.test(limitParam)) {
      return res.status(400).json({ message: "Invalid limit: must be a positive integer" });
    }
    limit = parseInt(limitParam);
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ message: "Invalid limit: must be between 1 and 100" });
    }
  }
  
  const skip = (page - 1) * limit;

  const posts = await Posts.find({ status: "published" })
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Posts.countDocuments({ status: "published" });
  const totalPages = Math.max(1, Math.ceil(totalPosts / limit));

  res.status(200).json({
    page,
    totalPages,
    totalPosts,
    posts,
  });
});

export const getPostsById = asyncHandler(async (req, res) => {
  const posts = await Posts.findById(req.params.id);

  if (!posts) {
    return res.status(404).json({ message: "Posts not found" });
  }

  const isAuthor = posts.author.toString() === req.user._id.toString();
  const isEditorOrAdmin = req.user.role === "editor" || req.user.role === "admin";

  if (!isAuthor && !isEditorOrAdmin) {
    return res.status(403).json({
      message: "Forbidden: You cannot view this post",
    });
  }

  res.json(posts);
});

export const submitForReview = asyncHandler(async (req, res) => {
  const post = await Posts.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const isAuthor = post.author.toString() === req.user._id.toString();
  if (!isAuthor) {
    return res.status(403).json({ message: "Only author can submit for review" });
  }

  if (post.status !== "draft") {
    return res.status(400).json({
      message: "Only draft posts can be submitted for review",
    });
  }

  post.status = "review";
  await post.save();

  res.status(200).json({ message: "Post submitted for review successfully" });
});

export const publishPost = asyncHandler(async (req, res) => {
  const post = await Posts.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.status !== "review") {
    return res.status(400).json({
      message: "Only posts in review can be published",
    });
  }

  post.status = "published";
  await post.save();

  res.status(200).json({ message: "Post published successfully" });
});

export const unpublishPost = asyncHandler(async (req, res) => {
  const post = await Posts.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.status !== "published") {
    return res.status(400).json({
      message: "Only published posts can be unpublished",
    });
  }

  post.status = "review";
  await post.save();

  res.status(200).json({ message: "Post unpublished successfully" });
});

export const archivePost = asyncHandler(async (req, res) => {
  const post = await Posts.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.status === "archived") {
    return res.status(400).json({
      message: "Post is already archived",
    });
  }

  post.status = "archived";
  await post.save();

  res.status(200).json({ message: "Post archived successfully" });
});

export const unarchivePost = asyncHandler(async (req, res) => {
  const post = await Posts.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.status !== "archived") {
    return res.status(400).json({
      message: "Post is not archived",
    });
  }

  post.status = "review";
  await post.save();

  res.status(200).json({ message: "Post unarchived successfully" });
});
