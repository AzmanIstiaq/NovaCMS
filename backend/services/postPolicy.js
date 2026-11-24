export const isPostAuthor = (user, post) =>
  Boolean(user?._id && post?.author) &&
  post.author.toString() === user._id.toString();

export const canReadOrEditPost = (user, post) =>
  user?.role === "admin" || (user?.role === "editor" && isPostAuthor(user, post));

export const canSubmitPost = (user, post) =>
  post?.status === "draft" &&
  (user?.role === "admin" || (user?.role === "editor" && isPostAuthor(user, post)));

export const canPublishPost = (user, post) =>
  user?.role === "admin" && post?.status === "review";

export const canUnpublishPost = (user, post) =>
  user?.role === "admin" && post?.status === "published";

export const canArchivePost = (user, post) => {
  if (user?.role === "admin") return post?.status !== "archived";
  return (
    user?.role === "editor" &&
    isPostAuthor(user, post) &&
    ["draft", "review"].includes(post?.status)
  );
};

export const canUnarchivePost = (user, post) =>
  post?.status === "archived" &&
  (user?.role === "admin" || (user?.role === "editor" && isPostAuthor(user, post)));
