import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await apiFetch(`/posts/id/${id}`);
        setTitle(post.title);
        setContent(post.content);
        setStatus(post.status);
      } catch (err) {
        setError(err.message || "Failed to load post");
      }
    };
    loadPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiFetch(`/posts/id/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, content, status }),
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to update post");
    }
  };

  return (
    <main className="container">
      <h2>Edit Post</h2>

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

        <button type="submit">Update Post</button>
      </form>
    </main>
  );
};
export default EditPost;
