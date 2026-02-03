import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("draft");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title || !content) {
      setError("Please fill in all fields");
      return;
    }
    try {
      await apiFetch("/posts", {
        method: "POST",
        body: JSON.stringify({ title, content, status }),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create post");
    }
  };
  return (
    <main className="container">
      <h2>Create Post</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button type="submit">Create Post</button>
      </form>
    </main>
  );
};

export default CreatePost;
