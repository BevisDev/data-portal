import { useMemo } from "react";
import { Card, Col, Row, Space, Statistic, Table, Tag, Typography } from "antd";
import { Column, Pie } from "@ant-design/charts";
import { usePlatformStore } from "../store/platformStore";

export function DashboardPage() {
  const records = usePlatformStore((state) => state.records);
  const users = usePlatformStore((state) => state.users);
  const roles = usePlatformStore((state) => state.roles);

  const byCategory = useMemo(() => {
    const aggregate = new Map<string, number>();
    for (const item of records) {
      aggregate.set(item.category, (aggregate.get(item.category) ?? 0) + 1);
    }
    return Array.from(aggregate.entries()).map(([category, count]) => ({ category, count }));
  }, [records]);

  const byStatus = useMemo(() => {
    const aggregate = new Map<string, number>();
    for (const item of records) {
      aggregate.set(item.status, (aggregate.get(item.status) ?? 0) + 1);
    }
    return Array.from(aggregate.entries()).map(([status, value]) => ({ status, value }));
  }, [records]);

  return (
    <Space direction="vertical" size={18} style={{ width: "100%" }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Dashboard Overview
      </Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="metric-card" bordered={false}>
            <Statistic title="Data Assets" value={records.length} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="metric-card" bordered={false}>
            <Statistic title="Users" value={users.length} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="metric-card" bordered={false}>
            <Statistic title="Roles" value={roles.length} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Asset Distribution by Category" bordered={false}>
            <Column
              data={byCategory}
              xField="category"
              yField="count"
              colorField="category"
              axis={{ y: { title: "Records" } }}
              style={{ radiusTopLeft: 8, radiusTopRight: 8 }}
              height={280}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Asset Status Mix" bordered={false}>
            <Pie
              data={byStatus}
              angleField="value"
              colorField="status"
              innerRadius={0.6}
              height={280}
              labels={[
                {
                  text: "value",
                  style: {
                    fontWeight: "bold",
                  },
                },
              ]}
              legend={{ color: { position: "right", rowPadding: 5 } }}
            />
          </Card>
        </Col>
      </Row>
      <Card title="Latest Records" bordered={false}>
        <Table
          rowKey="id"
          pagination={{ pageSize: 5 }}
          dataSource={[...records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))}
          columns={[
            { title: "Name", dataIndex: "name" },
            { title: "Category", dataIndex: "category" },
            { title: "Owner", dataIndex: "owner" },
            {
              title: "Status",
              dataIndex: "status",
              render: (status: string) => <Tag color={status === "active" ? "green" : status === "draft" ? "orange" : "default"}>{status}</Tag>,
            },
            { title: "Updated", dataIndex: "updatedAt" },
          ]}
        />
      </Card>
    </Space>
  );
}
