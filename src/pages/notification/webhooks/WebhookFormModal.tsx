import { useEffect } from "react";
import { Form, Input, InputNumber, Modal, Select, Space } from "antd";
import { WEBHOOK_METHODS, type WebhookData } from "../../../types/notification";
import { codeRules, jsonObjectRule, parseHeaderMap, toOptions } from "../shared/notificationForm";
import { WebhookAuthFields } from "./WebhookAuthFields";
import { NEW_WEBHOOK, formToWebhookRequest, webhookToForm, type WebhookFormValues } from "./webhookForm";
import { useSaveWebhook } from "./useWebhooks";

type WebhookFormModalProps = {
  open: boolean;
  /** null = create mode. */
  editing: WebhookData | null;
  onClose: () => void;
};

export function WebhookFormModal({ open, editing, onClose }: WebhookFormModalProps) {
  const [form] = Form.useForm<WebhookFormValues>();
  const save = useSaveWebhook(editing?.target_code ?? null, onClose);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(editing ? webhookToForm(editing) : NEW_WEBHOOK);
    }
  }, [open, editing, form]);

  const submit = async () => {
    const values = await form.validateFields();
    save.mutate(formToWebhookRequest(values));
  };

  return (
    <Modal
      width={760}
      title={editing ? `Edit webhook ${editing.target_code}` : "New Webhook"}
      open={open}
      confirmLoading={save.isPending}
      onOk={() => void submit()}
      onCancel={onClose}
      forceRender
    >
      <Form form={form} layout="vertical">
        <Form.Item name="target_code" label="Target code" rules={codeRules} extra="Must be an existing WEBHOOK target.">
          <Input disabled={!!editing} />
        </Form.Item>
        <Space.Compact block>
          <Form.Item name="method" label="Method" rules={[{ required: true }]}>
            <Select style={{ width: 110 }} options={toOptions(WEBHOOK_METHODS)} />
          </Form.Item>
          <Form.Item name="domain" label="Domain" rules={[{ required: true }, { type: "url" }]} style={{ flex: 1 }}>
            <Input placeholder="https://api.example.com" />
          </Form.Item>
          <Form.Item name="path" label="Path" style={{ flex: 1 }}>
            <Input placeholder="/hooks/alerts" />
          </Form.Item>
        </Space.Compact>
        <Space>
          <Form.Item name="timeout_seconds" label="Timeout (s)" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="max_retries" label="Max retries" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
        </Space>
        <Form.Item
          name="headers"
          label="Static headers (JSON)"
          rules={[jsonObjectRule(parseHeaderMap)]}
          extra='Example: {"service": "MIS"}. The auth header wins if names collide.'
        >
          <Input.TextArea rows={3} style={{ fontFamily: "monospace" }} />
        </Form.Item>
        <WebhookAuthFields editing={editing} />
      </Form>
    </Modal>
  );
}
