/**
 * Notification email rendering: the entry point the API uses.
 *
 *   server/email/templates/*.ts   per-form content (which fields, grouped how, in what order)
 *   server/email/components.ts    shared HTML blocks (header, metadata, sections, reply, footer)
 *   server/email/layout.ts        shared document shell (head, responsive rules, card)
 *   server/email/plain-text.ts    text alternative from the same data as the HTML
 *
 * Visitor values are escaped where they enter the HTML (components.ts); the plain-text body
 * uses them raw. Sending is not done here: see mailer.ts.
 */
import { formatSubmittedAt } from './email/format.ts';
import { renderHtml } from './email/html.ts';
import { renderText } from './email/plain-text.ts';
import type { NotificationContent, NotificationView } from './email/types.ts';

export { escapeHtml } from './email/format.ts';
export type { NotificationContent, NotificationTemplate } from './email/types.ts';

export interface NotificationInput {
  /** e.g. "Contact Form" */
  formName: string;
  /** e.g. "Contact Form Submission" (the "New ..." title prefix is added here). */
  subject: string;
  reference: string;
  sourcePage: string;
  submittedAt: Date;
  timeZone: string;
  /** Output of the form's template (see FormDefinition.email). */
  content: NotificationContent;
  visitor: { name?: string; email?: string; phone?: string };
}

/** Strips characters that have no place in a single-line value (CR/LF and other C0 controls). */
export function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ');
}

function buildView(input: NotificationInput): NotificationView {
  const when = formatSubmittedAt(input.submittedAt, input.timeZone);
  const { name, email } = input.visitor;
  const from = name && email ? `${name} (${email})` : name || email || 'a website visitor';
  return {
    title: `New ${input.subject}`,
    summary: input.content.summary,
    preheader: `From ${from} via the ${input.formName.toLowerCase()}. Reference ${input.reference}.`,
    formName: input.formName,
    reference: input.reference,
    meta: [
      { label: 'Form', value: input.formName },
      { label: 'Reference', value: input.reference, mono: true },
      { label: 'Submitted', value: when.local, detail: when.iso },
      { label: 'Source page', value: input.sourcePage },
    ],
    sections: input.content.sections,
    replyTo: input.visitor,
  };
}

export function renderNotification(input: NotificationInput): { html: string; text: string } {
  const view = buildView(input);
  return { html: renderHtml(view), text: renderText(view) };
}
