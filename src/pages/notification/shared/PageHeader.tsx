import { Space, Typography } from "antd";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Space direction="vertical" size={4} style={{ width: "100%" }}>
      <div className="page-top">
        <Typography.Title level={3} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {actions && <Space>{actions}</Space>}
      </div>
      {description && (
        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
          {description}
        </Typography.Paragraph>
      )}
    </Space>
  );
}
