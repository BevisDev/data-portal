import { useState } from "react";
import { App, Button, Checkbox, Form, Input, Modal, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useAccess } from "../hooks/useAccess";
import { usePlatformStore } from "../store/platformStore";
import { ALL_PERMISSIONS, PERMISSION_LABELS } from "../types/platform";
import type { RoleRecord } from "../types/platform";

type RoleFormInput = Omit<RoleRecord, "id">;

export function RolesPage() {
  const { message } = App.useApp();
  const { can } = useAccess();
  const roles = usePlatformStore((state) => state.roles);
  const users = usePlatformStore((state) => state.users);
  const addRole = usePlatformStore((state) => state.addRole);
  const updateRole = usePlatformStore((state) => state.updateRole);
  const deleteRole = usePlatformStore((state) => state.deleteRole);
  const [form] = Form.useForm<RoleFormInput>();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openCreate = () => {
    if (!can("role:manage")) {
      message.error("You do not have role:manage permission.");
      return;
    }
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ name: "", description: "", permissions: ["data:read"] });
    setOpen(true);
  };

  const openEdit = (role: RoleRecord) => {
    if (!can("role:manage")) {
      message.error("You do not have role:manage permission.");
      return;
    }
    setEditingId(role.id);
    form.resetFields();
    form.setFieldsValue(role);
    setOpen(true);
  };

  const remove = (id: string) => {
    if (!can("role:manage")) {
      message.error("You do not have role:manage permission.");
      return;
    }
    if (id === "role_super_admin") {
      message.error("Super Admin role is protected.");
      return;
    }
    if (users.some((user) => user.roleIds.includes(id))) {
      message.error("This role is assigned to active users.");
      return;
    }
    deleteRole(id);
    message.success("Role removed.");
  };

  const submit = async () => {
    const payload = await form.validateFields();
    if (editingId) {
      updateRole(editingId, payload);
      message.success("Role updated.");
    } else {
      addRole(payload);
      message.success("Role created.");
    }
    setOpen(false);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="page-top">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Role Management
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New Role
        </Button>
      </div>
      <Table<RoleRecord>
        rowKey="id"
        dataSource={roles}
        columns={[
          { title: "Role", dataIndex: "name" },
          { title: "Description", dataIndex: "description" },
          {
            title: "Permissions",
            render: (_, role) => <Tag color="blue">{role.permissions.length} permissions</Tag>,
          },
          {
            title: "Actions",
            render: (_, role) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => openEdit(role)} />
                <Button danger icon={<DeleteOutlined />} onClick={() => remove(role.id)} />
              </Space>
            ),
          },
        ]}
      />
      <Modal title={editingId ? "Edit Role" : "Create Role"} open={open} onOk={() => void submit()} onCancel={() => setOpen(false)}>
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: "Select at least one permission" }]}
          >
            <Checkbox.Group
              options={ALL_PERMISSIONS.map((permission) => ({
                label: `${permission} - ${PERMISSION_LABELS[permission]}`,
                value: permission,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
