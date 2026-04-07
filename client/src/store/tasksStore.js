import { create } from "zustand";
import {
  getTasksRequest,
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
} from "../api/tasksApi";

const useTasksStore = create((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId) => {
    try {
      set({ isLoading: true, error: null });

      const tasks = await getTasksRequest(projectId);

      set({
        tasks,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load tasks",
        isLoading: false,
      });
    }
  },

  addTask: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const task = await createTaskRequest(data);

      set((state) => ({
        tasks: [task, ...state.tasks],
        isLoading: false,
        error: null,
      }));

      return task;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create task",
        isLoading: false,
      });
      throw error;
    }
  },

  updateTask: async (id, formData) => {
    try {
      set({ isLoading: true, error: null });

      const updatedTask = await updateTaskRequest(id, formData);

      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        isLoading: false,
        error: null,
      }));

      return updatedTask;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update task",
        isLoading: false,
      });
      throw error;
    }
  },

  removeTask: async (id) => {
    try {
      await deleteTaskRequest(id);

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete task",
      });
    }
  },
}));

export default useTasksStore;
