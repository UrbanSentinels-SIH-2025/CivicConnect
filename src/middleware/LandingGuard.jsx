import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const LandingGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (data?.user) setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Navigate to="/user/dashboard" replace /> : children;
};

export default LandingGuard;
