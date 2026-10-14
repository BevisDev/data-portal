import { Card, Col, Descriptions, Row, Space, Tag, Typography } from "antd";
import { useAccess } from "../../hooks/useAccess";
import { PERMISSION_LABELS } from "../../types/platform";
import { formatSessionExpiry } from "../../utils/platform";

export function ProfilePage() {
  const { session, currentUser, permissions, roles } = useAccess();
  const roleNameMap = new Map(roles.map((role) => [role.id, role.name]));

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        My Information
      </Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card bordered={false} title="Account">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Name">{currentUser?.name}</Descriptions.Item>
              <Descriptions.Item label="Title">{currentUser?.title}</Descriptions.Item>
              <Descriptions.Item label="Email">{currentUser?.email}</Descriptions.Item>
              <Descriptions.Item label="Provider">{currentUser?.provider}</Descriptions.Item>
              <Descriptions.Item label="Session Expiry">
                {session ? formatSessionExpiry(session.expiresAt) : "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card bordered={false} title="Roles">
            <Space wrap>
              {currentUser?.roleIds.map((roleId) => (
                <Tag color="purple" key={roleId}>
                  {roleNameMap.get(roleId) ?? roleId}
                </Tag>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
      <Card bordered={false} title="Effective Permissions">
        <Space direction="vertical" style={{ width: "100%" }}>
          {Array.from(permissions).map((permission) => (
            <div key={permission} className="permission-line">
              <Tag color="blue">{permission}</Tag>
              <Typography.Text type="secondary">{PERMISSION_LABELS[permission]}</Typography.Text>
            </div>
          ))}
        </Space>
      </Card>
    </Space>
  );
}
