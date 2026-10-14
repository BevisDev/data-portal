import axios, { AxiosError, type AxiosResponse } from "axios";
import { appConfig } from "../config/AppConfig";
import { useErrorStore } from "../store/errorStore";
import type {
  CreateSourceRequest,
  CreateTargetRequest,
  DefinitionData,
  NotifyRequest,
  PatchMetadataRequest,
  SaveDefinitionRequest,
  SaveTemplateRequest,
  SaveWebhookRequest,
  SourceData,
  TargetData,
  TemplateData,
  WebhookData,
} from "../types/notification";

/**
 * notification-service answers with a PascalCase envelope `{ Code, Message, Data }`.
 * The `api-key` header is attached by the dev proxy / nginx, never by the browser,
 * so the key stays out of the bundle.
 */
type NotificationEnvelope<T> = {
  Code?: number;
  Message?: string;
  Data?: T;
};

export const notificationHttp = axios.create({
  baseURL: appConfig.notificationApiBaseUrl,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const notificationErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const body = error.response?.data as NotificationEnvelope<unknown> | undefined;
    return body?.Message ?? error.message;
  }
  return error instanceof Error ? error.message : "Unexpected notification-service error";
};

notificationHttp.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    useErrorStore.getState().setError({
      message: notificationErrorMessage(error),
      source: "notificationApi",
      stack: error.stack,
      at: Date.now(),
    });
    return Promise.reject(error);
  },
);

const unwrap = <T>(response: AxiosResponse<NotificationEnvelope<T>>): T => response.data.Data as T;

const seg = (code: string) => encodeURIComponent(code.trim().toUpperCase());

export const notificationApi = {
  getSource: async (code: string) => unwrap<SourceData>(await notificationHttp.get(`/sources/${seg(code)}`)),
  createSource: async (body: CreateSourceRequest) => {
    await notificationHttp.post("/sources", body);
  },
  patchSourceMetadata: async (body: PatchMetadataRequest) => {
    await notificationHttp.patch("/sources/metadata", body);
  },

  getTarget: async (code: string) => unwrap<TargetData>(await notificationHttp.get(`/targets/${seg(code)}`)),
  createTarget: async (body: CreateTargetRequest) => {
    await notificationHttp.post("/targets", body);
  },
  patchTargetMetadata: async (body: PatchMetadataRequest) => {
    await notificationHttp.patch("/targets/metadata", body);
  },

  saveTemplate: async (body: SaveTemplateRequest) =>
    unwrap<TemplateData>(await notificationHttp.post("/templates", body)),

  listDefinitions: async () => unwrap<DefinitionData[]>(await notificationHttp.get("/definitions")) ?? [],
  getDefinition: async (code: string) =>
    unwrap<DefinitionData>(await notificationHttp.get(`/definitions/${seg(code)}`)),
  createDefinition: async (body: SaveDefinitionRequest) =>
    unwrap<DefinitionData>(await notificationHttp.post("/definitions", body)),
  updateDefinition: async (code: string, body: SaveDefinitionRequest) =>
    unwrap<DefinitionData>(await notificationHttp.put(`/definitions/${seg(code)}`, body)),
  deleteDefinition: async (code: string) => {
    await notificationHttp.delete(`/definitions/${seg(code)}`);
  },

  listWebhooks: async () => unwrap<WebhookData[]>(await notificationHttp.get("/webhooks")) ?? [],
  createWebhook: async (body: SaveWebhookRequest) =>
    unwrap<WebhookData>(await notificationHttp.post("/webhooks", body)),
  updateWebhook: async (targetCode: string, body: SaveWebhookRequest) =>
    unwrap<WebhookData>(await notificationHttp.put(`/webhooks/${seg(targetCode)}`, body)),
  deleteWebhook: async (targetCode: string) => {
    await notificationHttp.delete(`/webhooks/${seg(targetCode)}`);
  },

  /** Returns once the service answers 202 Accepted; delivery happens asynchronously in notification-job. */
  notify: async (body: NotifyRequest) => {
    await notificationHttp.post("/noti/notify", body);
  },
};
