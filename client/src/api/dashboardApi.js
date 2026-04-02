import api from "./axios";

export const getDashboardSummaryRequest = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};
