import { useEffect, useState } from "react";
import { Avatar, Button, Drawer, Dropdown, Grid, Layout, Menu, Tooltip } from "antd";
import { LogoutOutlined, MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
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

  // Max 2 levels, accordion style: one group open at a time. The selected page's group follows navigation
  // (also once the async menu has loaded); the user can still open another group by clicking it.
  const activeGroupKey = selectedNode?.parentKey;
  const [toggledGroup, setToggledGroup] = useState<{ forPath: string; key: string | null } | null>(null);
  const openGroupKey = toggledGroup?.forPath === location.pathname ? toggledGroup.key : activeGroupKey;
  const openKeys = openGroupKey ? [openGroupKey] : [];

  const roleNames = (currentUser?.roleIds ?? []).map((roleId) => roleNameMap.get(roleId) ?? roleId);

  // No top header: the current page name lives in the browser tab.
  useEffect(() => {
    document.title = selectedNode ? `${selectedNode.label} · Data Platform` : "Data Platform";
  }, [selectedNode]);

  // Below lg the sidebar becomes an off-canvas drawer.
  const screens = Grid.useBreakpoint();
  const isMobile = screens.lg === false;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const compact = !isMobile && collapsed;

  const sidebar = (
    <div className="sider-inner">
      <div className="brand-wrap">
        <div className="brand-mark">DP</div>
        {!compact ? (
          <div>
            <div className="brand-title">Data Platform</div>
            <div className="brand-subtitle">Enterprise Portal</div>
          </div>
        ) : null}
      </div>
      <div className="sider-menu">
        <Menu
          mode="inline"
          theme="dark"
          items={menuItems}
          selectedKeys={[selectedKey]}
          openKeys={compact ? undefined : openKeys}
          onOpenChange={(keys) =>
            setToggledGroup({ forPath: location.pathname, key: keys.find((key) => key !== openGroupKey) ?? null })
          }
          onClick={(event) => {
            navigate(event.key);
            setDrawerOpen(false);
          }}
        />
      </div>
      <div className="sider-footer">
        <Dropdown
          placement="topLeft"
          trigger={["click"]}
          menu={{
            items: [{ key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true }],
            onClick: ({ key }) => {
              if (key === "logout") {
                signOut();
              }
            },
          }}
        >
          <button type="button" className="sider-user" title={currentUser?.name}>
            <Avatar icon={<UserOutlined />} size={compact ? "default" : "small"} />
            {!compact ? (
              <div className="sider-user-info">
                <div className="sider-user-name">{currentUser?.name}</div>
                <div className="sider-user-meta">
                  {[currentUser?.provider?.toUpperCase(), ...roleNames].filter(Boolean).join(" · ")}
                </div>
              </div>
            ) : null}
          </button>
        </Dropdown>
        {!isMobile ? (
          <Tooltip title={collapsed ? "Expand" : "Collapse"} placement="right">
            <Button
              type="text"
              className="sider-toggle"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((value) => !value)}
            />
          </Tooltip>
        ) : null}
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isMobile ? (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          closable={false}
          size={250}
          rootClassName="sider-drawer"
          styles={{ body: { padding: 0 } }}
        >
          {sidebar}
        </Drawer>
      ) : (
        <Layout.Sider
          className="app-sider"
          width={250}
          collapsedWidth={72}
          theme="dark"
          collapsible
          collapsed={collapsed}
          trigger={null}
        >
          {sidebar}
        </Layout.Sider>
      )}
      <Layout>
        <Layout.Content className="app-content">
          {isMobile ? (
            <Button
              className="mobile-menu-button"
              icon={<MenuOutlined />}
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            />
          ) : null}
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
