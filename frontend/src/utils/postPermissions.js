export const canSubmitForReview = (user, post) =>
  ["editor", "admin"].includes(user?.role) && post?.status === "draft";

const isAuthor = (user, post) =>
  post?.author?._id
    ? post.author._id === user?._id || post.author._id === user?.id
    : post?.author === user?._id || post?.author === user?.id;

export const canPublish = (user, post) =>
  user?.role === "admin" && post?.status === "review";

export const canUnpublish = (user, post) =>
  (["admin", "editor"].includes(user?.role) || isAuthor(user, post)) &&
  post?.status === "published";

export const canArchive = (user, post) =>
  (["admin", "editor"].includes(user?.role) || isAuthor(user, post)) &&
  post?.status !== "archived";

export const canUnarchive = (user, post) =>
  (["admin", "editor"].includes(user?.role) || isAuthor(user, post)) &&
  post?.status === "archived";
