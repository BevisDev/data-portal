import { useState } from "react";
import { Avatar, Button, Dropdown, Layout, Menu, Space, Tag, Typography } from "antd";
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAccess } from "../hooks/useAccess";
import { useSidebarMenu } from "../hooks/useSidebarMenu";
import { useAuthStore } from "../store/authStore";

export function PortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const clearSession = useAuthStore((state) => state.clearSession);
  const { currentUser, roles } = useAccess();
  const { menuItems, flatNodes } = useSidebarMenu();
  const [collapsed, setCollapsed] = useState(false);

  const roleNameMap = new Map(roles.map((role) => [role.id, role.name]));

  const signOut = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const selectedNode =
    flatNodes
      .filter((node) => location.pathname === node.key || location.pathname.startsWith(`${node.key}/`))
      .sort((a, b) => b.key.length - a.key.length)[0] ?? null;
  const selectedKey = selectedNode?.key ?? "/dashboard";

  const openKeys = selectedKey
    .split("/")
    .filter(Boolean)
    .map((_segment, index, chunks) => `/${chunks.slice(0, index + 1).join("/")}`)
    .slice(0, -1);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider
        breakpoint="lg"
        width={250}
        theme="dark"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
      >
        <div className="brand-wrap">
          <div className="brand-mark">DP</div>
          {!collapsed ? (
            <div>
              <div className="brand-title">Data Platform</div>
              <Typography.Text type="secondary" style={{ color: "#94a3b8" }}>
                Enterprise Portal
              </Typography.Text>
            </div>
          ) : null}
        </div>
        <Menu
          mode="inline"
          theme="dark"
          items={menuItems}
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          onClick={(event) => navigate(event.key)}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header className="app-header">
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((value) => !value)}
            />
            <Typography.Title level={4} style={{ margin: 0 }}>
              Enterprise Data Platform
            </Typography.Title>
          </Space>
          <Space>
            <Dropdown
              menu={{
                items: [{ key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true }],
                onClick: ({ key }) => {
                  if (key === "logout") {
                    signOut();
                  }
                },
              }}
              trigger={["click"]}
            >
              <Button>
                <Space>
                  <Avatar icon={<UserOutlined />} size="small" />
                  {currentUser?.name}
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Layout.Header>
        <Layout.Content style={{ padding: 24 }}>
          <div className="header-chip-group">
            <Tag color="blue">{currentUser?.provider?.toUpperCase()}</Tag>
            {currentUser?.roleIds.map((roleId) => (
              <Tag color="purple" key={roleId}>
                {roleNameMap.get(roleId) ?? roleId}
              </Tag>
            ))}
          </div>
          <Outlet />
        </Layout.Content>
        <Layout.Footer className="app-footer">
          Truong Thanh Binh
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
