# Nova CMS

Live app: https://nova-cms.vercel.app/

Nova CMS is a full-stack content platform built on the MERN stack. It delivers authenticated, role-aware authoring; an editorial workflow (draft -> review -> published -> archived); and an admin surface for user governance. The API is JWT-secured, and the frontend ships a protected React dashboard plus public post views.

---

## Features
- Authentication with JWT, password hashing (bcrypt), and a login rate limiter (20 attempts per 15 minutes per IP).
- Role-based authorization: Admin, Editor, Viewer. Admins govern users; Editors publish content; Viewers consume published posts.
- Post lifecycle with status actions: create, edit, submit for review, publish/unpublish, archive/unarchive, delete (admin only).
- Public delivery: slug-based post pages and a paginated public feed.
- Admin controls: list users, change roles, ban/unban, with self-protection (cannot change own role/status).
- Frontend: React 19 + React Router 7 + React Bootstrap; guarded routes, dashboards grouped by status, and landing/public pages.
- Error handling and logging: centralized middleware with structured console logging; consistent JSON errors.

---

## Tech Stack
- Frontend: React 19, React Router 7, React Bootstrap, Create React App toolchain.
- Backend: Node.js, Express 5, MongoDB with Mongoose, JWT, bcrypt, CORS.
- Tooling: concurrently (root dev script), nodemon (backend dev), Vercel serverless adapter (@vercel/node) for the API.

---

## Project Structure
```
nova-cms/
|-- backend/
|   |-- server.js
|   |-- vercel.json
|   |-- config/config.js
|   |-- controllers/        # auth, posts, users
|   |-- routes/             # /auth, /posts, /users
|   |-- models/             # User, Post
|   |-- middleware/         # auth + error handlers
|   `-- utils/logger.js
|-- frontend/
|   |-- src/
|   |   |-- auth/AuthContex.jsx
|   |   |-- api.js and api/posts.js
|   |   |-- components/     # UI building blocks
|   |   |-- pages/          # Landing, Dashboard, Posts, Users, etc.
|   |   `-- config.js
|   `-- public/
`-- README.md
```

---

## API Overview (root: `/api`)
**Auth**
- `POST /auth/register` - create account.
- `POST /auth/login` - returns JWT + user.
- `GET /auth/me` - validate token and return user (protected).
- `GET /auth/admin` - admin check (protected, admin role).

**Posts**
- `GET /posts` - public published posts, supports `page` and `limit`.
- `GET /posts/:slug` - public single post by slug.
- `GET /posts/user` - authenticated user's posts (admin sees all).
- `GET /posts/id/:id` - author/editor/admin access to a specific post.
- `POST /posts` - create (roles: editor, admin).
- `PUT /posts/id/:id` - update (author/editor/admin with rules).
- `DELETE /posts/id/:id` - delete (admin).
- `PATCH /posts/id/:id/submit` - author submits draft -> review.
- `PATCH /posts/id/:id/publish` - admin publishes review -> published.
- `PATCH /posts/id/:id/unpublish` - admin/editor/author moves published -> review.
- `PATCH /posts/id/:id/archive` - admin/editor/author archive.
- `PATCH /posts/id/:id/unarchive` - admin/editor/author archived -> review.

**Users** (admin only)
- `GET /users`
- `PUT /users/:id/role` - change role; cannot change own.
- `PUT /users/:id/status` - ban/unban; cannot change own.

---

## Roles and Permissions
| Role   | Capabilities |
|--------|--------------|
| Admin  | All posts, publish/unpublish, archive, delete, manage users, view everything. |
| Editor | Create/edit own posts, submit for review, archive/unarchive, unpublish own, view dashboard. |
| Viewer | Read published posts only (public routes). |

---

## Post Workflow
- Statuses: `draft` -> `review` -> `published` -> (`archived` or back to `review` via unpublish/unarchive).
- Editors start posts as draft; publish requests move to review. Only admins publish.
- Authors/editors/admins can archive; unarchive returns to review.

---

## Environment Variables
### Backend (`backend/.env`)
```
MONGO_URI=mongodb://localhost:27017/nova-cms
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```
For production, set `REACT_APP_API_BASE_URL` to your deployed API URL (for example, the Vercel API endpoint).

---

## Getting Started
Prerequisites: Node 18+ (LTS recommended), MongoDB running locally or a remote URI.

1) Install dependencies
```
npm install
npm install --prefix backend
npm install --prefix frontend
```

2) Configure environment
- Create `backend/.env` and `frontend/.env` using the samples above.

3) Run in development
```
npm run dev
```
This runs the backend (nodemon) and frontend (CRA) concurrently.

Alternate commands:
- Backend only: `npm run dev --prefix backend`
- Frontend only: `npm start --prefix frontend`

4) Build frontend
```
npm run build --prefix frontend
```
---

## Troubleshooting
- 401 / token errors: ensure the Authorization header is `Bearer <token>` and the frontend `.env` points to the correct API.
- 429 on login: the in-memory limiter allows about 20 attempts per 15 minutes per IP; wait and retry.
- Mongo connection failures: verify `MONGO_URI`, network access, and that the cluster accepts your IP.
- Unexpected 403: confirm your role; some actions require admin (publish, delete, user management).

---

### SCREENSHOT
<img width="1904" height="908" alt="image" src="https://github.com/user-attachments/assets/9d3f1e26-51ba-4a0f-a847-321839bf165a" />
<img width="1901" height="915" alt="image" src="https://github.com/user-attachments/assets/08f5c2ee-a178-4145-ae62-7cd3b3215d98" />
<img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/8f091c5c-546e-4dee-87a9-333018ad05ef" />




