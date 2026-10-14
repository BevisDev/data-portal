import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { App, Button, Card, Descriptions, Input, Space, Typography } from "antd";
import { SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { notificationErrorMessage } from "../../../services/notificationApi";
import { parseJsonObject, prettyJson } from "../shared/notificationForm";
import { ChannelTag, StatusTag } from "../shared/tags";
import { ENTITY_LABEL, entityApi, type EntityData, type EntityKind } from "./entityApi";

type EntityLookupCardProps = {
  kind: EntityKind;
  canManage: boolean;
  code: string;
  onCodeChange: (code: string) => void;
  found: EntityData | null;
  loading: boolean;
  onLookup: (code: string) => void;
};

/** Look up one source/target by code and edit its metadata. */
export function EntityLookupCard({ kind, canManage, code, onCodeChange, found, loading, onLookup }: EntityLookupCardProps) {
  const { message } = App.useApp();
  const label = ENTITY_LABEL[kind];
  // Edits are kept per looked-up record; switching records shows that record's stored metadata.
  const [draft, setDraft] = useState<{ id: number; text: string } | null>(null);
  const metadataText = found && draft?.id === found.id ? draft.text : prettyJson(found?.metadata);

  const patch = useMutation({
    mutationFn: () => entityApi.patchMetadata(kind, { code: found!.code, metadata: parseJsonObject(metadataText) }),
    onSuccess: () => {
      message.success("Metadata updated.");
      setDraft(null);
      onLookup(found!.code);
    },
    onError: (error) => message.error(notificationErrorMessage(error)),
  });

  return (
    <Card title={`Look up ${label.toLowerCase()}`}>
      <Input.Search
        placeholder={`${label} code`}
        enterButton={<SearchOutlined />}
        value={code}
        loading={loading}
        onChange={(e) => onCodeChange(e.target.value)}
        onSearch={(value) => value.trim() && onLookup(value)}
      />
      {found && (
        <Space direction="vertical" style={{ width: "100%", marginTop: 16 }}>
          <Descriptions column={2} size="small" bordered>
            <Descriptions.Item label="Id">{found.id}</Descriptions.Item>
            <Descriptions.Item label="Code">{found.code}</Descriptions.Item>
            <Descriptions.Item label="Name">{found.name}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <StatusTag status={found.status} />
            </Descriptions.Item>
            {"channel_code" in found && (
              <Descriptions.Item label="Channel">
                <ChannelTag channel={found.channel_code} />
              </Descriptions.Item>
            )}
          </Descriptions>
          <Typography.Text strong>Metadata</Typography.Text>
          <Input.TextArea
            rows={8}
            style={{ fontFamily: "monospace" }}
            value={metadataText}
            disabled={!canManage}
            onChange={(e) => setDraft({ id: found.id, text: e.target.value })}
          />
          {canManage && (
            <Button icon={<SaveOutlined />} loading={patch.isPending} onClick={() => patch.mutate()}>
              Save metadata
            </Button>
          )}
        </Space>
      )}
    </Card>
  );
}
