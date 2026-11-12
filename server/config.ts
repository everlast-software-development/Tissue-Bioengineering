/**
 * Server configuration, read once from environment variables.
 *
 * Secrets (SMTP_USER, SMTP_PASS) never leave this module except inside the Nodemailer
 * transport options; nothing here is sent to the browser.
 */

export interface MailConfig {
  smtp: {
    host: string;
    port: number;
    /** true = implicit TLS (usually port 465); false = plain/STARTTLS (usually 587 or 25). */
    secure: boolean;
    /** Refuse to send unless the server upgrades to TLS (only meaningful when `secure` is false). */
    requireTLS: boolean;
    user: string;
    pass: string;
  };
  from: { name: string; address: string };
  to: string;
  /** IANA time zone used for the human-readable submission time in notifications. */
  timeZone: string;
}

export const MAIL_DEFAULTS = {
  MAIL_FROM: 'no-reply@tissuebioengineering.com',
  MAIL_FROM_NAME: 'Tissue Bioengineering',
  MAIL_TO: 'info@tissuebioengineering.com',
  MAIL_TIMEZONE: 'UTC',
} as const;

/** Variables with no safe default. Missing ones are reported by /api/health and at startup. */
const REQUIRED = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'] as const;

const EMAIL_RE = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/;

/** Alternative names accepted for each variable (the `EMAIL_*` convention used by the hosting setup). */
const ALIASES: Record<string, string[]> = {
  SMTP_HOST: ['EMAIL_HOST'],
  SMTP_PORT: ['EMAIL_PORT'],
  SMTP_USER: ['EMAIL_USER'],
  SMTP_PASS: ['EMAIL_PASS'],
  SMTP_SECURE: ['EMAIL_SECURE'],
  SMTP_REQUIRE_TLS: ['EMAIL_REQUIRE_TLS'],
  MAIL_FROM: ['EMAIL_FROM'],
  MAIL_FROM_NAME: ['EMAIL_FROM_NAME'],
  MAIL_TO: ['EMAIL_TO'],
  MAIL_TIMEZONE: ['EMAIL_TIMEZONE'],
};

function env(name: string): string | undefined {
  for (const key of [name, ...(ALIASES[name] ?? [])]) {
    const value = process.env[key];
    if (value !== undefined && value.trim() !== '') return value.trim();
  }
  return undefined;
}

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export type MailConfigResult =
  { ok: true; config: MailConfig; problems: [] } | { ok: false; config: null; problems: string[] };

/** Validates the mail environment. `problems` lists missing or malformed variables by name. */
export function loadMailConfig(): MailConfigResult {
  const problems: string[] = [];

  for (const name of REQUIRED) {
    if (!env(name)) problems.push(`${name} (or ${ALIASES[name].join('/')}) is not set`);
  }

  const port = Number(env('SMTP_PORT'));
  if (env('SMTP_PORT') && (!Number.isInteger(port) || port < 1 || port > 65535)) {
    problems.push('SMTP_PORT must be a port number');
  }

  const fromAddress = env('MAIL_FROM') ?? MAIL_DEFAULTS.MAIL_FROM;
  const to = env('MAIL_TO') ?? MAIL_DEFAULTS.MAIL_TO;
  if (!EMAIL_RE.test(fromAddress)) problems.push('MAIL_FROM is not a valid email address');
  if (!EMAIL_RE.test(to)) problems.push('MAIL_TO is not a valid email address');

  const timeZone = env('MAIL_TIMEZONE') ?? MAIL_DEFAULTS.MAIL_TIMEZONE;
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone });
  } catch {
    problems.push('MAIL_TIMEZONE is not a valid IANA time zone');
  }

  if (problems.length > 0) return { ok: false, config: null, problems };

  return {
    ok: true,
    problems: [],
    config: {
      smtp: {
        host: env('SMTP_HOST')!,
        port,
        secure: parseBool(env('SMTP_SECURE'), port === 465),
        requireTLS: parseBool(env('SMTP_REQUIRE_TLS'), false),
        user: env('SMTP_USER')!,
        pass: env('SMTP_PASS')!,
      },
      from: { name: env('MAIL_FROM_NAME') ?? MAIL_DEFAULTS.MAIL_FROM_NAME, address: fromAddress },
      to,
      timeZone,
    },
  };
}

export interface ServerConfig {
  port: number;
  /** Express `trust proxy` setting: number of proxy hops in front of the app (1 on Railway). */
  trustProxy: number | boolean;
  /** Directory with the built site, served with an SPA fallback. Empty string disables static serving. */
  staticDir: string;
  /** Origin allowed to call the API cross-site. Unset means same-origin only (no CORS headers). */
  corsOrigin: string | null;
  rateLimit: { windowMs: number; limit: number };
}

export function loadServerConfig(): ServerConfig {
  const trust = env('TRUST_PROXY');
  const trustProxy =
    trust === undefined ? 1 : /^\d+$/.test(trust) ? Number(trust) : parseBool(trust, true);
  return {
    port: Number(env('PORT') ?? 8787),
    trustProxy,
    staticDir: parseBool(env('SERVE_STATIC'), true) ? (env('STATIC_DIR') ?? 'dist') : '',
    corsOrigin: env('CORS_ORIGIN') ?? null,
    rateLimit: {
      windowMs: Number(env('FORM_RATE_LIMIT_WINDOW_MS') ?? 15 * 60 * 1000),
      limit: Number(env('FORM_RATE_LIMIT_MAX') ?? 5),
    },
  };
}
