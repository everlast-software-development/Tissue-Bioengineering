/**
 * Minimal structured logger. One JSON line per event so Railway's log viewer can filter.
 * Never pass credentials in `meta`; callers log the SMTP host and port only.
 */
type Level = 'info' | 'warn' | 'error';

function write(level: Level, message: string, meta?: Record<string, unknown>): void {
  const line = JSON.stringify({ time: new Date().toISOString(), level, message, ...meta });
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const log = {
  info: (message: string, meta?: Record<string, unknown>) => write('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => write('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => write('error', message, meta),
};

/** Error details safe to log: message and code, never the full object (it can hold auth state). */
export function describeError(err: unknown): { error: string; code?: string } {
  if (err instanceof Error) {
    const code = (err as Error & { code?: unknown }).code;
    return { error: err.message, ...(typeof code === 'string' ? { code } : {}) };
  }
  return { error: String(err) };
}
