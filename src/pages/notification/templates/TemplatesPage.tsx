import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { App, Col, Form, Row, Space } from "antd";
import { useAccess } from "../../../hooks/useAccess";
import { notificationApi, notificationErrorMessage } from "../../../services/notificationApi";
import type { SaveTemplateRequest, TemplateData } from "../../../types/notification";
import { PageHeader } from "../shared/PageHeader";
import { TemplateForm } from "./TemplateForm";
import { TemplateSidePanel } from "./TemplateSidePanel";

export function TemplatesPage() {
  const { message } = App.useApp();
  const canManage = useAccess().can("notification:manage");
  const [form] = Form.useForm<SaveTemplateRequest>();
  const [saved, setSaved] = useState<TemplateData | null>(null);
  const title = Form.useWatch("title", form) ?? "";
  const content = Form.useWatch("content", form) ?? "";
  const format = Form.useWatch("format", form);

  const save = useMutation({
    mutationFn: notificationApi.saveTemplate,
    onSuccess: (data) => {
      setSaved(data);
      message.success(`Saved ${data.code} as version ${data.version} (template id ${data.id}).`);
    },
    onError: (error) => message.error(notificationErrorMessage(error)),
  });

  const submit = async () => {
    const values = await form.validateFields();
    save.mutate({ ...values, code: values.code.trim().toUpperCase() });
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <PageHeader
        title="Templates"
        description="Saving a code that already exists adds a new version; sends always use the latest ACTIVE version. Reference the returned template id from a definition target."
      />
      <Row gutter={16}>
        <Col xs={24} lg={15}>
          <TemplateForm form={form} disabled={!canManage} saving={save.isPending} onSubmit={() => void submit()} />
        </Col>
        <Col xs={24} lg={9}>
          <TemplateSidePanel title={title} content={content} format={format} saved={saved} />
        </Col>
      </Row>
    </Space>
  );
}
