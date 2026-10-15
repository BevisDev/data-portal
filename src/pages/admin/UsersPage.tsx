import { useMemo, useState } from "react";
import { App, Button, Form, Input, Modal, Select, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useAccess } from "../../hooks/useAccess";
import { useAuthStore } from "../../store/authStore";
import { usePlatformStore } from "../../store/platformStore";
import type { UserRecord } from "../../types/platform";

type UserFormInput = Omit<UserRecord, "id">;

export function UsersPage() {
  const { message } = App.useApp();
  const session = useAuthStore((state) => state.session);
  const { roles, can } = useAccess();
  const users = usePlatformStore((state) => state.users);
  const addUser = usePlatformStore((state) => state.addUser);
  const updateUser = usePlatformStore((state) => state.updateUser);
  const deleteUser = usePlatformStore((state) => state.deleteUser);
  const [form] = Form.useForm<UserFormInput>();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const roleNameMap = useMemo(() => new Map(roles.map((role) => [role.id, role.name])), [roles]);
  const roleOptions = roles.map((role) => ({ label: role.name, value: role.id }));

  const openCreate = () => {
    if (!can("user:manage")) {
      message.error("You do not have user:manage permission.");
      return;
    }
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      username: "",
      name: "",
      title: "",
      email: "",
      provider: "local",
      password: "",
      roleIds: [],
      status: "active",
    });
    setOpen(true);
  };

  const openEdit = (user: UserRecord) => {
    if (!can("user:manage")) {
      message.error("You do not have user:manage permission.");
      return;
    }
    setEditingId(user.id);
    form.resetFields();
    form.setFieldsValue({ ...user, password: user.password ?? "" });
    setOpen(true);
  };

  const remove = (id: string) => {
    if (!can("user:manage")) {
      message.error("You do not have user:manage permission.");
      return;
    }
    if (id === session?.userId) {
      message.error("You cannot remove your own session account.");
      return;
    }
    deleteUser(id);
    message.success("User deleted.");
  };

  const submit = async () => {
    const payload = await form.validateFields();
    const normalized: UserFormInput = {
      ...payload,
      password: payload.provider === "local" ? payload.password : undefined,
    };

    if (editingId) {
      updateUser(editingId, normalized);
      message.success("User updated.");
    } else {
      addUser(normalized);
      message.success("User created.");
    }
    setOpen(false);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="page-top">
        <Typography.Title level={3} style={{ margin: 0 }}>
          User Management
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New User
        </Button>
      </div>
      <Table<UserRecord>
        rowKey="id"
        dataSource={users}
        columns={[
          { title: "Username", dataIndex: "username" },
          { title: "Name", dataIndex: "name" },
          { title: "Title", dataIndex: "title" },
          { title: "Email", dataIndex: "email" },
          { title: "Provider", dataIndex: "provider" },
          {
            title: "Roles",
            render: (_, user) => (
              <Space wrap>
                {user.roleIds.map((roleId) => (
                  <Tag key={`${user.id}_${roleId}`}>{roleNameMap.get(roleId) ?? roleId}</Tag>
                ))}
              </Space>
            ),
          },
          {
            title: "Status",
            dataIndex: "status",
            render: (status) => <Tag color={status === "active" ? "green" : "default"}>{status}</Tag>,
          },
          {
            title: "Actions",
            render: (_, user) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => openEdit(user)} />
                <Button danger icon={<DeleteOutlined />} onClick={() => remove(user.id)} />
              </Space>
            ),
          },
        ]}
      />
      <Modal title={editingId ? "Edit User" : "New User"} open={open} onOk={() => void submit()} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true },
              { pattern: /^[a-zA-Z0-9._-]+$/, message: "Letters, digits, '.', '_' or '-'" },
              {
                validator: async (_, value?: string) => {
                  const taken = users.some(
                    (user) => user.id !== editingId && user.username.toLowerCase() === value?.trim().toLowerCase(),
                  );
                  if (taken) throw new Error("Username already exists");
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="provider" label="Provider" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "local", label: "Local" },
                { value: "google", label: "Google" },
                { value: "github", label: "GitHub" },
              ]}
            />
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue("provider") === "local" ? (
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                  <Input.Password />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item name="roleIds" label="Roles" rules={[{ required: true, message: "Select role at minimum" }]}>
            <Select mode="multiple" options={roleOptions} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
