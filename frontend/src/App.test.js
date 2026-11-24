import {
  canArchive,
  canPublish,
  canSubmitForReview,
  canUnpublish,
} from "./utils/postPermissions";

const author = { id: "author-1", role: "editor" };
const otherEditor = { id: "editor-2", role: "editor" };
const admin = { id: "admin-1", role: "admin" };
const post = (status) => ({ status, author: { _id: "author-1" } });

test("editor workflow controls are limited to owned unpublished posts", () => {
  expect(canSubmitForReview(author, post("draft"))).toBe(true);
  expect(canSubmitForReview(otherEditor, post("draft"))).toBe(false);
  expect(canArchive(author, post("review"))).toBe(true);
  expect(canArchive(author, post("published"))).toBe(false);
});

test("publish and unpublish controls are admin-only", () => {
  expect(canPublish(admin, post("review"))).toBe(true);
  expect(canPublish(author, post("review"))).toBe(false);
  expect(canUnpublish(admin, post("published"))).toBe(true);
  expect(canUnpublish(author, post("published"))).toBe(false);
});
