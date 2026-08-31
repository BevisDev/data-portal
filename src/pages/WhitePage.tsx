import { Card, Typography } from "antd";
import { useLocation } from "react-router-dom";

export function WhitePage() {
  const location = useLocation();

  return (
    <Card bordered={false} style={{ background: "#ffffff", minHeight: "70vh" }}>
      <Typography.Title level={3}>White Page</Typography.Title>
      <Typography.Paragraph type="secondary">
        This is a clean placeholder page. Route: <Typography.Text code>{location.pathname}</Typography.Text>
      </Typography.Paragraph>
    </Card>
  );
}
