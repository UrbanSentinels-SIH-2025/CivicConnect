// src/store/useAdminStore.js
import { create } from "zustand";

const useAdminStore = create((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
  clearAdmin: () => set({ admin: null }),
}));

export default useAdminStore;
