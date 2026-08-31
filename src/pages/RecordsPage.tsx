import { useState } from "react";
import { App, Button, Form, Input, Modal, Select, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useAccess } from "../hooks/useAccess";
import { usePlatformStore } from "../store/platformStore";
import type { DataRecord } from "../types/platform";

type RecordFormInput = Omit<DataRecord, "id" | "updatedAt">;

export function RecordsPage() {
  const { message } = App.useApp();
  const { can, currentUser } = useAccess();
  const records = usePlatformStore((state) => state.records);
  const addRecord = usePlatformStore((state) => state.addRecord);
  const updateRecord = usePlatformStore((state) => state.updateRecord);
  const deleteRecord = usePlatformStore((state) => state.deleteRecord);

  const [form] = Form.useForm<RecordFormInput>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openCreate = () => {
    if (!can("data:write")) {
      message.error("You do not have data:write permission.");
      return;
    }
    setEditingId(null);
    form.setFieldsValue({ name: "", category: "", owner: currentUser?.name ?? "", status: "draft" });
    setModalOpen(true);
  };

  const openEdit = (record: DataRecord) => {
    if (!can("data:write")) {
      message.error("You do not have data:write permission.");
      return;
    }
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const submit = async () => {
    const payload = await form.validateFields();
    if (editingId) {
      updateRecord(editingId, payload);
      message.success("Record updated.");
    } else {
      addRecord(payload);
      message.success("Record created.");
    }
    setModalOpen(false);
  };

  const remove = (id: string) => {
    if (!can("data:delete")) {
      message.error("You do not have data:delete permission.");
      return;
    }
    deleteRecord(id);
    message.success("Record deleted.");
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="page-top">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Data Management
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New Record
        </Button>
      </div>
      <Table<DataRecord>
        rowKey="id"
        dataSource={records}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Category", dataIndex: "category" },
          { title: "Owner", dataIndex: "owner" },
          {
            title: "Status",
            dataIndex: "status",
            render: (status) => <Tag color={status === "active" ? "green" : status === "draft" ? "orange" : "default"}>{status}</Tag>,
          },
          { title: "Updated", dataIndex: "updatedAt" },
          {
            title: "Actions",
            render: (_, record) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
                <Button danger icon={<DeleteOutlined />} onClick={() => remove(record.id)} />
              </Space>
            ),
          },
        ]}
      />
      <Modal
        title={editingId ? "Edit Data Record" : "Create Data Record"}
        open={modalOpen}
        onOk={() => void submit()}
        onCancel={() => setModalOpen(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="owner" label="Owner" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "draft", label: "Draft" },
                { value: "active", label: "Active" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
