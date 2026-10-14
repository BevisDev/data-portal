import { notificationApi } from "../../../services/notificationApi";
import type { Channel, JsonObject, PatchMetadataRequest, SourceData, TargetData } from "../../../types/notification";

/** Sources and targets share the same create / get / patch-metadata shape; this picks the right endpoint. */
export type EntityKind = "source" | "target";

export type EntityData = SourceData | TargetData;

export type CreateEntityInput = { code: string; name: string; channel_code?: Channel; metadata: JsonObject };

export const ENTITY_LABEL: Record<EntityKind, string> = { source: "Source", target: "Target" };

export const entityApi = {
  get: (kind: EntityKind, code: string): Promise<EntityData> =>
    kind === "source" ? notificationApi.getSource(code) : notificationApi.getTarget(code),

  create: (kind: EntityKind, { channel_code, ...base }: CreateEntityInput) =>
    kind === "source"
      ? notificationApi.createSource(base)
      : notificationApi.createTarget({ ...base, channel_code: channel_code! }),

  patchMetadata: (kind: EntityKind, body: PatchMetadataRequest) =>
    kind === "source" ? notificationApi.patchSourceMetadata(body) : notificationApi.patchTargetMetadata(body),
};
