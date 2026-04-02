import { create } from "zustand";
import {
  getTasksRequest,
  createTaskRequest,
  deleteTaskRequest,
} from "../../src/api/tasksApi";
import { updateTaskRequest } from "../api/tasksApi";

const useTasksStore = create((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId) => {
    try {
      set({ isLoading: true });
      const tasks = await getTasksRequest(projectId);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load tasks",
        isLoading: false,
      });
    }
  },

  addTask: async (data) => {
    const task = await createTaskRequest(data);

    set((state) => ({
      tasks: [task, ...state.tasks],
    }));
  },

  updateTask: async (id, data) => {
    const updatedTask = await updateTaskRequest(id, data);

    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
    }));
  },

  removeTask: async (id) => {
    await deleteTaskRequest(id);

    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
}));

export default useTasksStore;
