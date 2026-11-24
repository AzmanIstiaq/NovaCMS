import test from "node:test";
import assert from "node:assert/strict";
import {
  canArchivePost,
  canPublishPost,
  canReadOrEditPost,
  canSubmitPost,
  canUnarchivePost,
  canUnpublishPost,
} from "../services/postPolicy.js";

const author = { _id: "author-1", role: "editor" };
const otherEditor = { _id: "editor-2", role: "editor" };
const admin = { _id: "admin-1", role: "admin" };
const post = (status, authorId = "author-1") => ({ status, author: authorId });

test("editors can only read and edit their own private posts", () => {
  assert.equal(canReadOrEditPost(author, post("draft")), true);
  assert.equal(canReadOrEditPost(otherEditor, post("draft")), false);
  assert.equal(canReadOrEditPost(admin, post("draft")), true);
});

test("draft submission is limited to the author or an admin", () => {
  assert.equal(canSubmitPost(author, post("draft")), true);
  assert.equal(canSubmitPost(otherEditor, post("draft")), false);
  assert.equal(canSubmitPost(admin, post("draft")), true);
  assert.equal(canSubmitPost(author, post("review")), false);
});

test("only admins can publish and unpublish valid workflow states", () => {
  assert.equal(canPublishPost(admin, post("review")), true);
  assert.equal(canPublishPost(author, post("review")), false);
  assert.equal(canPublishPost(admin, post("draft")), false);
  assert.equal(canUnpublishPost(admin, post("published")), true);
  assert.equal(canUnpublishPost(author, post("published")), false);
});

test("editors can archive their own unpublished work but not published content", () => {
  assert.equal(canArchivePost(author, post("draft")), true);
  assert.equal(canArchivePost(author, post("review")), true);
  assert.equal(canArchivePost(author, post("published")), false);
  assert.equal(canArchivePost(otherEditor, post("draft")), false);
  assert.equal(canArchivePost(admin, post("published")), true);
});

test("archived posts can only be restored by their editor author or an admin", () => {
  assert.equal(canUnarchivePost(author, post("archived")), true);
  assert.equal(canUnarchivePost(otherEditor, post("archived")), false);
  assert.equal(canUnarchivePost(admin, post("archived")), true);
  assert.equal(canUnarchivePost(author, post("draft")), false);
});
