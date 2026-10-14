import { appConfig } from "../config/AppConfig";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/authStore";
import { useErrorStore } from "../store/errorStore";
import { isSessionExpired } from "../utils/platform";

export const httpClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const { session, clearSession, extendSession } = useAuthStore.getState();
  if (!session || isSessionExpired(session.expiresAt)) {
    clearSession();
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
    return Promise.reject(new Error("Session expired"));
  }

  extendSession();
  config.headers.set("x-session-user", session.userId);
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      "Unexpected network error";

    if (error.response?.status === 401) {
      const { clearSession } = useAuthStore.getState();
      clearSession();
      useErrorStore.getState().setError({
        message: "Session unauthorized. Please login again.",
        source: "httpClient",
        at: Date.now(),
      });
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
      return Promise.reject(error);
    }

    useErrorStore.getState().setError({
      message,
      source: "httpClient",
      stack: error.stack,
      at: Date.now(),
    });
    return Promise.reject(error);
  },
);
