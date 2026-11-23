/**
 * Cloudflare Turnstile: server-side check of the token the widget put in the form.
 *
 * The widget (src/components/forms/Turnstile.tsx) only proves the visitor passed a challenge
 * to the browser; a bot can post to the API directly, so every submission's token is sent to
 * Cloudflare's siteverify endpoint with the secret key, which never leaves this process.
 * Tokens are single-use and expire after 5 minutes; the widget is reset after each attempt.
 */
import { loadTurnstileConfig } from './config.ts';
import { describeError, log } from './log.ts';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TIMEOUT_MS = 10_000;

const config = loadTurnstileConfig();

export function isTurnstileConfigured(): boolean {
  return config.secretKey !== null;
}

/** Names of missing variables (never their values), for /api/health. */
export function getTurnstileProblems(): string[] {
  return config.secretKey ? [] : ['TURNSTILE_SECRET_KEY is not set'];
}

export type TurnstileResult =
  | { ok: true }
  /** `reason` is the first Cloudflare error code, or 'unavailable' when siteverify was unreachable. */
  | { ok: false; reason: string; unavailable: boolean };

interface SiteverifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/** Validates a widget token. `remoteIp` is the visitor's address, as seen through the proxy. */
export async function verifyTurnstile(token: string, remoteIp?: string): Promise<TurnstileResult> {
  if (!config.secretKey) return { ok: false, reason: 'not-configured', unavailable: true };

  const body = new URLSearchParams({ secret: config.secretKey, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  let data: SiteverifyResponse;
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      log.error('Turnstile siteverify returned an error status', { status: res.status });
      return { ok: false, reason: `http-${res.status}`, unavailable: true };
    }
    data = (await res.json()) as SiteverifyResponse;
  } catch (err) {
    log.error('Turnstile siteverify unreachable', describeError(err));
    return { ok: false, reason: 'unavailable', unavailable: true };
  }

  if (data.success) return { ok: true };
  const codes = data['error-codes'] ?? [];
  const reason = codes[0] ?? 'unknown';
  // Cloudflare could not read our request (bad secret, malformed call): an operator problem,
  // not a visitor failure, so it is logged at error level.
  const operatorFault = codes.some((c) =>
    ['invalid-input-secret', 'missing-input-secret', 'bad-request', 'internal-error'].includes(c)
  );
  if (operatorFault) log.error('Turnstile siteverify rejected our request', { codes });
  return { ok: false, reason, unavailable: operatorFault };
}
