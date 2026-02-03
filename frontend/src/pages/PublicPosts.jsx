import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

const PublicPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await apiFetch("/posts");
        setPosts(data.posts || data);
      } catch (err) {
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) return <div className="container"><p>Loading posts...</p></div>;
  if (error) return <div className="container"><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <main className="page-shell page-public-posts">
      <section className="hero">
        <div>
          <p className="eyebrow">Public Content</p>
          <h1 className="hero-title">Published Posts</h1>
          <p className="muted">Browse all published content from Nova CMS</p>
        </div>
      </section>

      {posts.length === 0 ? (
        <div className="container">
          <p className="muted">No published posts available.</p>
        </div>
      ) : (
        <div className="container">
          <div className="posts-list">
            {posts.map((post) => (
              <article key={post._id} className="public-post-item">
                <div className="post-header">
                  <h2>
                    <Link to={`/post/${post.slug}`} className="post-title-link">
                      {post.title}
                    </Link>
                  </h2>
                  <div className="post-meta">
                    <span className="post-author">By {post.author?.name || 'Unknown'}</span>
                    <span className={`status-badge status-${post.status}`}>
                      {post.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="post-content">
                  <p>
                    {post.content?.substring(0, 200)}
                    {post.content?.length > 200 ? '...' : ''}
                  </p>
                </div>
                <div className="post-footer">
                  <Link
                    to={`/post/${post.slug}`}
                    className="read-more-link link-underline"
                  >
                    Read Full Post &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default PublicPosts;

