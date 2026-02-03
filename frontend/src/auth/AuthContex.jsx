import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch, verifyToken } from "../api";

const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data?.user?.role || "viewer");
    setUser({ role: data?.user?.role || "viewer" });

    return data;
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const verifiedUser = await verifyToken();
        if (verifiedUser) {
          localStorage.setItem("role", verifiedUser.role || "viewer");
          setUser({ ...verifiedUser });
        } else {
          signOut();
        }
      } catch (err) {
        signOut();
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
