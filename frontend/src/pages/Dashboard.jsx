import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import {
  submitForReview,
  publishPost,
  unpublishPost,
  archivePost,
  unarchivePost,
} from "../api/posts";
import { useAuth } from "../auth/AuthContex";
import PostCard from "../components/PostCard";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;

  const loadPosts = async () => {
    try {
      const data = await apiFetch(`/posts/user`);
      setPosts(data.posts || data); // Handle different response formats
    } catch (err) {
      setError(err.message || "Failed to load posts");
    }
  };

  const groupPostsByStatus = (posts) => {
    return {
      published: posts.filter(post => post.status === 'published'),
      review: posts.filter(post => post.status === 'review'),
      draft: posts.filter(post => post.status === 'draft'),
      archived: posts.filter(post => post.status === 'archived'),
    };
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await apiFetch(`/posts/id/${id}`, { method: "DELETE" });
      await loadPosts();
    } catch (err) {
      setError(err.message || "Failed to delete post");
    }
  };

  // Workflow handlers
  const handleSubmit = async (id) => {
    try {
      await submitForReview(id);
      await loadPosts();
    } catch (err) {
      setError(err.message || "Failed to submit post for review");
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishPost(id);
      await loadPosts();
    } catch (err) {
      setError(err.message || "Failed to publish post");
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await unpublishPost(id);
      await loadPosts();
    } catch (err) {
      setError(err.message || "Failed to unpublish post");
    }
  };

  const handleArchive = async (id) => {
    try {
      await archivePost(id);
      await loadPosts();
    } catch (err) {
      setError(err.message || "Failed to archive post");
    }
  };

  const handleUnarchive = async (id) => {
    try {
      await unarchivePost(id);
      await loadPosts();
    } catch (err) {
      setError(err.message || "Failed to unarchive post");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const groupedPosts = groupPostsByStatus(posts);

  const renderPostSection = (title, postList, emptyMessage = `No ${title.toLowerCase()} posts`) => (
    <div key={title} className="post-section">
      <h2 className="section-title">{title}</h2>
      {postList.length === 0 ? (
        <p className="muted">{emptyMessage}</p>
      ) : (
        <div className="cards-stack">
          {postList.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              role={role}
              onEdit={(id) => navigate(`/edit-post/${id}`)}
              onDelete={handleDelete}
              onSubmit={handleSubmit}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onArchive={handleArchive}
              onUnarchive={handleUnarchive}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1 className="hero-title">Dashboard</h1>
          <p className="muted">Manage posts and users with confidence.</p>
        </div>
        <div className="hero-actions">
          {role !== "viewer" && (
            <button onClick={() => navigate("/create-post")}>Create Post</button>
          )}
          {role === "admin" && (
            <button className="ghost" onClick={() => navigate("/users")}>
              Users
            </button>
          )}
        </div>
      </section>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="posts-container">
        {renderPostSection("Published", groupedPosts.published)}
        {renderPostSection("Review", groupedPosts.review)}
        {renderPostSection("Draft", groupedPosts.draft)}
        {renderPostSection("Archived", groupedPosts.archived)}
      </div>
    </main>
  );
};

export default Dashboard;
