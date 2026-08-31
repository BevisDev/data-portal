import { Card, Result } from "antd";
import type { ReactNode } from "react";
import { useAccess } from "../hooks/useAccess";
import type { Permission } from "../types/platform";

type PermissionGuardProps = {
  permission: Permission;
  children: ReactNode;
};

export function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const { can } = useAccess();
  if (can(permission)) {
    return <>{children}</>;
  }

  return (
    <Card>
      <Result
        status="403"
        title="Unauthorized"
        subTitle={`Your account does not include required permission: ${permission}`}
      />
    </Card>
  );
}
