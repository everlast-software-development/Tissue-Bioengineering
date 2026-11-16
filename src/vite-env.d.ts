/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API origin when it is not same-origin (see src/lib/api.ts). */
  readonly VITE_API_BASE_URL?: string;
  /** Cloudflare Turnstile site key (public); overrides the default in Turnstile.tsx. */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
