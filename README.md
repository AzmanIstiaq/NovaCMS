# NovaCMS

NovaCMS is a full-stack content management system for small publishing teams that need clear ownership, editorial review, controlled publishing, and basic user administration. It demonstrates authentication, database-backed role enforcement, a draft-to-publish workflow, and a React client consuming a protected Express API.

- Existing deployment: [nova-cms.vercel.app](https://nova-cms.vercel.app/)
- Source: [github.com/AzmanIstiaq/NovaCMS](https://github.com/AzmanIstiaq/NovaCMS)

The deployment link predates the current security improvements. Revalidate its environment variables, API version, and complete workflow before presenting it as the portfolio demo.

## Verified capabilities

- Account registration and bcrypt password hashing
- JWT login with configurable expiry and server-side checks for bans and role changes
- Three roles: `admin`, `editor`, and `viewer`
- Editors create and manage only their own drafts; admins can review all content
- Explicit draft → review → published workflow with archive/restore actions
- Public, slug-based access to published posts only
- Admin-only user listing, role updates, and ban/unban controls
- Pagination and input limits on post listing and content APIs
- Responsive React interface and production build

The API—not the UI—is the security boundary. Protected requests reload the current user from MongoDB, so a ban or role change takes effect without waiting for an existing token to expire.

## Architecture

```text
React client (frontend/)
  └─ fetch + Bearer JWT
Express API (backend/)
  ├─ authentication and role middleware
  ├─ post workflow policy and controllers
  └─ Mongoose models
MongoDB
```

| Role | Content access | User administration |
| --- | --- | --- |
| Viewer | Read published posts | None |
| Editor | Create drafts; edit, submit, archive, and restore own unpublished posts | None |
| Admin | Review all posts; publish, unpublish, archive, restore, and delete | List users, change roles, ban/unban |

## API overview

All API routes are under `/api`.

| Area | Endpoints |
| --- | --- |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Public posts | `GET /posts`, `GET /posts/:slug` |
| Editorial posts | `GET /posts/user`, `GET/PUT/DELETE /posts/id/:id`, `POST /posts` |
| Workflow | `PATCH /posts/id/:id/{submit,publish,unpublish,archive,unarchive}` |
| User administration | `GET /users`, `PUT /users/:id/role`, `PUT /users/:id/status` |

The route middleware and workflow policy apply the role and ownership restrictions documented above. General post updates cannot change workflow status.

## Local setup

Requirements: Node.js 20 or later and MongoDB.

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Create `backend/.env` (environment files are ignored by Git):

```dotenv
MONGO_URI=mongodb://localhost:27017/nova-cms
JWT_SECRET=replace-with-at-least-32-random-characters
JWT_EXPIRES_IN=1h
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

Create `frontend/.env.local` when the API is not at the local default:

```dotenv
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Start both applications from the repository root:

```bash
npm run dev
```

The client is available at `http://localhost:3000`; the API is at `http://localhost:5000`.

New registrations are viewers. The repository intentionally does not contain a default admin password. Promote the first admin directly in a controlled development database before demonstrating administration features.

## Tests and verification

```bash
npm test
npm run build
node --check backend/server.js
git diff --check
```

The backend tests exercise ownership and workflow policy. Frontend tests verify matching action visibility. A production frontend build also runs Create React App's configured ESLint checks.

The database-backed integration test is gated to prevent accidental use of a configured database. Run it only with an explicitly disposable database:

```powershell
$env:NOVACMS_INTEGRATION_MONGO_URI='mongodb://127.0.0.1:27018/nova-cms-integration'
npm test --prefix backend
Remove-Item Env:NOVACMS_INTEGRATION_MONGO_URI
```

## Deployment

The backend includes `backend/vercel.json` for a Vercel Node function. Configure `MONGO_URI`, a 32+ character `JWT_SECRET`, `JWT_EXPIRES_IN`, and the exact deployed frontend origin in `CORS_ORIGIN`. Deploy the React application from `frontend/` and set `REACT_APP_API_BASE_URL` to the deployed API URL including `/api`.

## Screenshots

These screenshots came from the latest upstream README. Replace them if final integration testing shows that the deployed UI differs from this branch.

![NovaCMS landing page](https://github.com/user-attachments/assets/9d3f1e26-51ba-4a0f-a847-321839bf165a)
![NovaCMS editorial interface](https://github.com/user-attachments/assets/08f5c2ee-a178-4145-ae62-7cd3b3215d98)
![NovaCMS content management](https://github.com/user-attachments/assets/8f091c5c-546e-4dee-87a9-333018ad05ef)

See [DEMO_GUIDE.md](DEMO_GUIDE.md) for a reproducible recording plan.

## Known limitations

- No password reset, email verification, refresh tokens, or MFA
- JWTs are stored in browser local storage; an HttpOnly cookie design would reduce token exposure in a larger production system
- Login throttling is in-memory and instance-local; production abuse protection should use a shared store or edge/WAF rate limiting
- No automated browser end-to-end suite
- No audit log, post revision history, media library, or scheduled publishing
- Admin bootstrap is a manual database operation
- Production MongoDB contents and deployed environment configuration are outside repository-only verification
- The legacy Create React App toolchain retains 30 audit findings (16 high, 5 moderate, 9 low); npm offers no non-breaking complete remediation, so replacing the build tool is deferred

