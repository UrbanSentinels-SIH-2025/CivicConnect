import api from "./axios";

// fetchUser.js
export const fetchUser = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};

// fetchAdmin.js
export const fetchAdmin = async () => {
  const { data } = await api.get("/admin/me");
  return data.admin;
};

// fetchWorker.js
export const fetchWorker = async () => {
  const { data } = await api.get("/worker/me");
  return data.worker;
};
