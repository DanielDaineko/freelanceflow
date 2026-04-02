import { create } from "zustand";
import { getDashboardSummaryRequest } from "../api/dashboardApi";

const useDashboardStore = create((set) => ({
  summary: null,
  isLoading: false,
  error: null,

  fetchSummary: async () => {
    try {
      set({ isLoading: true, error: null });

      const summary = await getDashboardSummaryRequest();

      set({
        summary,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load dashboard",
        isLoading: false,
      });
    }
  },
}));

export default useDashboardStore;
