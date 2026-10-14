import { Button, Card, Col, Form, Input, Row, Select, type FormInstance } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { TEMPLATE_FORMATS, type SaveTemplateRequest } from "../../../types/notification";
import { CODE_PATTERN, parseJsonObject, toOptions } from "../shared/notificationForm";

const CONTENT_HINTS: Record<string, string> = {
  TEXT: "Plain-text email body. Use {{key}} placeholders.",
  HTML: "HTML email body. Use {{key}} placeholders.",
  ADAPTIVE_CARD: "Adaptive Card JSON for MS Teams.",
  JSON: "JSON object sent as the webhook request body.",
};

type TemplateFormProps = {
  form: FormInstance<SaveTemplateRequest>;
  disabled: boolean;
  saving: boolean;
  onSubmit: () => void;
};

export function TemplateForm({ form, disabled, saving, onSubmit }: TemplateFormProps) {
  const format = Form.useWatch("format", form);

  return (
    <Card>
      <Form form={form} layout="vertical" initialValues={{ format: "HTML" }} disabled={disabled}>
        <Row gutter={12}>
          <Col span={10}>
            <Form.Item
              name="code"
              label="Code"
              rules={[{ required: true }, { pattern: CODE_PATTERN, message: "Letters, digits, '_' or '-'" }]}
            >
              <Input placeholder="AIRFLOW_FAILED_EMAIL" />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="format" label="Format" extra="EMAIL: TEXT/HTML · MSTEAMS: ADAPTIVE_CARD · WEBHOOK: JSON">
          <Select options={toOptions(TEMPLATE_FORMATS)} />
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="[{{level}}] DAG {{dag_id}} failed" />
        </Form.Item>
        <Form.Item
          name="content"
          label="Content"
          extra={format ? CONTENT_HINTS[format] : undefined}
          rules={[
            { required: true },
            {
              validator: async (_, value: string | undefined) => {
                if (form.getFieldValue("format") === "JSON" && value?.trim()) parseJsonObject(value);
              },
              message: "JSON format requires a JSON object",
            },
          ]}
        >
          <Input.TextArea rows={14} style={{ fontFamily: "monospace" }} />
        </Form.Item>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={onSubmit}>
          Save new version
        </Button>
      </Form>
    </Card>
  );
}
