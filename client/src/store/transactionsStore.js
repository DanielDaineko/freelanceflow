import { create } from "zustand";
import {
  getTransactionsRequest,
  createTransactionRequest,
  updateTransactionRequest,
  deleteTransactionRequest,
} from "../api/transactionsApi";

const useTransactionsStore = create((set) => ({
  transactions: [],
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    try {
      set({ isLoading: true, error: null });

      const transactions = await getTransactionsRequest();

      set({
        transactions,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load transactions",
        isLoading: false,
      });
    }
  },

  addTransaction: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const newTransaction = await createTransactionRequest(data);

      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
        isLoading: false,
        error: null,
      }));

      return newTransaction;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create transaction",
        isLoading: false,
      });
      throw error;
    }
  },

  updateTransaction: async (id, data) => {
    try {
      set({ isLoading: true, error: null });

      const updatedTransaction = await updateTransactionRequest(id, data);

      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction.id === id ? updatedTransaction : transaction,
        ),
        isLoading: false,
        error: null,
      }));

      return updatedTransaction;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update transaction",
        isLoading: false,
      });
      throw error;
    }
  },

  removeTransaction: async (id) => {
    try {
      await deleteTransactionRequest(id);

      set((state) => ({
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== id,
        ),
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete transaction",
      });
    }
  },
}));

export default useTransactionsStore;
