import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api";

const ViewPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await apiFetch(`/posts/${slug}`);
        setPost(post);
      } catch (err) {
        setError(err.message || "Failed to load post");
      }
    };
    loadPost();
  }, [slug]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <main className="container">
      <h1>{post.title}</h1>
      <p>
        <em>By {post.author.name}</em>
      </p>
      <article>{post.content}</article>
    </main>
  );
};

export default ViewPost;
