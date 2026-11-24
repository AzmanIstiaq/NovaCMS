export const canSubmitForReview = (user, post) =>
  post?.status === "draft" &&
  (user?.role === "admin" || (user?.role === "editor" && isAuthor(user, post)));

const isAuthor = (user, post) =>
  post?.author?._id
    ? post.author._id === user?._id || post.author._id === user?.id
    : post?.author === user?._id || post?.author === user?.id;

export const canPublish = (user, post) =>
  user?.role === "admin" && post?.status === "review";

export const canUnpublish = (user, post) =>
  user?.role === "admin" && post?.status === "published";

export const canArchive = (user, post) =>
  user?.role === "admin"
    ? post?.status !== "archived"
    : user?.role === "editor" &&
      isAuthor(user, post) &&
      ["draft", "review"].includes(post?.status);

export const canUnarchive = (user, post) =>
  post?.status === "archived" &&
  (user?.role === "admin" || (user?.role === "editor" && isAuthor(user, post)));
