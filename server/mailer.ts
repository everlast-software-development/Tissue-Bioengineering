/**
 * One Nodemailer SMTP transporter for the whole process. Created lazily from the environment,
 * verified at startup and on demand for /api/health.
 */
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { loadMailConfig, type MailConfig } from './config.ts';
import { describeError, log } from './log.ts';

export interface MailStatus {
  /** All required SMTP/MAIL variables are present and well-formed. */
  configured: boolean;
  /** Names of missing or malformed variables (never their values). */
  problems: string[];
  /** Result of the last `transporter.verify()`: null until it has run. */
  verified: boolean | null;
  lastCheckedAt: string | null;
  /** Short failure reason for operators (error code only, no credentials). */
  lastError: string | null;
}

export class MailSendError extends Error {
  readonly code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'MailSendError';
    this.code = code;
  }
}

const loaded = loadMailConfig();
let transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

const status: MailStatus = {
  configured: loaded.ok,
  problems: loaded.problems,
  verified: null,
  lastCheckedAt: null,
  lastError: null,
};

export function getMailConfig(): MailConfig | null {
  return loaded.ok ? loaded.config : null;
}

export function getMailStatus(): MailStatus {
  return { ...status, problems: [...status.problems] };
}

export function isMailConfigured(): boolean {
  return loaded.ok;
}

function getTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
  if (!loaded.ok)
    throw new MailSendError('Mail transport is not configured', 'MAIL_NOT_CONFIGURED');
  if (transporter) return transporter;
  const { smtp } = loaded.config;
  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    requireTLS: smtp.requireTLS,
    auth: { user: smtp.user, pass: smtp.pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
  });
  return transporter;
}

/**
 * Opens a connection, authenticates and closes it again. Records the outcome in the status
 * object. Never throws, so a bad SMTP setup degrades the API instead of crashing it.
 */
export async function verifyTransport(): Promise<MailStatus> {
  status.lastCheckedAt = new Date().toISOString();
  if (!loaded.ok) {
    status.verified = false;
    status.lastError = 'MAIL_NOT_CONFIGURED';
    log.warn('SMTP not configured', { problems: loaded.problems });
    return getMailStatus();
  }
  const { smtp } = loaded.config;
  try {
    await getTransporter().verify();
    status.verified = true;
    status.lastError = null;
    log.info('SMTP connection verified', { host: smtp.host, port: smtp.port, secure: smtp.secure });
  } catch (err) {
    const details = describeError(err);
    status.verified = false;
    status.lastError = details.code ?? 'SMTP_VERIFY_FAILED';
    log.error('SMTP verification failed', { host: smtp.host, port: smtp.port, ...details });
  }
  return getMailStatus();
}

export interface OutgoingNotification {
  subject: string;
  html: string;
  text: string;
  replyTo?: { name?: string; address: string };
}

/**
 * Sends one notification to MAIL_TO. Resolves only when the SMTP server has accepted the
 * message for the recipient; any other outcome is thrown as a MailSendError.
 */
export async function sendNotification(mail: OutgoingNotification): Promise<{ messageId: string }> {
  const config = getMailConfig();
  if (!config) throw new MailSendError('Mail transport is not configured', 'MAIL_NOT_CONFIGURED');

  let info: SMTPTransport.SentMessageInfo;
  try {
    info = await getTransporter().sendMail({
      from: { name: config.from.name, address: config.from.address },
      to: config.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
  } catch (err) {
    const details = describeError(err);
    throw new MailSendError(details.error, details.code ?? 'SMTP_SEND_FAILED');
  }

  const accepted = (info.accepted ?? []).map(String);
  const rejected = (info.rejected ?? []).map(String);
  if (rejected.length > 0 || !accepted.some((a) => a.toLowerCase() === config.to.toLowerCase())) {
    throw new MailSendError(
      `SMTP server did not accept the recipient (accepted: ${accepted.join(', ') || 'none'}; rejected: ${rejected.join(', ') || 'none'})`,
      'SMTP_RECIPIENT_REJECTED'
    );
  }
  status.verified = true;
  status.lastError = null;
  return { messageId: info.messageId };
}
