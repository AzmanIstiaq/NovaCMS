import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getRole } from "../api";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const role = getRole();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
        const data = await apiFetch(`/posts?page=${page}&limit=10`);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message || "Failed to load posts");
      }
    };
    loadPosts();
  }, [page]);

  console.log("User role:", role);

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => navigate("/create-post")}>Create Post</button>

        {role === "admin" && (
          <button onClick={() => navigate("/users")}>Users</button>
        )}

        <button onClick={logout}>Logout</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3 onClick={() => navigate(`/post/${post.slug}`)}>{post.title}</h3>
            <p>By: {post.author.name}</p>
            <p>{post.content}</p>
            <p>Status: {post.status}</p>

            <button onClick={() => navigate(`/edit-post/${post._id}`)}>
              Edit
            </button>

            {role === "admin" && (
              <button
                onClick={() => handleDelete(post._id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
