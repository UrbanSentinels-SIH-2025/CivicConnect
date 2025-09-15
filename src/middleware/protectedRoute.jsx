// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUser = async () => {
  const { data } = await axios.get("http://localhost:5000/auth/me", {
    withCredentials: true, // ✅ send cookie
  });
  console.log(data)
  return data.user;
};

const ProtectedRoute = ({ children }) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],   // ✅ v5 style
    queryFn: fetchUser,
    retry: false,
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError || !user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
