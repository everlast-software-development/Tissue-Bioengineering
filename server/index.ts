/**
 * Tissue Bioengineering API + static site server.
 *
 *   POST /api/v1/contact         Contact form        -> email to MAIL_TO
 *   POST /api/v1/consultations   Consultation form   -> email to MAIL_TO
 *   GET  /api/health             Process + SMTP status (no secrets)
 *   *                            Built site from ./dist with SPA fallback
 *
 * Run from the project root: `npm run dev:server` (TypeScript directly, Node >= 22.18) or
 * `npm run build && npm start` (compiled to server/dist).
 */
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { loadServerConfig } from './config.ts';
import { renderNotification, stripControlChars } from './email.ts';
import { consultationForm, contactForm, FORMS, type FormDefinition } from './forms.ts';
import { describeError, log } from './log.ts';
import {
  getMailConfig,
  getMailStatus,
  isMailConfigured,
  MailSendError,
  sendNotification,
  verifyTransport,
} from './mailer.ts';

const config = loadServerConfig();
const app = express();

app.set('trust proxy', config.trustProxy);
app.disable('x-powered-by');

/** Visitor-facing copy for failures. Internal details stay in the server log. */
const MESSAGES = {
  invalid: 'Please check the highlighted fields and try again.',
  badJson: 'The request could not be read. Please refresh the page and try again.',
  tooLarge: 'The submission is too large. Please shorten your message and try again.',
  rateLimited:
    'Too many submissions from this connection. Please wait a few minutes and try again.',
  unavailable:
    'Our contact service is temporarily unavailable. Please email info@tissuebioengineering.com directly.',
  sendFailed:
    'We could not send your message right now. Please try again in a few minutes or email info@tissuebioengineering.com directly.',
  serverError: 'Something went wrong on our side. Please try again later.',
  notFound: 'Not found.',
} as const;

// ---------------------------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------------------------

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

if (config.corsOrigin) {
  const origin = config.corsOrigin;
  app.use('/api', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Max-Age', '600');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });
}

app.use('/api', express.json({ limit: '64kb', type: ['application/json'] }));

const formLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  limit: config.rateLimit.limit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    log.warn('Form rate limit hit', { ip: req.ip, path: req.path });
    res.status(429).json({ success: false, message: MESSAGES.rateLimited });
  },
});

// ---------------------------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------------------------

app.get('/api/health', async (req, res) => {
  const current = getMailStatus();
  const stale =
    !current.lastCheckedAt || Date.now() - Date.parse(current.lastCheckedAt) > 5 * 60 * 1000;
  const mail = stale || req.query.recheck === '1' ? await verifyTransport() : current;
  const mailConfig = getMailConfig();
  res.status(200).json({
    status: mail.verified ? 'ok' : 'degraded',
    uptimeSeconds: Math.round(process.uptime()),
    mail: {
      configured: mail.configured,
      problems: mail.problems,
      smtpVerified: mail.verified,
      lastCheckedAt: mail.lastCheckedAt,
      lastError: mail.lastError,
      from: mailConfig ? `${mailConfig.from.name} <${mailConfig.from.address}>` : null,
      to: mailConfig?.to ?? null,
    },
    forms: FORMS.map((f) => ({ id: f.id, endpoint: f.endpoint })),
  });
});

function newReference(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;
}

/** Path of the page the browser submitted from, taken from the Referer when present. */
function sourcePage(req: Request, fallback: string): string {
  const referer = req.get('referer');
  if (!referer) return fallback;
  try {
    const url = new URL(referer);
    return stripControlChars(url.pathname + url.search).slice(0, 200);
  } catch {
    return fallback;
  }
}

