import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Users from "./pages/Users";
import ViewPost from "./pages/ViewPost";
import { getToken, getRole } from "./api";

function Protected({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

function AdminProtected({ children }) {
  const role = getRole();
  return role === "admin" ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/create-post"
          element={
            <Protected>
              <CreatePost />
            </Protected>
          }
        />
        <Route
          path="/edit-post/:id"
          element={
            <Protected>
              <EditPost />
            </Protected>
          }
        />
        <Route
          path="/users"
          element={
            <Protected>
              <AdminProtected>
                <Users />
              </AdminProtected>
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/post/:slug" element={<ViewPost />} />
      </Routes>
    </BrowserRouter>
  );
}
