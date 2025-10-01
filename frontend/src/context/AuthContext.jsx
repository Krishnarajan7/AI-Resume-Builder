import { createContext, useState, useEffect, useContext } from "react";
import api from "@/api/axios";

// Create the context
export const AuthContext = createContext(null);

// Custom hook for easier access
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refresh token on mount
  useEffect(() => {
    const refresh = async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        setUser(data.user);
        setAccessToken(data.accessToken);

        // attach Authorization header globally
        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
      } catch (err) {
        setUser(null);
        setAccessToken(null);
        delete api.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, []);

  // Login helper
  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Logout helper
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    setAccessToken(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
