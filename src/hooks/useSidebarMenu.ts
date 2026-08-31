import { useEffect, useMemo, useState } from "react";
import { buildMenuForRender, flattenMenuNodes } from "../app/navigation";
import { useAccess } from "./useAccess";
import { menuApi } from "../services/menuApi";
import type { SidebarMenuNode } from "../types/navigation";

export const useSidebarMenu = () => {
  const { can } = useAccess();
  const [rawMenu, setRawMenu] = useState<SidebarMenuNode[]>([]);

  useEffect(() => {
    let mounted = true;
    void menuApi.getSidebarMenu().then((menu) => {
      if (mounted) {
        setRawMenu(menu);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const builtMenu = useMemo(() => buildMenuForRender(rawMenu, can), [rawMenu, can]);
  const flatNodes = useMemo(() => flattenMenuNodes(builtMenu.tree), [builtMenu.tree]);

  return {
    menuItems: builtMenu.items,
    menuTree: builtMenu.tree,
    flatNodes,
  };
};
