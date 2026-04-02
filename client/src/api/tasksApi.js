import api from "./axios";

export const getTasksRequest = async (projectId) => {
  const response = await api.get(`/tasks?projectId=${projectId}`);
  return response.data;
};

export const createTaskRequest = async (data) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const deleteTaskRequest = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const updateTaskRequest = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};
