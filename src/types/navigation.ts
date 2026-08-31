import type { Permission } from "./platform";

export type SidebarMenuNode = {
  key: string;
  label: string;
  icon?: string;
  permission?: Permission;
  children?: SidebarMenuNode[];
};