function registerForm<T extends { website?: string }>(form: FormDefinition<T>): void {
  app.post(form.endpoint, formLimiter, async (req: Request, res: Response) => {
    const parsed = form.schema.safeParse(req.body);
    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.length ? issue.path.map(String).join('.') : '_form';
        (errors[key] ??= []).push(issue.message);
      }
      log.info('Form rejected by validation', {
        form: form.id,
        ip: req.ip,
        fields: Object.keys(errors),
      });
      res.status(400).json({ success: false, message: MESSAGES.invalid, errors });
      return;
    }

    const data = parsed.data;
    const reference = newReference(form.referencePrefix);

    if (data.website) {
      // Honeypot filled: almost certainly a bot. Pretend to succeed so it learns nothing.
      log.warn('Form honeypot triggered; submission discarded', {
        form: form.id,
        ip: req.ip,
        reference,
      });
      res.json({ success: true, data: { id: reference }, message: form.successMessage });
      return;
    }

    if (!isMailConfigured()) {
      log.error('Form submission dropped: SMTP not configured', {
        form: form.id,
        reference,
        problems: getMailStatus().problems,
      });
      res.status(503).json({ success: false, message: MESSAGES.unavailable });
      return;
    }

    const mailConfig = getMailConfig()!;
    const visitor = form.visitor(data);
    const notification = renderNotification({
      formName: form.name,
      subject: form.subject.replace(/^New /, ''),
      reference,
      sourcePage: sourcePage(req, form.page),
      submittedAt: new Date(),
      timeZone: mailConfig.timeZone,
      content: form.email(data),
      visitor,
    });

    try {
      const { messageId } = await sendNotification({
        subject: form.subject,
        html: notification.html,
        text: notification.text,
        attachments: notification.attachments,
        replyTo: visitor.email
          ? {
              name: visitor.name ? stripControlChars(visitor.name) : undefined,
              address: visitor.email,
            }
          : undefined,
      });
      log.info('Form notification sent', { form: form.id, reference, messageId });
      res.json({ success: true, data: { id: reference }, message: form.successMessage });
    } catch (err) {
      const details = describeError(err);
      log.error('Form notification failed', { form: form.id, reference, ...details });
      const status = err instanceof MailSendError && err.code === 'MAIL_NOT_CONFIGURED' ? 503 : 502;
      res.status(status).json({
        success: false,
        message: status === 503 ? MESSAGES.unavailable : MESSAGES.sendFailed,
      });
    }
  });
}

registerForm(contactForm);
registerForm(consultationForm);

app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, message: MESSAGES.notFound });
});

// ---------------------------------------------------------------------------------------------
// Static site (production): built files + SPA fallback for client-side routes
// ---------------------------------------------------------------------------------------------

const staticDir = config.staticDir ? path.resolve(process.cwd(), config.staticDir) : '';
const indexHtml = staticDir ? path.join(staticDir, 'index.html') : '';

if (staticDir && existsSync(indexHtml)) {
  // Vite output under /assets is content-hashed, so it can be cached forever.
  app.use(
    '/assets',
    express.static(path.join(staticDir, 'assets'), { immutable: true, maxAge: '1y', index: false })
  );
  app.use(express.static(staticDir, { index: false, maxAge: '1h' }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }
    res.sendFile(indexHtml, { headers: { 'Cache-Control': 'no-cache' } }, (err) => {
      if (err) next(err);
    });
  });
  log.info('Serving static site', { dir: staticDir });
} else if (staticDir) {
  log.warn('Static directory has no index.html; serving API only', { dir: staticDir });
}

// ---------------------------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------------------------

// Express only treats a 4-argument function as an error handler, so `_next` must stay.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const e = err as { type?: string; status?: number; statusCode?: number };
  const status = e.status ?? e.statusCode ?? 500;
  if (e.type === 'entity.parse.failed') {
    res.status(400).json({ success: false, message: MESSAGES.badJson });
    return;
  }
  if (e.type === 'entity.too.large') {
    res.status(413).json({ success: false, message: MESSAGES.tooLarge });
    return;
  }
  if (status >= 500)
    log.error('Unhandled request error', { path: req.path, ...describeError(err) });
  if (req.path.startsWith('/api')) {
    res
      .status(status)
      .json({ success: false, message: status >= 500 ? MESSAGES.serverError : MESSAGES.notFound });
  } else {
    res
      .status(status)
      .type('text/plain')
      .send(status >= 500 ? MESSAGES.serverError : MESSAGES.notFound);
  }
});

// ---------------------------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------------------------

const server = app.listen(config.port, () => {
  log.info('Server listening', { port: config.port, trustProxy: config.trustProxy });
  void verifyTransport();
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    log.info('Shutting down', { signal });
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5_000).unref();
  });
}
