import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  NotificationOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import {
  isMenuGroup,
  type FlatMenuLink,
  type RawMenuNode,
  type SidebarMenuLink,
  type SidebarMenuNode,
} from "../types/navigation";
import type { Permission } from "../types/platform";

const ICON_MAP: Record<string, ReactNode> = {
  AppstoreOutlined: <AppstoreOutlined />,
  AuditOutlined: <AuditOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  DatabaseOutlined: <DatabaseOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  NotificationOutlined: <NotificationOutlined />,
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  SettingOutlined: <SettingOutlined />,
  TeamOutlined: <TeamOutlined />,
  UserOutlined: <UserOutlined />,
};

/**
 * Normalizes any menu tree to the 2-level shape (group → links).
 * Anything nested below a group is lifted to level 2: only its leaf pages are kept (intermediate
 * nodes are just folders), and a leaf without a permission inherits the nearest ancestor's one.
 */
const collectLeaves = (nodes: RawMenuNode[], inherited?: Permission): SidebarMenuLink[] =>
  nodes.flatMap((node) => {
    const permission = node.permission ?? inherited;
    if (node.children?.length) {
      return collectLeaves(node.children, permission);
    }
    return [{ key: node.key, label: node.label, icon: node.icon, permission }];
  });

export const normalizeMenu = (nodes: RawMenuNode[]): SidebarMenuNode[] =>
  nodes.map(({ children, ...entry }) =>
    children?.length ? { ...entry, children: collectLeaves(children, entry.permission) } : entry,
  );

/** A link is shown when permitted; a group is shown when it still has a visible link. */
export const filterMenuByPermission = (
  nodes: SidebarMenuNode[],
  hasPermission: (permission: Permission) => boolean,
): SidebarMenuNode[] => {
  const allowed = (link: SidebarMenuLink) => !link.permission || hasPermission(link.permission);
  return nodes.flatMap((node): SidebarMenuNode[] => {
    if (!isMenuGroup(node)) {
      return allowed(node) ? [node] : [];
    }
    const children = node.children.filter(allowed);
    return children.length ? [{ ...node, children }] : [];
  });
};

const iconOf = (node: SidebarMenuLink) => (node.icon ? ICON_MAP[node.icon] : undefined);

export const toMenuItems = (nodes: SidebarMenuNode[]): MenuProps["items"] =>
  nodes.map((node) =>
    isMenuGroup(node)
      ? {
          key: node.key,
          label: node.label,
          icon: iconOf(node),
          children: node.children.map((child) => ({ key: child.key, label: child.label, icon: iconOf(child) })),
        }
      : { key: node.key, label: node.label, icon: iconOf(node) },
  );

/** Every clickable page, with its group key; groups themselves are not pages. */
export const flattenMenuLinks = (nodes: SidebarMenuNode[]): FlatMenuLink[] =>
  nodes.flatMap((node) =>
    isMenuGroup(node) ? node.children.map((child) => ({ ...child, parentKey: node.key })) : [node],
  );

export const buildMenuForRender = (
  sourceNodes: RawMenuNode[],
  hasPermission: (permission: Permission) => boolean,
) => {
  const tree = filterMenuByPermission(normalizeMenu(sourceNodes), hasPermission);
  return {
    tree,
    items: toMenuItems(tree),
  };
};
