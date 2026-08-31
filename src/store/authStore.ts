import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Provider, UserSession } from "../types/platform";
import { SESSION_TTL_MS } from "../utils/platform";

type AuthState = {
  session: UserSession | null;
  createSession: (userId: string, provider: Provider) => void;
  clearSession: () => void;
  extendSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      createSession: (userId, provider) => {
        const createdAt = Date.now();
        set({
          session: {
            userId,
            provider,
            createdAt,
            expiresAt: createdAt + SESSION_TTL_MS,
          },
        });
      },
      clearSession: () => set({ session: null }),
      extendSession: () => {
        const current = get().session;
        if (!current) {
          return;
        }
        set({
          session: {
            ...current,
            expiresAt: Date.now() + SESSION_TTL_MS,
          },
        });
      },
    }),
    {
      name: "data-platform-auth",
    },
  ),
);
