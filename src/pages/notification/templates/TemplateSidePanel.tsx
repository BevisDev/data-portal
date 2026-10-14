import { Card, Descriptions, Space, Tag, Typography } from "antd";
import type { TemplateData, TemplateFormat } from "../../../types/notification";
import { extractPlaceholders } from "../shared/notificationForm";
import { StatusTag } from "../shared/tags";

type TemplateSidePanelProps = {
  title: string;
  content: string;
  format?: TemplateFormat;
  saved: TemplateData | null;
};

/** Live helpers next to the editor: placeholders found, HTML preview, and the last saved version. */
export function TemplateSidePanel({ title, content, format, saved }: TemplateSidePanelProps) {
  const placeholders = extractPlaceholders(title, content);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card title="Placeholders" size="small">
        {placeholders.length ? (
          <Space wrap>
            {placeholders.map((key) => (
              <Tag key={key}>{key}</Tag>
            ))}
          </Space>
        ) : (
          <Typography.Text type="secondary">No {"{{key}}"} placeholders yet.</Typography.Text>
        )}
      </Card>
      {format === "HTML" && content && (
        <Card title="HTML preview" size="small">
          <iframe title="preview" sandbox="" srcDoc={content} style={{ width: "100%", height: 260, border: 0 }} />
        </Card>
      )}
      {saved && (
        <Card title="Last saved" size="small">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Template id">
              <Typography.Text copyable strong>
                {saved.id}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Code">{saved.code}</Descriptions.Item>
            <Descriptions.Item label="Version">
              v{saved.version} <StatusTag status={saved.version_status} />
            </Descriptions.Item>
            <Descriptions.Item label="Format">{saved.format}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Space>
  );
}
