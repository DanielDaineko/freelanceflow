import { create } from "zustand";
import {
  getClientsRequest,
  createClientRequest,
  updateClientRequest,
  deleteClientRequest,
} from "../../api/clientsApi";

const useClientsStore = create((set) => ({
  clients: [],
  isLoading: false,
  error: null,

  fetchClients: async () => {
    try {
      set({ isLoading: true, error: null });
      const clients = await getClientsRequest();
      set({ clients, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load clients",
        isLoading: false,
      });
    }
  },

  addClient: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const newClient = await createClientRequest(formData);

      set((state) => ({
        clients: [newClient, ...state.clients],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create client",
        isLoading: false,
      });
      throw error;
    }
  },

  updateClient: async (id, formData) => {
    try {
      set({ isLoading: true, error: null });

      const updatedClient = await updateClientRequest(id, formData);

      set((state) => ({
        clients: state.clients.map((client) =>
          client.id === id ? updatedClient : client,
        ),
        isLoading: false,
        error: null,
      }));

      return updatedClient;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update client",
        isLoading: false,
      });
      throw error;
    }
  },

  removeClient: async (id) => {
    try {
      await deleteClientRequest(id);

      set((state) => ({
        clients: state.clients.filter((client) => client.id !== id),
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete client",
      });
    }
  },
}));

export default useClientsStore;
