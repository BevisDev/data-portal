import { useMemo } from "react";
import { useAuthStore } from "../store/authStore";
import { usePlatformStore } from "../store/platformStore";
import type { Permission } from "../types/platform";
import { collectPermissions } from "../utils/platform";

export const useAccess = () => {
  const session = useAuthStore((state) => state.session);
  const users = usePlatformStore((state) => state.users);
  const roles = usePlatformStore((state) => state.roles);

  const currentUser = useMemo(
    () => users.find((user) => user.id === session?.userId) ?? null,
    [users, session?.userId],
  );
  const permissions = useMemo(() => collectPermissions(currentUser, roles), [currentUser, roles]);
  const can = (permission: Permission) => permissions.has(permission);

  return { session, currentUser, roles, users, permissions, can };
};
