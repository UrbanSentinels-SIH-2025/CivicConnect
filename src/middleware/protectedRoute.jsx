import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import useAuthStore from "../store/useAuthStore";
import useAdminStore from "../store/useAdminStore";
import { useEffect } from "react";

const fetchUser = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};




const ProtectedRoute = ({ children,allowed }) => {

  const setUser = useAuthStore((state) => state.setUser);
  console.log('role is',allowed)
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchUser,
    retry: false,
  });

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  if (isLoading)
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4"></div>
        <span className="text-blue-600 font-semibold text-lg">Loading...</span>
      </div>
    </div>
  );

  if (isError || !user) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
