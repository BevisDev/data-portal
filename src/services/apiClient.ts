import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { httpClient } from "./httpClient";

export type ApiEnvelope<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

export type ApiErrorShape = {
  status: number;
  message: string;
  details?: unknown;
};

const unwrapEnvelope = <T>(response: AxiosResponse<ApiEnvelope<T> | T>): T => {
  const payload = response.data;
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
};

export const toApiError = (error: unknown): ApiErrorShape => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const candidate = error as {
      response?: { status?: number; data?: { message?: string; error?: string; details?: unknown } };
      message?: string;
    };
    return {
      status: candidate.response?.status ?? 500,
      message: candidate.response?.data?.message ?? candidate.response?.data?.error ?? candidate.message ?? "API request failed",
      details: candidate.response?.data?.details,
    };
  }

  return {
    status: 500,
    message: error instanceof Error ? error.message : "Unexpected API error",
  };
};

export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => unwrapEnvelope<T>(await httpClient.get(url, config)),
  post: async <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    unwrapEnvelope<T>(await httpClient.post(url, body, config)),
  put: async <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    unwrapEnvelope<T>(await httpClient.put(url, body, config)),
  patch: async <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    unwrapEnvelope<T>(await httpClient.patch(url, body, config)),
  delete: async <T>(url: string, config?: AxiosRequestConfig) => unwrapEnvelope<T>(await httpClient.delete(url, config)),
};
