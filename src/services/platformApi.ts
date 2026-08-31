import { apiClient } from "./apiClient";
import type { DataRecord, RoleRecord, UserRecord } from "../types/platform";

export const platformApi = {
  getRecords: () => apiClient.get<DataRecord[]>("/records"),
  createRecord: (payload: Omit<DataRecord, "id" | "updatedAt">) =>
    apiClient.post<DataRecord, Omit<DataRecord, "id" | "updatedAt">>("/records", payload),
  updateRecord: (id: string, payload: Omit<DataRecord, "id" | "updatedAt">) =>
    apiClient.put<DataRecord, Omit<DataRecord, "id" | "updatedAt">>(`/records/${id}`, payload),
  deleteRecord: (id: string) => apiClient.delete<{ id: string }>(`/records/${id}`),

  getUsers: () => apiClient.get<UserRecord[]>("/users"),
  createUser: (payload: Omit<UserRecord, "id">) => apiClient.post<UserRecord, Omit<UserRecord, "id">>("/users", payload),
  updateUser: (id: string, payload: Omit<UserRecord, "id">) =>
    apiClient.put<UserRecord, Omit<UserRecord, "id">>(`/users/${id}`, payload),
  deleteUser: (id: string) => apiClient.delete<{ id: string }>(`/users/${id}`),

  getRoles: () => apiClient.get<RoleRecord[]>("/roles"),
};
