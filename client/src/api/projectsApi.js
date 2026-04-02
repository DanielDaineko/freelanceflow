import api from "./axios";

export const getProjectsRequest = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const createProjectRequest = async (data) => {
  const response = await api.post("/projects", data);
  return response.data;
};

export const deleteProjectRequest = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};
