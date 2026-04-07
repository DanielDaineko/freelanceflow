import api from "./axios";

export const getTransactionsRequest = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

export const createTransactionRequest = async (data) => {
  const response = await api.post("/transactions", data);
  return response.data;
};

export const deleteTransactionRequest = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};
