export const CHANNELS = ["EMAIL", "MSTEAMS", "WEBHOOK"] as const;
export const LEVELS = ["INFO", "WARN", "ERROR", "CRITICAL"] as const;
export const CONFIG_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export const TEMPLATE_FORMATS = ["TEXT", "HTML", "ADAPTIVE_CARD", "JSON"] as const;
export const WEBHOOK_METHODS = ["POST", "PUT", "PATCH"] as const;
export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH"] as const;
export const AUTH_MODES = ["STATIC", "TOKEN_ENDPOINT"] as const;
export const TOKEN_BODY_FORMATS = ["JSON", "FORM"] as const;

export type Channel = (typeof CHANNELS)[number];
export type Level = (typeof LEVELS)[number];
export type ConfigStatus = (typeof CONFIG_STATUSES)[number];
export type TemplateFormat = (typeof TEMPLATE_FORMATS)[number];
export type AuthMode = (typeof AUTH_MODES)[number];

/** Template formats each channel accepts (mirrors the service's definition validation). */
export const FORMATS_BY_CHANNEL: Record<Channel, TemplateFormat[]> = {
  EMAIL: ["TEXT", "HTML"],
  MSTEAMS: ["ADAPTIVE_CARD"],
  WEBHOOK: ["JSON"],
};

export type JsonObject = Record<string, unknown>;

export type SourceData = {
  id: number;
  code: string;
  name: string;
  status: ConfigStatus;
  metadata: JsonObject;
  created_at: string;
  updated_at: string | null;
};

export type CreateSourceRequest = {
  code: string;
  name: string;
  metadata: JsonObject;
};

export type TargetData = {
  id: number;
  code: string;
  channel_code: Channel;
  name: string;
  status: ConfigStatus;
  metadata: JsonObject;
  created_at: string;
  updated_at: string | null;
};

export type CreateTargetRequest = {
  code: string;
  channel_code: Channel;
  name: string;
  metadata: JsonObject;
};

export type PatchMetadataRequest = {
  code: string;
  metadata: JsonObject;
};

export type TemplateData = {
  id: number;
  code: string;
  name: string;
  status: ConfigStatus;
  version_id: number;
  version: number;
  version_status: ConfigStatus;
  title: string;
  content: string;
  format: TemplateFormat;
  created_at: string;
  updated_at: string | null;
};

export type SaveTemplateRequest = {
  code: string;
  name: string;
  title: string;
  content: string;
  format: TemplateFormat;
};

export type DefinitionTarget = {
  target_id: number;
  template_id: number | null;
};

export type DefinitionData = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  status: ConfigStatus;
  level: Level;
  source_id: number;
  channel_id: number;
  targets: DefinitionTarget[];
  created_at: string;
  updated_at: string | null;
};

export type DefinitionTargetRequest = {
  target_code: string;
  template_id?: number | null;
};

export type SaveDefinitionRequest = {
  code: string;
  name: string;
  description?: string | null;
  status?: ConfigStatus;
  level?: Level;
  source_code: string;
  channel_code: Channel;
  targets: DefinitionTargetRequest[];
};

export type WebhookAuthData = {
  id: number;
  auth_mode: AuthMode;
  header_name: string;
  has_header_value: boolean;
  header_prefix: string;
  token_url: string | null;
  token_method: string;
  token_body_format: string;
  token_path: string;
  expires_in_path: string | null;
  timeout_seconds: number;
  default_ttl_seconds: number;
};

export type WebhookData = {
  id: number;
  target_id: number;
  target_code: string;
  domain: string;
  path: string | null;
  method: string;
  timeout_seconds: number;
  max_retries: number;
  headers: Record<string, string>;
  auth: WebhookAuthData | null;
  created_at: string;
  updated_at: string | null;
};

export type SaveWebhookAuthRequest = {
  auth_mode: AuthMode;
  header_name: string;
  header_value?: string | null;
  header_prefix?: string;
  token_url?: string | null;
  token_method?: string;
  token_body_format?: string;
  request_headers?: Record<string, string>;
  request_body?: JsonObject;
  timeout_seconds?: number;
  token_path?: string;
  expires_in_path?: string | null;
  default_ttl_seconds?: number;
};

export type SaveWebhookRequest = {
  target_code: string;
  domain: string;
  path?: string | null;
  method: string;
  timeout_seconds: number;
  max_retries: number;
  headers: Record<string, string>;
  auth: SaveWebhookAuthRequest;
};

export type NotifyRequest = {
  source: string;
  code: string;
  trace_id: string;
  variables: JsonObject;
};
