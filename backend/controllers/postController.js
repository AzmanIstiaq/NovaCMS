import Posts from "../models/Posts.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, status } = req.body;

    // Basic validation
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
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
      status: status || "draft",
      author: req.user.userId, // Assuming req.user contains authenticated user info
    });

    // Save post to database
    await newPost.save();

    // Respond with success message
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single post by slug(public)
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Posts.findOne({ slug, status: "published" }).populate(
      "author",
      "name"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a post(author or admin)
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;

    const post = await Posts.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author or an admin
    if (
      post.author.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot edit this post" });
    }

    // Update post fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (status) {
      if (req.user.role === "admin") {
        post.status = status;
      } else {
        return res.status(403).json({
          message: "Forbidden: Only admin & author can change status",
        });
      }
    }

    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Post(Admin only)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Posts.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all published posts with pagination (public)
export const getPublishedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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
  } catch (error) {
    console.error("Error fetching published posts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPostsById = async (req, res) => {
  try {
    const posts = await Posts.findById(req.params.id);

    if (!posts) {
      return res.status(404).json({ message: "Posts not found" });
    }

    if (
      posts.author.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot view this post" });
    }

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
