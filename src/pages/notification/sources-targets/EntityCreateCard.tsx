import { useMutation } from "@tanstack/react-query";
import { App, Button, Card, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { notificationErrorMessage } from "../../../services/notificationApi";
import { CHANNELS, type Channel } from "../../../types/notification";
import { codeRules, jsonObjectRule, parseJsonObject, toOptions } from "../shared/notificationForm";
import { ENTITY_LABEL, entityApi, type EntityKind } from "./entityApi";

const METADATA_HINTS: Record<Channel, string> = {
  EMAIL: '{"to": ["a@corp.com"], "cc": [], "bcc": []}',
  MSTEAMS: '{"url": "https://...webhook.office.com/..."}',
  WEBHOOK: "{} — endpoint is configured on the Webhooks page",
};

type CreateFormValues = { code: string; name: string; channel_code?: Channel; metadata?: string };

type EntityCreateCardProps = {
  kind: EntityKind;
  /** Called with the normalized code after a successful create. */
  onCreated: (code: string) => void;
};

export function EntityCreateCard({ kind, onCreated }: EntityCreateCardProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<CreateFormValues>();
  const channel = Form.useWatch("channel_code", form);

  const create = useMutation({
    mutationFn: async (values: CreateFormValues) => {
      const code = values.code.trim().toUpperCase();
      await entityApi.create(kind, {
        code,
        name: values.name,
        channel_code: values.channel_code,
        metadata: parseJsonObject(values.metadata),
      });
      return code;
    },
    onSuccess: (code) => {
      message.success(`Created ${code}.`);
      form.resetFields();
      onCreated(code);
    },
    onError: (error) => message.error(notificationErrorMessage(error)),
  });

  return (
    <Card title={`New ${ENTITY_LABEL[kind].toLowerCase()}`}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ channel_code: "EMAIL", metadata: "{}" }}
        onFinish={(values) => create.mutate(values)}
      >
        <Form.Item name="code" label="Code" rules={codeRules}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        {kind === "target" && (
          <Form.Item name="channel_code" label="Channel" rules={[{ required: true }]}>
            <Select options={toOptions(CHANNELS)} />
          </Form.Item>
        )}
        <Form.Item
          name="metadata"
          label="Metadata (JSON)"
          rules={[jsonObjectRule()]}
          extra={kind === "target" && channel ? METADATA_HINTS[channel] : undefined}
        >
          <Input.TextArea rows={5} style={{ fontFamily: "monospace" }} />
        </Form.Item>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={create.isPending}>
          Create
        </Button>
      </Form>
    </Card>
  );
}
