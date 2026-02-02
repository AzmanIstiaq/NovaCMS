import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getRole } from "../api";
import PostCard from "../components/PostCard";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const role = getRole();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await apiFetch(`/posts/${id}`, { method: "DELETE" });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete post");
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await apiFetch(`/posts?limit=10`);
        setPosts(data.posts);
      } catch (err) {
        setError(err.message || "Failed to load posts");
      }
    };
    loadPosts();
  }, []);

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1 className="hero-title">Dashboard</h1>
          <p className="muted">Manage posts and users with confidence.</p>
        </div>
        <div className="hero-actions">
          <button onClick={() => navigate("/create-post")}>Create Post</button>
          {role === "admin" && (
            <button className="ghost" onClick={() => navigate("/users")}>
              Users
            </button>
          )}
        </div>
      </section>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <div className="cards-stack">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              role={role}
              onEdit={(id) => navigate(`/edit-post/${id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
