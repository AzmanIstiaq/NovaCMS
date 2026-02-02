import React from "react";
import Card from "./Card";

const PostCard = ({ post, role, onEdit, onDelete }) => {
  const authorName = post?.author?.name || "Unknown author";
  const status = (post.status || "draft").toLowerCase();
  const statusBadge = (
    <span className={`status-badge status-${status}`}>{post.status}</span>
  );

  const footerActions = [
    <button key="edit" onClick={() => onEdit(post._id)}>
      Edit
    </button>,
    role === "admin" ? (
      <button
        key="delete"
        className="danger"
        onClick={() => onDelete(post._id)}
      >
        Delete
      </button>
    ) : null,
  ].filter(Boolean);

  return (
    <Card
      className="card-dark"
      title={post.title}
      subtitle={`By: ${authorName}`}
      headerRight={statusBadge}
      onTitleClick={() => onEdit(post._id)}
      footer={footerActions}
    >
      <p>{post.content}</p>
    </Card>
  );
};

export default PostCard;
