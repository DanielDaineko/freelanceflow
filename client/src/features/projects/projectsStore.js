import { create } from "zustand";
import {
  getProjectsRequest,
  createProjectRequest,
  deleteProjectRequest,
} from "../../api/projectsApi";

const useProjectsStore = create((set) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const projects = await getProjectsRequest();
      set({ projects, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load projects",
        isLoading: false,
      });
    }
  },

  addProject: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const newProject = await createProjectRequest(formData);

      set((state) => ({
        projects: [newProject, ...state.projects],
        isLoading: false,
        error: null,
      }));

      return newProject;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create project",
        isLoading: false,
      });
      throw error;
    }
  },

  removeProject: async (id) => {
    try {
      await deleteProjectRequest(id);

      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete project",
      });
    }
  },
}));

export default useProjectsStore;
