# Repository guide

## Architecture

- `frontend/`: Create React App client using React Router and React Bootstrap
- `backend/`: Express 5 API, Mongoose models, JWT authentication
- `backend/services/postPolicy.js`: canonical ownership and workflow policy
- `backend/tests/`: dependency-free Node test suite
- MongoDB is the only persistent data store

The backend is the authorisation boundary. Never rely on hidden buttons or client routes for security. Keep frontend permissions aligned with `postPolicy.js`.

## Verified commands

Run from the repository root:

```bash
npm run dev
npm test
npm run build
node --check backend/server.js
git diff --check
```

Individual suites:

```bash
npm test --prefix backend
set CI=true && npm test --prefix frontend -- --watchAll=false
npm run build --prefix frontend
```

On PowerShell, set CI with `$env:CI='true'` and remove it after the test command.

`backend/tests/integration.test.js` skips unless `NOVACMS_INTEGRATION_MONGO_URI` is explicitly set. Point it only at a disposable database; the test drops that database during cleanup.

## Conventions and constraints

- Use ES modules in `backend/`; the root package remains CommonJS for tooling.
- Wrap async Express handlers with `asyncHandler` and let the central error middleware normalize failures.
- Validate input before database writes and cap user-controlled list sizes.
- Use dedicated workflow endpoints; `PUT /api/posts/id/:id` must not mutate status.
- Editors may access only their own private posts. Admins manage all posts and users.
- Never add secrets, default credentials, production data, or `.env` files.
- Avoid new dependencies unless the standard library or current stack cannot solve the problem clearly.
- Do not commit generated changes blindly. The repository currently tracks `frontend/build`; verify source and build artifacts remain synchronized if those artifacts are retained.
- Do not commit, push, deploy, or mutate production data without explicit instruction.

## Environment

Backend requires `MONGO_URI` and a `JWT_SECRET` of at least 32 characters. Optional variables are `JWT_EXPIRES_IN` (default `1h`), `PORT` (default `5000`), `CORS_ORIGIN` (default `http://localhost:3000`), and `NODE_ENV`.

Frontend uses `REACT_APP_API_BASE_URL`, defaulting to `http://localhost:5000/api`.
