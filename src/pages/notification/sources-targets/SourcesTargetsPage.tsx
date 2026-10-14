import { Space, Tabs } from "antd";
import { PageHeader } from "../shared/PageHeader";
import { EntityPanel } from "./EntityPanel";

export function SourcesTargetsPage() {
  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <PageHeader
        title="Sources & Targets"
        description="Sources are the services allowed to send. Targets are reusable destination groups bound to one channel."
      />
      <Tabs
        items={[
          { key: "source", label: "Sources", children: <EntityPanel kind="source" /> },
          { key: "target", label: "Targets", children: <EntityPanel kind="target" /> },
        ]}
      />
    </Space>
  );
}
