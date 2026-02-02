import { createContext, useContext, useState, useEffect } from "react";
import { getToken, getRole, logout } from "../api";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (token && role) {
      setUser({ role });
    }
  }, []);

  const signOut = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
