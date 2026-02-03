import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Users from "./pages/Users";
import ViewPost from "./pages/ViewPost";
import PublicPosts from "./pages/PublicPosts";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./auth/AuthContex";

function Protected({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" replace />;
}

function AdminProtected({ children, allowedRoles = ["admin", "editor"] }) {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    signOut();
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(user.role)
    ? children
    : <Navigate to="/" replace />;
}

// App
function AppRoutes() {
  return (
    <>
      <Header />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<PublicPosts />} />
        <Route path="/post/:slug" element={<ViewPost />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <Protected>
              <AdminProtected>
                <Dashboard />
              </AdminProtected>
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
    </>
  );
}

//Root
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
