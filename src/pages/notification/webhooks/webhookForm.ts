import type { AuthMode, SaveWebhookRequest, WebhookData } from "../../../types/notification";
import { parseHeaderMap, parseJsonObject, prettyJson } from "../shared/notificationForm";

/** Flat form shape; JSON fields are edited as text and parsed on submit. */
export type WebhookFormValues = {
  target_code: string;
  domain: string;
  path?: string;
  method: string;
  timeout_seconds: number;
  max_retries: number;
  headers?: string;
  auth_mode: AuthMode;
  header_name: string;
  header_value?: string;
  header_prefix: string;
  token_url?: string;
  token_method: string;
  token_body_format: string;
  request_headers?: string;
  request_body?: string;
  token_path: string;
  expires_in_path?: string;
  auth_timeout_seconds: number;
  default_ttl_seconds: number;
};

/** Mirrors the serde defaults of `SaveWebhookRequest` in notification-service. */
export const NEW_WEBHOOK: Partial<WebhookFormValues> = {
  method: "POST",
  timeout_seconds: 10,
  max_retries: 3,
  headers: "{}",
  auth_mode: "STATIC",
  header_name: "x-api-key",
  header_prefix: "Bearer ",
  token_method: "POST",
  token_body_format: "JSON",
  request_headers: "{}",
  request_body: "{}",
  token_path: "access_token",
  expires_in_path: "expires_in",
  auth_timeout_seconds: 10,
  default_ttl_seconds: 300,
};

// Secrets (header_value, request_body) are never returned, so they stay blank on edit.
export const webhookToForm = (webhook: WebhookData): Partial<WebhookFormValues> => {
  const auth = webhook.auth;
  return {
    ...NEW_WEBHOOK,
    target_code: webhook.target_code,
    domain: webhook.domain,
    path: webhook.path ?? undefined,
    method: webhook.method,
    timeout_seconds: webhook.timeout_seconds,
    max_retries: webhook.max_retries,
    headers: prettyJson(webhook.headers),
    ...(auth && {
      auth_mode: auth.auth_mode,
      header_name: auth.header_name,
      header_prefix: auth.header_prefix,
      token_url: auth.token_url ?? undefined,
      token_method: auth.token_method,
      token_body_format: auth.token_body_format,
      token_path: auth.token_path,
      expires_in_path: auth.expires_in_path ?? undefined,
      auth_timeout_seconds: auth.timeout_seconds,
      default_ttl_seconds: auth.default_ttl_seconds,
    }),
  };
};

export const formToWebhookRequest = (v: WebhookFormValues): SaveWebhookRequest => ({
  target_code: v.target_code.trim().toUpperCase(),
  domain: v.domain.trim(),
  path: v.path?.trim() || null,
  method: v.method,
  timeout_seconds: v.timeout_seconds,
  max_retries: v.max_retries,
  headers: parseHeaderMap(v.headers),
  auth: {
    auth_mode: v.auth_mode,
    header_name: v.header_name.trim(),
    header_value: v.auth_mode === "STATIC" ? v.header_value : null,
    header_prefix: v.header_prefix,
    token_url: v.auth_mode === "TOKEN_ENDPOINT" ? v.token_url?.trim() : null,
    token_method: v.token_method,
    token_body_format: v.token_body_format,
    request_headers: parseHeaderMap(v.request_headers),
    request_body: parseJsonObject(v.request_body),
    timeout_seconds: v.auth_timeout_seconds,
    token_path: v.token_path.trim(),
    expires_in_path: v.expires_in_path?.trim() || null,
    default_ttl_seconds: v.default_ttl_seconds,
  },
});
