import { appConfig } from "../config/AppConfig";
import { MOCK_SIDEBAR_MENU } from "../data/mockMenu";
import type { RawMenuNode } from "../types/navigation";
import { apiClient } from "./apiClient";

export const menuApi = {
  getSidebarMenu: async () => {
    if (!appConfig.menuFromBackend) {
      return MOCK_SIDEBAR_MENU;
    }
    try {
      return await apiClient.get<RawMenuNode[]>("/navigation/sidebar");
    } catch {
      return MOCK_SIDEBAR_MENU;
    }
  },
};
