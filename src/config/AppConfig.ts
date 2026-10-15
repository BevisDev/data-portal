/**
 * Application config, loaded once at startup from the env keys declared in ENV_KEYS — nothing else is read.
 *
 * Source of the values:
 * - Container (k8s): env vars injected into the pod. nginx serves them as /config.js (`window.__APP_CONFIG__`),
 *   see the `/config.js` location in deploy/nginx/default.conf.template (the browser cannot read the pod env).
 * - Local `npm run dev`: the project's .env, via `import.meta.env`.
 * Runtime values win over build-time ones; empty means "use the default". These values are public: no secrets.
 *
 * To add a key: add it to ENV_KEYS, to the /config.js location in deploy/nginx/default.conf.template, and map it in `loadAppConfig`.
 */

export const ENV_KEYS = ["VITE_API_BASE_URL", "VITE_MENU_FROM_BACKEND"] as const;

type EnvKey = (typeof ENV_KEYS)[number];
type Env = Partial<Record<EnvKey, string>>;

declare global {
  interface Window {
    __APP_CONFIG__?: Env;
  }
}

export type AppConfig = {
  /** VITE_API_BASE_URL + "/api": portal-be API. VITE_API_BASE_URL is the portal-be root (empty = same origin). */
  apiBaseUrl: string;
  /** VITE_API_BASE_URL + "/api/notification": notification endpoints on portal-be. */
  notificationApiBaseUrl: string;
  /** VITE_MENU_FROM_BACKEND: load the sidebar from the API instead of the built-in menu. */
  menuFromBackend: boolean;
};

const nonEmpty = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

/** Picks only the declared keys: runtime (/config.js) first, then build-time (.env). */
const loadEnv = (): Env => {
  const runtime = window.__APP_CONFIG__ ?? {};
  const buildTime = import.meta.env as Record<string, string | undefined>;
  const env: Env = {};
  for (const key of ENV_KEYS) {
    env[key] = nonEmpty(runtime[key]) ?? nonEmpty(buildTime[key]);
  }
  return env;
};

const reader = (env: Env) => ({
  string: (key: EnvKey, fallback: string) => env[key] ?? fallback,
  bool: (key: EnvKey, fallback: boolean) => {
    const value = env[key]?.toLowerCase();
    return value === undefined ? fallback : ["true", "1", "yes", "on"].includes(value);
  },
  number: (key: EnvKey, fallback: number) => {
    const value = Number(env[key]);
    return env[key] === undefined || Number.isNaN(value) ? fallback : value;
  },
});

const loadAppConfig = (): AppConfig => {
  const env = reader(loadEnv());
  const root = env.string("VITE_API_BASE_URL", "").replace(/\/+$/, "");
  return {
    apiBaseUrl: `${root}/api`,
    notificationApiBaseUrl: `${root}/api/notification`,
    menuFromBackend: env.bool("VITE_MENU_FROM_BACKEND", false),
  };
};

export const appConfig: Readonly<AppConfig> = Object.freeze(loadAppConfig());
