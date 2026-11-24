import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import User from "../models/User.js";

const mongoUri = process.env.NOVACMS_INTEGRATION_MONGO_URI;

test(
  "registration, authentication, workflow, ownership, viewer restrictions, and bans",
  { skip: !mongoUri, timeout: 30_000 },
  async (t) => {
    process.env.MONGO_URI = mongoUri;
    process.env.JWT_SECRET = "integration-only-secret-at-least-32-characters";
    process.env.JWT_EXPIRES_IN = "5m";
    process.env.CORS_ORIGIN = "http://localhost:3000";
    process.env.NODE_ENV = "test";
    process.env.VERCEL = "1";

    const { default: app } = await import("../server.js");
    await mongoose.connection.asPromise();

    const server = await new Promise((resolve) => {
      const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
    });
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}/api`;

    t.after(async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
      await new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      );
    });

    const request = async (path, { token, ...options } = {}) => {
      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });
      const data = await response.json();
      return { status: response.status, data };
    };

    const accounts = [
      ["Admin", "admin.integration@example.test"],
      ["Editor", "editor.integration@example.test"],
      ["Other Editor", "other-editor.integration@example.test"],
      ["Viewer", "viewer.integration@example.test"],
    ];
    const password = "IntegrationPass123";

    for (const [name, email] of accounts) {
      const result = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      assert.equal(result.status, 201, `registration failed for ${email}`);
    }

    await User.updateOne(
      { email: "admin.integration@example.test" },
      { role: "admin" }
    );
    await User.updateMany(
      { email: { $in: ["editor.integration@example.test", "other-editor.integration@example.test"] } },
      { role: "editor" }
    );

    const login = async (email) => {
      const result = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      assert.equal(result.status, 200, `login failed for ${email}`);
      return result.data.token;
    };

    const adminToken = await login("admin.integration@example.test");
    const editorToken = await login("editor.integration@example.test");
    const otherEditorToken = await login("other-editor.integration@example.test");
    const viewerToken = await login("viewer.integration@example.test");

    const created = await request("/posts", {
      method: "POST",
      token: editorToken,
      body: JSON.stringify({
        title: "Integration Workflow",
        content: "Disposable integration content for the editorial workflow.",
      }),
    });
    assert.equal(created.status, 201);
    assert.equal(created.data.post.status, "draft");
    const postId = created.data.post._id;

    assert.equal(
      (await request(`/posts/id/${postId}`, { token: otherEditorToken })).status,
      403,
      "another editor must not read a private post"
    );
    assert.equal(
      (
        await request(`/posts/id/${postId}`, {
          method: "PUT",
          token: otherEditorToken,
          body: JSON.stringify({ content: "Unauthorized replacement content." }),
        })
      ).status,
      403,
      "another editor must not edit a private post"
    );

    assert.equal(
      (await request(`/posts/id/${postId}/submit`, { method: "PATCH", token: editorToken })).status,
      200
    );
    assert.equal(
      (await request(`/posts/id/${postId}/publish`, { method: "PATCH", token: editorToken })).status,
      403,
      "editors must not publish"
    );
    assert.equal(
      (await request(`/posts/id/${postId}/publish`, { method: "PATCH", token: adminToken })).status,
      200
    );

    const publicPost = await request("/posts/integration-workflow");
    assert.equal(publicPost.status, 200);
    assert.equal(publicPost.data.status, "published");

    assert.equal(
      (
        await request("/posts", {
          method: "POST",
          token: viewerToken,
          body: JSON.stringify({ title: "Viewer Post", content: "Viewer cannot create this post." }),
        })
      ).status,
      403,
      "viewers must not create posts"
    );
    assert.equal(
      (await request(`/posts/id/${postId}`, { token: viewerToken })).status,
      403,
      "viewers must not use the private post endpoint"
    );
    assert.equal(
      (await request("/users", { token: viewerToken })).status,
      403,
      "viewers must not list users"
    );

    const editor = await User.findOne({ email: "editor.integration@example.test" });
    const banned = await request(`/users/${editor._id}/status`, {
      method: "PUT",
      token: adminToken,
      body: JSON.stringify({ status: "banned" }),
    });
    assert.equal(banned.status, 200);
    assert.equal(banned.data.user.status, "banned");
    assert.equal(
      (await request("/auth/me", { token: editorToken })).status,
      403,
      "a ban must invalidate access for an existing token"
    );
  }
);
