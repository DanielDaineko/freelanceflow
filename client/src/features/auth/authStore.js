import { create } from "zustand";
import { registerRequest, loginRequest, getMeRequest } from "../../api/authApi";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  register: async (formData) => {
    try {
      set({ isLoading: true, error: null });

      const data = await registerRequest(formData);

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        token: data.token,
        isLoading: false,
        error: null,
      });

      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (formData) => {
    try {
      set({ isLoading: true, error: null });

      const data = await loginRequest(formData);

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        token: data.token,
        isLoading: false,
        error: null,
      });

      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchMe: async () => {
    try {
      set({ isLoading: true, error: null });

      const user = await getMeRequest();

      set({
        user,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        isLoading: false,
        error: "Session expired",
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      error: null,
    });
  },
}));

export default useAuthStore;
