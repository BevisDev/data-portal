import { useEffect } from "react";
import { Alert, Form, Input, Modal, Select, Space, Typography } from "antd";
import { CHANNELS, CONFIG_STATUSES, LEVELS, type DefinitionData } from "../../../types/notification";
import { codeRules, toOptions } from "../shared/notificationForm";
import { DefinitionTargetsField } from "./DefinitionTargetsField";
import { NEW_DEFINITION, definitionToForm, formToDefinitionRequest, type DefinitionFormValues } from "./definitionForm";
import { useSaveDefinition } from "./useDefinitions";

type DefinitionFormModalProps = {
  open: boolean;
  /** null = create mode. */
  editing: DefinitionData | null;
  onClose: () => void;
};

const WEBHOOK_HINT =
  "WEBHOOK: each target is called separately; without a template the request variables are sent as the body. Template format must be JSON.";
const TEMPLATED_HINT =
  "EMAIL / MSTEAMS: at least one target needs a template; title and body come from the first target that has one. EMAIL merges recipients across targets.";

export function DefinitionFormModal({ open, editing, onClose }: DefinitionFormModalProps) {
  const [form] = Form.useForm<DefinitionFormValues>();
  const save = useSaveDefinition(editing?.code ?? null, onClose);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(editing ? definitionToForm(editing) : NEW_DEFINITION);
    }
  }, [open, editing, form]);

  const submit = async () => {
    const values = await form.validateFields();
    save.mutate(formToDefinitionRequest(values));
  };

  return (
    <Modal
      width={720}
      title={editing ? `Edit ${editing.code}` : "New Definition"}
      open={open}
      confirmLoading={save.isPending}
      onOk={() => void submit()}
      onCancel={onClose}
      forceRender
    >
      {editing && (
        <Alert
          style={{ marginBottom: 16 }}
          type="info"
          showIcon
          message="Re-enter the source code and target codes"
          description={`The service only returns ids (source #${editing.source_id}, targets ${editing.targets
            .map((t) => `#${t.target_id}`)
            .join(", ")}). Saving replaces the whole target list.`}
        />
      )}
      <Form form={form} layout="vertical">
        <Space.Compact block>
          <Form.Item name="code" label="Code" rules={codeRules} style={{ flex: 1 }}>
            <Input disabled={!!editing} placeholder="AIRFLOW_TASK_FAILED" />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]} style={{ flex: 2 }}>
            <Input />
          </Form.Item>
        </Space.Compact>
        <Form.Item name="description" label="Description" extra="Omitting it on update clears it.">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Space wrap>
          <Form.Item name="source_code" label="Source code" rules={codeRules}>
            <Input placeholder="AIRFLOW" />
          </Form.Item>
          <Form.Item name="channel_code" label="Channel" rules={[{ required: true }]}>
            <Select style={{ width: 140 }} options={toOptions(CHANNELS)} />
          </Form.Item>
          <Form.Item name="level" label="Level">
            <Select style={{ width: 130 }} options={toOptions(LEVELS)} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select style={{ width: 130 }} options={toOptions(CONFIG_STATUSES)} />
          </Form.Item>
        </Space>
        <Form.Item noStyle shouldUpdate={(prev, next) => prev.channel_code !== next.channel_code}>
          {({ getFieldValue }) => (
            <Typography.Paragraph type="secondary">
              {getFieldValue("channel_code") === "WEBHOOK" ? WEBHOOK_HINT : TEMPLATED_HINT}
            </Typography.Paragraph>
          )}
        </Form.Item>
        <DefinitionTargetsField />
      </Form>
    </Modal>
  );
}
