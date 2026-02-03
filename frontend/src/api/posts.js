import { apiFetch } from "../api";

export const submitForReview = (id) =>
  apiFetch(`/posts/id/${id}/submit`, { method: "PATCH" });

export const publishPost = (id) =>
  apiFetch(`/posts/id/${id}/publish`, { method: "PATCH" });

export const unpublishPost = (id) =>
  apiFetch(`/posts/id/${id}/unpublish`, { method: "PATCH" });

export const archivePost = (id) =>
  apiFetch(`/posts/id/${id}/archive`, { method: "PATCH" });

export const unarchivePost = (id) =>
  apiFetch(`/posts/id/${id}/unarchive`, { method: "PATCH" });
