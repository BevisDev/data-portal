import { useState } from "react";
import { Alert, Button, Space } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAccess } from "../../../hooks/useAccess";
import { notificationErrorMessage } from "../../../services/notificationApi";
import type { DefinitionData } from "../../../types/notification";
import { PageHeader } from "../shared/PageHeader";
import { DefinitionFormModal } from "./DefinitionFormModal";
import { DefinitionTable } from "./DefinitionTable";
import { useDefinitionList, useDeleteDefinition } from "./useDefinitions";

type ModalState = { open: boolean; editing: DefinitionData | null };

export function DefinitionsPage() {
  const canManage = useAccess().can("notification:manage");
  const navigate = useNavigate();
  const definitions = useDefinitionList();
  const remove = useDeleteDefinition();
  const [modal, setModal] = useState<ModalState>({ open: false, editing: null });

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <PageHeader
        title="Notification Definitions"
        actions={
          <>
            <Button icon={<ReloadOutlined />} onClick={() => void definitions.refetch()} />
            {canManage && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ open: true, editing: null })}>
                New Definition
              </Button>
            )}
          </>
        }
      />
      {definitions.isError && <Alert type="error" showIcon message={notificationErrorMessage(definitions.error)} />}
      <DefinitionTable
        data={definitions.data}
        loading={definitions.isLoading}
        canManage={canManage}
        onSendTest={(definition) => navigate(`/notification/send?code=${encodeURIComponent(definition.code)}`)}
        onEdit={(definition) => setModal({ open: true, editing: definition })}
        onDelete={(definition) => remove.mutate(definition.code)}
      />
      <DefinitionFormModal
        open={modal.open}
        editing={modal.editing}
        onClose={() => setModal((current) => ({ ...current, open: false }))}
      />
    </Space>
  );
}
