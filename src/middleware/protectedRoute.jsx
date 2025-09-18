import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import useAuthStore from "../store/useAuthStore";
import { useEffect } from "react";

const fetchUser = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};

const ProtectedRoute = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchUser,
    retry: false,
  });

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !user) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
