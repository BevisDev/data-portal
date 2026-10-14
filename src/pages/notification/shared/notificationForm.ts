import type { Rule } from "antd/es/form";
import type { Channel, JsonObject } from "../../../types/notification";

export const toOptions = <T extends string>(values: readonly T[]) => values.map((value) => ({ value, label: value }));

export const CODE_PATTERN = /^[A-Za-z0-9_-]+$/;

export const codeRules: Rule[] = [
  { required: true, message: "Code is required" },
  { pattern: CODE_PATTERN, message: "Only letters, digits, '_' or '-'" },
];

/** Parses a JSON object from a textarea; blank input means `{}`. */
export const parseJsonObject = (text: string | undefined): JsonObject => {
  if (!text?.trim()) {
    return {};
  }
  const value: unknown = JSON.parse(text);
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Must be a JSON object");
  }
  return value as JsonObject;
};

/** Header maps must be `{ "name": "string value" }`, like the service validates. */
export const parseHeaderMap = (text: string | undefined): Record<string, string> => {
  const value = parseJsonObject(text);
  for (const [name, headerValue] of Object.entries(value)) {
    if (typeof headerValue !== "string") {
      throw new Error(`Header "${name}" must be a string`);
    }
  }
  return value as Record<string, string>;
};

export const jsonObjectRule = (parser: (text: string | undefined) => unknown = parseJsonObject): Rule => ({
  validator: async (_, text: string | undefined) => {
    try {
      parser(text);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Invalid JSON", { cause: error });
    }
  },
});

export const prettyJson = (value: unknown) => JSON.stringify(value ?? {}, null, 2);

/** Channel ids follow the seed order in migration/002_channels.sql. */
export const CHANNEL_BY_ID: Record<number, Channel> = { 1: "EMAIL", 2: "MSTEAMS", 3: "WEBHOOK" };

/** Collects `{{placeholder}}` keys so the send form can prefill variables. */
export const extractPlaceholders = (...texts: string[]) => {
  const keys = new Set<string>();
  for (const text of texts) {
    for (const match of text.matchAll(/\{\{\s*([\w.-]+)\s*\}\}/g)) {
      keys.add(match[1]);
    }
  }
  return [...keys];
};
