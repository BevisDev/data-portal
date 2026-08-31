import { Card, Col, Row, Space, Tag, Typography } from "antd";
import { useAccess } from "../hooks/useAccess";
import { ALL_PERMISSIONS, PERMISSION_LABELS } from "../types/platform";

export function PermissionsPage() {
  const { permissions } = useAccess();
  const scopes = ["data", "user", "role", "permission"];

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Permission Matrix
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {scopes.map((scope) => (
          <Col key={scope} xs={24} md={12}>
            <Card title={scope.toUpperCase()} bordered={false}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {ALL_PERMISSIONS.filter((permission) => permission.startsWith(`${scope}:`)).map((permission) => (
                  <div key={permission} className="permission-line">
                    <Tag color={permissions.has(permission) ? "green" : "default"}>{permission}</Tag>
                    <Typography.Text type="secondary">{PERMISSION_LABELS[permission]}</Typography.Text>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
}
