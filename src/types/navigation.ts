import type { Permission } from "./platform";

type MenuEntry = {
  key: string;
  label: string;
  icon?: string;
  permission?: Permission;
};

/**
 * The sidebar has at most 2 levels:
 *   level 1: a page link, or a parent group
 *   level 2: page links inside a group (no further nesting)
 */
export type SidebarMenuLink = MenuEntry;

export type SidebarMenuGroup = MenuEntry & {
  children: SidebarMenuLink[];
};

export type SidebarMenuNode = SidebarMenuLink | SidebarMenuGroup;

/** Menu as received from the backend, which may nest deeper; normalized to 2 levels before rendering. */
export type RawMenuNode = MenuEntry & {
  children?: RawMenuNode[];
};

/** A clickable page in the menu, with the group it sits in (for opening the sidebar). */
export type FlatMenuLink = SidebarMenuLink & {
  parentKey?: string;
};

export const isMenuGroup = (node: SidebarMenuNode): node is SidebarMenuGroup =>
  "children" in node && Array.isArray(node.children);
