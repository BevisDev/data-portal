import { Button, Form, Input, InputNumber, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { codeRules } from "../shared/notificationForm";

/** Ordered list of `{ target_code, template_id }`; the service replaces the whole list on save. */
export function DefinitionTargetsField() {
  return (
    <Form.List
      name="targets"
      rules={[
        {
          validator: async (_, targets?: unknown[]) => {
            if (!targets?.length) throw new Error("Add at least one target");
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ key, name }) => (
            <Space key={key} align="baseline">
              <Form.Item name={[name, "target_code"]} rules={codeRules}>
                <Input placeholder="Target code" />
              </Form.Item>
              <Form.Item name={[name, "template_id"]}>
                <InputNumber min={1} placeholder="Template id" style={{ width: 140 }} />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ target_code: "" })}>
            Add target
          </Button>
          <Form.ErrorList errors={errors} />
        </>
      )}
    </Form.List>
  );
}
