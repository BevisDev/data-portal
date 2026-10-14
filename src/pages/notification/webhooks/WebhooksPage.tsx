import { useState } from "react";
import { Alert, Button, Space } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useAccess } from "../../../hooks/useAccess";
import { notificationErrorMessage } from "../../../services/notificationApi";
import type { WebhookData } from "../../../types/notification";
import { PageHeader } from "../shared/PageHeader";
import { WebhookFormModal } from "./WebhookFormModal";
import { WebhookTable } from "./WebhookTable";
import { useDeleteWebhook, useWebhookList } from "./useWebhooks";

type ModalState = { open: boolean; editing: WebhookData | null };

export function WebhooksPage() {
  const canManage = useAccess().can("notification:manage");
  const webhooks = useWebhookList();
  const remove = useDeleteWebhook();
  const [modal, setModal] = useState<ModalState>({ open: false, editing: null });

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <PageHeader
        title="Webhook Endpoints"
        actions={
          <>
            <Button icon={<ReloadOutlined />} onClick={() => void webhooks.refetch()} />
            {canManage && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ open: true, editing: null })}>
                New Webhook
              </Button>
            )}
          </>
        }
      />
      {webhooks.isError && <Alert type="error" showIcon message={notificationErrorMessage(webhooks.error)} />}
      <WebhookTable
        data={webhooks.data}
        loading={webhooks.isLoading}
        canManage={canManage}
        onEdit={(webhook) => setModal({ open: true, editing: webhook })}
        onDelete={(webhook) => remove.mutate(webhook.target_code)}
      />
      <WebhookFormModal
        open={modal.open}
        editing={modal.editing}
        onClose={() => setModal((current) => ({ ...current, open: false }))}
      />
    </Space>
  );
}
