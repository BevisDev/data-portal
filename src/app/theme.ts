import { theme as antdTheme } from "antd";
import type { ThemeConfig } from "antd";

/**
 * Data/analytics palette: deep-teal primary (white text passes WCAG AA) on navy chrome.
 * antd exposes these as CSS variables (`--ant-color-primary`, ...) that app.css reuses.
 */
export const enterpriseTheme: ThemeConfig = {
  algorithm: [antdTheme.defaultAlgorithm, antdTheme.compactAlgorithm],
  cssVar: { prefix: "ant" },
  token: {
    colorPrimary: "#0e7490",
    colorInfo: "#0284c7",
    colorSuccess: "#059669",
    colorWarning: "#d97706",
    colorError: "#dc2626",
    colorLink: "#0e7490",
    colorTextBase: "#0f172a",
    colorBgLayout: "#f1f5f9",
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    Layout: {
      bodyBg: "transparent",
      siderBg: "#0b1726",
    },
    Menu: {
      darkItemBg: "#0b1726",
      darkSubMenuItemBg: "#08111d",
      darkItemSelectedBg: "#0e7490",
      darkItemHoverBg: "rgba(34, 211, 238, 0.08)",
      darkItemColor: "#cbd5e1",
      darkItemSelectedColor: "#ffffff",
      itemBorderRadius: 8,
    },
    Card: {
      headerFontSize: 16,
      borderRadiusLG: 12,
    },
    Table: {
      borderColor: "#e2e8f0",
      headerBg: "#f8fafc",
      rowHoverBg: "#ecfeff",
    },
  },
};
