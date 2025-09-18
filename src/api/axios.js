import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://civicconnect-backend-hxms.onrender.com"
      : "http://localhost:5000",
  withCredentials: true,
});

export default api;
