import { theme as antdTheme } from "antd";
import type { ThemeConfig } from "antd";

export const enterpriseTheme: ThemeConfig = {
  algorithm: [antdTheme.defaultAlgorithm, antdTheme.compactAlgorithm],
  token: {
    colorPrimary: "#4361ee",
    colorInfo: "#4895ef",
    colorSuccess: "#2a9d8f",
    colorWarning: "#ffb703",
    colorError: "#d90429",
    borderRadius: 10,
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif",
  },
  components: {
    Layout: {
      bodyBg: "#f5f7fb",
      headerBg: "#ffffff",
      siderBg: "#0f172a",
      triggerBg: "#111827",
    },
    Menu: {
      darkItemBg: "#0f172a",
      darkItemSelectedBg: "rgba(67, 97, 238, 0.38)",
      darkItemHoverBg: "rgba(67, 97, 238, 0.2)",
      darkItemColor: "#cbd5e1",
      darkItemSelectedColor: "#ffffff",
      itemBorderRadius: 8,
    },
    Card: {
      headerFontSize: 16,
      borderRadiusLG: 12,
    },
    Table: {
      borderColor: "#f1f5f9",
      rowHoverBg: "#f8fafc",
    },
  },
};
