import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://civicconnect-backend-hxms.onrender.com" // ✅ Render backend
      : "http://localhost:5000", // ✅ Local dev backend
  withCredentials: true,
});

export default api;
