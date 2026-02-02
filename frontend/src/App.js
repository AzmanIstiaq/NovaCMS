import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Users from "./pages/Users";
import ViewPost from "./pages/ViewPost";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import { getToken, getRole, logout } from "./api";

function Protected({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

function AdminProtected({ children }) {
  const isAuthenticated = getToken();
  const role = getRole();
  if (!isAuthenticated) {
    logout();
    return <Navigate to="/login" replace />;
  }
  
  return role === "admin" ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (token) {
      setUser({ role });
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };
  
  return (
    <BrowserRouter>
      <Header user={user} onLogout={handleLogout}/>

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/login" element={<Login onLoginSuccess={() => {
          const token = getToken();
          const role = getRole();
          if (token) {
            setUser({ role });
          }
        }} />} />
        <Route path="/post/:slug" element={<ViewPost />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
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

        {/* Admin routes */}
        <Route
          path="/users"
          element={
              <AdminProtected>
                <Users />
              </AdminProtected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
