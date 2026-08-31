import { MOCK_SIDEBAR_MENU } from "../data/mockMenu";
import type { SidebarMenuNode } from "../types/navigation";
import { apiClient } from "./apiClient";

export const menuApi = {
  getSidebarMenu: async () => {
    if (import.meta.env.VITE_MENU_FROM_BACKEND !== "true") {
      return MOCK_SIDEBAR_MENU;
    }
    try {
      return await apiClient.get<SidebarMenuNode[]>("/navigation/sidebar");
    } catch {
      return MOCK_SIDEBAR_MENU;
    }
  },
};
