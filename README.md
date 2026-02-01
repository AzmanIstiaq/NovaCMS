# Nova CMS

A full-stack **Content Management System (CMS)** built with the **MERN stack**, featuring authentication, role-based authorization, post management, and admin controls.

This project demonstrates real-world backend + frontend integration, secure APIs, and role-based workflows.

---

## Features

### Authentication & Authorization
- JWT-based authentication
- Secure protected routes
- Role-based access control:
  - **Admin** – full access
  - **Editor** – create & edit own posts
  - **Viewer** – read-only access

### Post Management
- Create, edit, delete posts
- Draft & published workflow
- Slug-based public post viewing
- Secure ID-based editing
- Pagination for posts

### Admin Controls
- View all users
- Update user roles
- Ban / unban users
- Prevent self-modification

### Frontend
- React with React Router
- Protected routes
- Clean dashboard UI
- Public post viewing
- Error handling & loading states

---

## 🛠️ Tech Stack

**Frontend**
- React
- React Router
- JavaScript (ES6+)
- CSS (lightweight theme)

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcrypt

---

## 🧑‍💻 Roles & Permissions

| Role   | Permissions |
|------|------------|
| Admin | Full access (users + posts) |
| Editor | Create & edit own posts |
| Viewer | Read published posts only |

---

## 📂 Project Structure
nova-cms/

├── backend/

│ ├── controllers/

│ ├── models/

│ ├── routes/

│ ├── middleware/

│ └── server.js

├── frontend/

│ ├── pages/

│ ├── api.js

│ └── App.js

└── README.md


---

## ⚙️ Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/nova-cms.git
cd nova-cms
```

### 
---

## ⚙️ Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/nova-cms.git
cd nova-cms
```

### 2️⃣ Install dependencies
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

###  3️⃣ Environment variables
Create a .env file in backend/:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4️⃣ Run the app
```bash
npm run dev
```
Backend: http://localhost:5000
Frontend: http://localhost:3000

### SCREENSHOT
<img width="1919" height="784" alt="image" src="https://github.com/user-attachments/assets/0b4a2a25-f444-4176-bf86-ac333f1a7096" />
<img width="1919" height="653" alt="image" src="https://github.com/user-attachments/assets/490951c4-ce84-4215-9e3c-f26b29171615" />
<img width="1919" height="655" alt="image" src="https://github.com/user-attachments/assets/af98c545-0879-4ff9-a0e1-bd22218e2afe" />
<img width="1919" height="625" alt="image" src="https://github.com/user-attachments/assets/d06bcc05-bf5b-4f2e-8fcd-624f36fbbcfc" />



