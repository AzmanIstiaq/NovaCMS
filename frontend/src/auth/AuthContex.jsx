import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch, verifyToken } from "../api";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      if (token && role) {
        const isValid = await verifyToken();
        if (isValid) {
          setUser({ role });
        } else {
          setUser(null);
        }
      }
    };
    
    checkAuth();
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
