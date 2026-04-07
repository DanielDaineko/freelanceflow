import api from "./axios";

export const getClientsRequest = async () => {
  const response = await api.get("/clients");
  return response.data;
};

export const createClientRequest = async (data) => {
  const response = await api.post("/clients", data);
  return response.data;
};

export const updateClientRequest = async (id, data) => {
  const response = await api.put(`/clients/${id}`, data);
  return response.data;
};

export const deleteClientRequest = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};
