import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  NotificationOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import type { SidebarMenuNode } from "../types/navigation";
import type { Permission } from "../types/platform";

const ICON_MAP: Record<string, ReactNode> = {
  AppstoreOutlined: <AppstoreOutlined />,
  AuditOutlined: <AuditOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  DatabaseOutlined: <DatabaseOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  NotificationOutlined: <NotificationOutlined />,
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  TeamOutlined: <TeamOutlined />,
  UserOutlined: <UserOutlined />,
};

const MAX_MENU_DEPTH = 5;

const trimToDepth = (nodes: SidebarMenuNode[], depth = 1): SidebarMenuNode[] =>
  nodes.map((node) => ({
    ...node,
    children:
      depth >= MAX_MENU_DEPTH || !node.children?.length
        ? undefined
        : trimToDepth(node.children, depth + 1),
  }));

export const filterMenuByPermission = (
  nodes: SidebarMenuNode[],
  hasPermission: (permission: Permission) => boolean,
): SidebarMenuNode[] => {
  const result: SidebarMenuNode[] = [];

  for (const node of nodes) {
    const children = node.children ? filterMenuByPermission(node.children, hasPermission) : undefined;
    const hasSelfPermission = node.permission ? hasPermission(node.permission) : true;
    if (!hasSelfPermission && !children?.length) {
      continue;
    }
    result.push({
      ...node,
      ...(children ? { children } : {}),
    });
  }

  return result;
};

export const toMenuItems = (nodes: SidebarMenuNode[]): MenuProps["items"] =>
  nodes.map((node) => ({
    key: node.key,
    label: node.label,
    icon: node.icon ? ICON_MAP[node.icon] : undefined,
    children: node.children?.length ? toMenuItems(node.children) : undefined,
  }));

export const flattenMenuNodes = (nodes: SidebarMenuNode[]): SidebarMenuNode[] =>
  nodes.flatMap((node) => [node, ...(node.children ? flattenMenuNodes(node.children) : [])]);

export const buildMenuForRender = (
  sourceNodes: SidebarMenuNode[],
  hasPermission: (permission: Permission) => boolean,
) => {
  const depthSafeMenu = trimToDepth(sourceNodes, 1);
  const filteredMenu = filterMenuByPermission(depthSafeMenu, hasPermission);
  return {
    tree: filteredMenu,
    items: toMenuItems(filteredMenu),
  };
};
