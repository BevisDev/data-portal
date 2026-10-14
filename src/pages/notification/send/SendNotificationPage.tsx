import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Alert, App, Button, Card, Form, Input, Select, Space, Typography } from "antd";
import { SendOutlined, SyncOutlined } from "@ant-design/icons";
import { notificationApi, notificationErrorMessage } from "../../../services/notificationApi";
import type { NotifyRequest } from "../../../types/notification";
import { useDefinitionList } from "../definitions/useDefinitions";
import { CODE_PATTERN, jsonObjectRule, parseJsonObject } from "../shared/notificationForm";

type SendForm = Omit<NotifyRequest, "variables"> & { variables?: string };

const newTraceId = (code = "portal") => `${code.toLowerCase()}-${Date.now()}`;

export function SendNotificationPage() {
  const { message } = App.useApp();
  const [params] = useSearchParams();
  const [form] = Form.useForm<SendForm>();
  const [accepted, setAccepted] = useState<string | null>(null);
  const definitions = useDefinitionList();

  const send = useMutation({
    mutationFn: notificationApi.notify,
    onSuccess: (_, body) => {
      setAccepted(body.trace_id);
      message.success("Accepted (202). Delivery runs asynchronously in notification-job.");
      // trace_id is the idempotency key: rotate it so the next send is not rejected with 409.
      form.setFieldValue("trace_id", newTraceId(body.code));
    },
    onError: (error) => {
      setAccepted(null);
      message.error(notificationErrorMessage(error));
    },
  });

  const submit = async () => {
    const values = await form.validateFields();
    send.mutate({
      source: values.source.trim().toUpperCase(),
      code: values.code,
      trace_id: values.trace_id.trim(),
      variables: parseJsonObject(values.variables),
    });
  };

  const initialCode = params.get("code") ?? undefined;

  return (
    <Space direction="vertical" size={16} style={{ width: "100%", maxWidth: 760 }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Send Test Notification
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
        Calls <Typography.Text code>POST /noti/notify</Typography.Text>. The definition must be ACTIVE and belong to
        the given source; a repeated (source, trace_id) is rejected with 409.
      </Typography.Paragraph>
      {accepted && <Alert type="success" showIcon message={`Accepted — trace_id ${accepted}`} closable onClose={() => setAccepted(null)} />}
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ code: initialCode, trace_id: newTraceId(initialCode), variables: "{\n  \n}" }}
        >
          <Form.Item name="code" label="Definition" rules={[{ required: true }]}>
            <Select
              showSearch
              loading={definitions.isLoading}
              options={definitions.data?.map((d) => ({ value: d.code, label: `${d.code} — ${d.name}` }))}
            />
          </Form.Item>
          <Form.Item
            name="source"
            label="Source code"
            rules={[{ required: true }, { pattern: CODE_PATTERN, message: "Letters, digits, '_' or '-'" }]}
          >
            <Input placeholder="AIRFLOW" />
          </Form.Item>
          <Form.Item label="Trace id" required>
            <Space.Compact block>
              <Form.Item name="trace_id" noStyle rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Button
                icon={<SyncOutlined />}
                onClick={() => form.setFieldValue("trace_id", newTraceId(form.getFieldValue("code")))}
              />
            </Space.Compact>
          </Form.Item>
          <Form.Item
            name="variables"
            label="Variables (JSON)"
            rules={[jsonObjectRule()]}
            extra="Replaces {{key}} placeholders. Webhook targets without a template receive this object as the body."
          >
            <Input.TextArea rows={8} style={{ fontFamily: "monospace" }} />
          </Form.Item>
          <Button type="primary" icon={<SendOutlined />} loading={send.isPending} onClick={() => void submit()}>
            Send
          </Button>
        </Form>
      </Card>
    </Space>
  );
}
