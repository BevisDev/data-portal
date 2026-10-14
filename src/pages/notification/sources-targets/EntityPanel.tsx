import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { App, Col, Row } from "antd";
import { useAccess } from "../../../hooks/useAccess";
import { notificationErrorMessage } from "../../../services/notificationApi";
import { EntityCreateCard } from "./EntityCreateCard";
import { EntityLookupCard } from "./EntityLookupCard";
import { entityApi, type EntityData, type EntityKind } from "./entityApi";

/** One tab of the page: lookup on the left, create on the right. A new record is looked up right after creation. */
export function EntityPanel({ kind }: { kind: EntityKind }) {
  const { message } = App.useApp();
  const canManage = useAccess().can("notification:manage");
  const [code, setCode] = useState("");
  const [found, setFound] = useState<EntityData | null>(null);

  const lookup = useMutation({
    mutationFn: (lookupCode: string) => entityApi.get(kind, lookupCode),
    onSuccess: setFound,
    onError: (error) => {
      setFound(null);
      message.error(notificationErrorMessage(error));
    },
  });

  return (
    <Row gutter={16}>
      <Col xs={24} lg={14}>
        <EntityLookupCard
          kind={kind}
          canManage={canManage}
          code={code}
          onCodeChange={setCode}
          found={found}
          loading={lookup.isPending}
          onLookup={(lookupCode) => lookup.mutate(lookupCode)}
        />
      </Col>
      {canManage && (
        <Col xs={24} lg={10}>
          <EntityCreateCard
            kind={kind}
            onCreated={(createdCode) => {
              setCode(createdCode);
              lookup.mutate(createdCode);
            }}
          />
        </Col>
      )}
    </Row>
  );
}
