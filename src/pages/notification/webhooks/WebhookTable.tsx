import { Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { WebhookData } from "../../../types/notification";

type WebhookTableProps = {
  data?: WebhookData[];
  loading: boolean;
  canManage: boolean;
  onEdit: (webhook: WebhookData) => void;
  onDelete: (webhook: WebhookData) => void;
};

export function WebhookTable({ data, loading, canManage, onEdit, onDelete }: WebhookTableProps) {
  return (
    <Table<WebhookData>
      rowKey="id"
      loading={loading}
      dataSource={data}
      columns={[
        { title: "Target", dataIndex: "target_code", render: (code) => <Typography.Text code>{code}</Typography.Text> },
        {
          title: "Endpoint",
          render: (_, webhook) => (
            <Space>
              <Tag>{webhook.method}</Tag>
              <Typography.Text copyable>{`${webhook.domain}${webhook.path ?? ""}`}</Typography.Text>
            </Space>
          ),
        },
        { title: "Timeout (s)", dataIndex: "timeout_seconds" },
        { title: "Retries", dataIndex: "max_retries" },
        {
          title: "Auth",
          render: (_, webhook) =>
            webhook.auth ? (
              <Space>
                <Tag color={webhook.auth.auth_mode === "STATIC" ? "blue" : "purple"}>{webhook.auth.auth_mode}</Tag>
                <Typography.Text type="secondary">{webhook.auth.header_name}</Typography.Text>
              </Space>
            ) : (
              <Tag color="red">missing</Tag>
            ),
        },
        {
          title: "Actions",
          render: (_, webhook) =>
            canManage && (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => onEdit(webhook)} />
                <Popconfirm title={`Delete webhook for ${webhook.target_code}?`} onConfirm={() => onDelete(webhook)}>
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
        },
      ]}
    />
  );
}
