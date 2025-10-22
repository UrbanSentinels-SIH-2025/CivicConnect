import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";// Different API instance for admin
import useAdminStore from "../store/useAdminStore";
import { useEffect } from "react";

const fetchAdmin = async () => {
  const { data } = await api.get("/admin/me"); // Admin API endpoint
  return data.admin;
};

const ProtectedAdminRoute = ({ children }) => {
  const setAdmin = useAdminStore((state) => state.setAdmin);
  
  const { data: fetchedAdmin, isLoading, isError } = useQuery({
    queryKey: ["authAdmin"],
    queryFn: fetchAdmin,
    retry: false,
  });

  useEffect(() => {
    if (fetchedAdmin) setAdmin(fetchedAdmin);

  }, [fetchedAdmin, setAdmin]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-500 border-dashed rounded-full animate-spin mb-4"></div>
          <span className="text-red-600 font-semibold text-lg">Loading Admin...</span>
        </div>
      </div>
    );

  if (isError || !fetchedAdmin) return <Navigate to="/admin-login" replace />;

  return children;
};

export default ProtectedAdminRoute;