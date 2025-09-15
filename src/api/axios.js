// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // ✅ correct option
});

export default api;
