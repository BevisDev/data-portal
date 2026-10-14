export const ALL_PERMISSIONS = [
  "data:read",
  "data:write",
  "data:delete",
  "user:read",
  "user:manage",
  "role:read",
  "role:manage",
  "permission:read",
  "notification:read",
  "notification:manage",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];
export type Provider = "local" | "google" | "github";

export type DataRecord = {
  id: string;
  name: string;
  category: string;
  owner: string;
  status: "draft" | "active" | "archived";
  updatedAt: string;
};

export type RoleRecord = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  provider: Provider;
  password?: string;
  roleIds: string[];
  status: "active" | "inactive";
  title: string;
};

export type UserSession = {
  userId: string;
  provider: Provider;
  expiresAt: number;
  createdAt: number;
};

export const PERMISSION_LABELS: Record<Permission, string> = {
  "data:read": "Read data assets",
  "data:write": "Create and update data assets",
  "data:delete": "Delete data assets",
  "user:read": "Read user directory",
  "user:manage": "Manage user accounts",
  "role:read": "Read role catalog",
  "role:manage": "Manage role definitions",
  "permission:read": "Read permissions matrix",
  "notification:read": "Read notification configuration",
  "notification:manage": "Manage notification configuration and send tests",
};
