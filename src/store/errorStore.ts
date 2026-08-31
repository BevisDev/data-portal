import { create } from "zustand";

export type GlobalErrorState = {
  message: string;
  source?: string;
  stack?: string;
  at: number;
};

type ErrorStore = {
  current: GlobalErrorState | null;
  setError: (error: GlobalErrorState) => void;
  clearError: () => void;
};

export const useErrorStore = create<ErrorStore>((set) => ({
  current: null,
  setError: (error) => set({ current: error }),
  clearError: () => set({ current: null }),
}));
