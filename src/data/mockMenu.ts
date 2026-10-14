import type { SidebarMenuNode } from "../types/navigation";

export const MOCK_SIDEBAR_MENU: SidebarMenuNode[] = [
  {
    key: "/dashboard",
    label: "Dashboard",
    icon: "BarChartOutlined",
  },
  {
    key: "/business",
    label: "Business",
    icon: "AppstoreOutlined",
    children: [
      { key: "/business/product-catalog", label: "Product Catalog", permission: "data:read" },
      { key: "/business/governance", label: "Governance", permission: "permission:read" },
    ],
  },
  {
    key: "/records",
    label: "Data Management",
    icon: "DatabaseOutlined",
    permission: "data:read",
  },
  {
    key: "/notification",
    label: "Notifications",
    icon: "NotificationOutlined",
    permission: "notification:read",
    children: [
      { key: "/notification/definitions", label: "Definitions", permission: "notification:read" },
      { key: "/notification/templates", label: "Templates", permission: "notification:read" },
      { key: "/notification/sources-targets", label: "Sources & Targets", permission: "notification:read" },
      { key: "/notification/webhooks", label: "Webhooks", permission: "notification:read" },
      { key: "/notification/send", label: "Send Test", permission: "notification:manage" },
    ],
  },
  {
    key: "/admin",
    label: "Admin",
    icon: "SettingOutlined",
    children: [
      { key: "/admin/users", label: "Users", icon: "TeamOutlined", permission: "user:read" },
      { key: "/admin/roles", label: "Roles", icon: "SafetyCertificateOutlined", permission: "role:read" },
      { key: "/admin/permissions", label: "Permissions", icon: "AuditOutlined", permission: "permission:read" },
    ],
  },
  {
    key: "/profile",
    label: "My Information",
    icon: "UserOutlined",
  },
  {
    key: "/white",
    label: "White Page",
    icon: "FileTextOutlined",
  },
];
