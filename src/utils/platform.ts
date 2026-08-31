import type { Permission, RoleRecord, UserRecord } from "../types/platform";
import { formatDateTime } from "./date";

export const SESSION_TTL_MS = 1000 * 60 * 30;

export const createId = () => `id_${Math.random().toString(36).slice(2, 10)}`;
export const todayIso = () => new Date().toISOString().slice(0, 10);

export const collectPermissions = (user: UserRecord | null, roles: RoleRecord[]) => {
  if (!user) {
    return new Set<Permission>();
  }
  const permissions = new Set<Permission>();
  for (const roleId of user.roleIds) {
    const role = roles.find((item) => item.id === roleId);
    if (!role) {
      continue;
    }
    for (const permission of role.permissions) {
      permissions.add(permission);
    }
  }
  return permissions;
};

export const isSessionExpired = (expiresAt: number) => Date.now() >= expiresAt;
export const formatSessionExpiry = (expiresAt: number) => formatDateTime(expiresAt);
