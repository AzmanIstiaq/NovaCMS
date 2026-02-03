import React from "react";
import Card from "./Card";
import { useAuth } from "../auth/AuthContex";
import {
  canSubmitForReview,
  canPublish,
  canUnpublish,
  canArchive,
  canUnarchive,
} from "../utils/postPermissions";

const PostCard = ({ 
  post, 
  role, 
  onEdit, 
  onDelete, 
  onSubmit, 
  onPublish, 
  onUnpublish, 
  onArchive, 
  onUnarchive 
}) => {
  const { user } = useAuth();
  const authorName = post?.author?.name || "Unknown author";
  const status = (post.status || "draft").toLowerCase();
  const statusBadge = (
    <span className={`status-badge status-${status}`}>{post.status?.toUpperCase()}</span>
  );
  const isAuthor =
    post?.author?._id
      ? post.author._id === user?._id || post.author._id === user?.id
      : post?.author === user?._id || post?.author === user?.id;
  const canEdit = role === "admin" || isAuthor;

  const footerActions = [
    // Edit button
    canEdit && (
      <button key="edit" onClick={() => onEdit(post._id)}>
        Edit
      </button>
    ),
    
    // Workflow buttons
    canSubmitForReview(user, post) && (
      <button key="submit" onClick={() => onSubmit(post._id)}>
        Submit for Review
      </button>
    ),
    
    canPublish(user, post) && (
      <button key="publish" onClick={() => onPublish(post._id)}>
        Publish
      </button>
    ),
    
    canUnpublish(user, post) && (
      <button key="unpublish" onClick={() => onUnpublish(post._id)}>
        Unpublish
      </button>
    ),
    
    canArchive(user, post) && (
      <button key="archive" onClick={() => onArchive(post._id)}>
        Archive
      </button>
    ),
    
    canUnarchive(user, post) && (
      <button key="unarchive" onClick={() => onUnarchive(post._id)}>
        Unarchive
      </button>
    ),
    
    // Delete button (admin only)
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
      titleClassName="line-clamp-1"
      subtitle={`By: ${authorName}`}
      headerRight={statusBadge}
      onTitleClick={() => onEdit(post._id)}
      footer={footerActions}
    >
      <p className="line-clamp-1">{post.content}</p>
    </Card>
  );
};

export default PostCard;
