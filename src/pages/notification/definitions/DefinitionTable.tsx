import { Button, Popconfirm, Space, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import type { DefinitionData } from "../../../types/notification";
import { CHANNEL_BY_ID } from "../shared/notificationForm";
import { ChannelTag, LevelTag, StatusTag } from "../shared/tags";

type DefinitionTableProps = {
  data?: DefinitionData[];
  loading: boolean;
  canManage: boolean;
  onSendTest: (definition: DefinitionData) => void;
  onEdit: (definition: DefinitionData) => void;
  onDelete: (definition: DefinitionData) => void;
};

export function DefinitionTable({ data, loading, canManage, onSendTest, onEdit, onDelete }: DefinitionTableProps) {
  return (
    <Table<DefinitionData>
      rowKey="id"
      loading={loading}
      dataSource={data}
      columns={[
        { title: "Code", dataIndex: "code", render: (code) => <Typography.Text code>{code}</Typography.Text> },
        { title: "Name", dataIndex: "name" },
        {
          title: "Channel",
          dataIndex: "channel_id",
          render: (id: number) => (CHANNEL_BY_ID[id] ? <ChannelTag channel={CHANNEL_BY_ID[id]} /> : id),
        },
        { title: "Level", dataIndex: "level", render: (level) => <LevelTag level={level} /> },
        { title: "Status", dataIndex: "status", render: (status) => <StatusTag status={status} /> },
        {
          title: "Targets",
          render: (_, definition) =>
            definition.targets.map((t) => `#${t.target_id}${t.template_id ? ` (tpl ${t.template_id})` : ""}`).join(", "),
        },
        {
          title: "Actions",
          render: (_, definition) => (
            <Space>
              <Button title="Send test" icon={<SendOutlined />} onClick={() => onSendTest(definition)} />
              {canManage && <Button icon={<EditOutlined />} onClick={() => onEdit(definition)} />}
              {canManage && (
                <Popconfirm
                  title={`Delete ${definition.code}?`}
                  description="Notifications already accepted for it are kept."
                  onConfirm={() => onDelete(definition)}
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              )}
            </Space>
          ),
        },
      ]}
    />
  );
}
