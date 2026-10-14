import { Divider, Form, Input, InputNumber, Select, Space } from "antd";
import { AUTH_MODES, HTTP_METHODS, TOKEN_BODY_FORMATS, type WebhookData } from "../../../types/notification";
import { jsonObjectRule, parseHeaderMap, toOptions } from "../shared/notificationForm";

const monospace = { fontFamily: "monospace" };

function StaticAuthFields({ editing }: { editing: WebhookData | null }) {
  return (
    <Form.Item
      name="header_value"
      label="Header value (secret)"
      rules={[{ required: true, message: "Required for STATIC" }]}
      extra={editing?.auth?.has_header_value ? "A value is stored but never returned; re-enter it to save." : undefined}
    >
      <Input.Password autoComplete="new-password" />
    </Form.Item>
  );
}

function TokenEndpointFields({ editing }: { editing: WebhookData | null }) {
  return (
    <>
      <Form.Item name="token_url" label="Token URL" rules={[{ required: true }, { type: "url" }]}>
        <Input />
      </Form.Item>
      <Space wrap>
        <Form.Item name="token_method" label="Token method">
          <Select style={{ width: 110 }} options={toOptions(HTTP_METHODS)} />
        </Form.Item>
        <Form.Item name="token_body_format" label="Body format">
          <Select style={{ width: 110 }} options={toOptions(TOKEN_BODY_FORMATS)} />
        </Form.Item>
        <Form.Item name="token_path" label="Token path" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="expires_in_path" label="Expires-in path">
          <Input />
        </Form.Item>
        <Form.Item name="header_prefix" label="Header prefix">
          <Input />
        </Form.Item>
      </Space>
      <Form.Item name="request_headers" label="Token request headers (JSON)" rules={[jsonObjectRule(parseHeaderMap)]}>
        <Input.TextArea rows={2} style={monospace} />
      </Form.Item>
      <Form.Item
        name="request_body"
        label="Token request body (JSON)"
        rules={[jsonObjectRule()]}
        extra={editing ? "Stored body is not returned; re-enter it to keep it." : undefined}
      >
        <Input.TextArea rows={3} style={monospace} />
      </Form.Item>
      <Space>
        <Form.Item name="auth_timeout_seconds" label="Token timeout (s)">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item name="default_ttl_seconds" label="Default TTL (s)">
          <InputNumber min={1} />
        </Form.Item>
      </Space>
    </>
  );
}

/** Authentication section of the webhook form; fields switch on `auth_mode`. */
export function WebhookAuthFields({ editing }: { editing: WebhookData | null }) {
  return (
    <>
      <Divider titlePlacement="start">Authentication</Divider>
      <Space wrap>
        <Form.Item name="auth_mode" label="Mode" rules={[{ required: true }]}>
          <Select style={{ width: 180 }} options={toOptions(AUTH_MODES)} />
        </Form.Item>
        <Form.Item name="header_name" label="Header name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Space>
      <Form.Item noStyle shouldUpdate={(prev, next) => prev.auth_mode !== next.auth_mode}>
        {({ getFieldValue }) =>
          getFieldValue("auth_mode") === "STATIC" ? (
            <StaticAuthFields editing={editing} />
          ) : (
            <TokenEndpointFields editing={editing} />
          )
        }
      </Form.Item>
    </>
  );
}
