/**
 * Notification email rendering. Every user-supplied value goes through `escapeHtml` before it
 * reaches the HTML body; the plain-text alternative is built from the raw values.
 */

export interface NotificationField {
  label: string;
  value: string;
  /** Rendered with line breaks preserved (textarea content). */
  multiline?: boolean;
}

export interface NotificationInput {
  /** e.g. "Contact Form" */
  formName: string;
  /** e.g. "Contact Form Submission" (the "New ..." subject prefix is added by the sender). */
  subject: string;
  reference: string;
  sourcePage: string;
  submittedAt: Date;
  timeZone: string;
  fields: NotificationField[];
  visitor: { name?: string; email?: string; phone?: string };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Strips characters that have no place in a single-line value (CR/LF and other C0 controls). */
export function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ');
}

function formatSubmittedAt(date: Date, timeZone: string): { local: string; iso: string } {
  const local = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date);
  return { local, iso: date.toISOString() };
}

const FONT = "font-family: 'IBM Plex Sans', 'Segoe UI', Helvetica, Arial, sans-serif;";

function htmlRow(label: string, value: string, multiline = false): string {
  const cell = multiline
    ? `<div style="white-space:pre-wrap;word-break:break-word;">${escapeHtml(value)}</div>`
    : escapeHtml(value);
  return `
      <tr>
        <th align="left" valign="top" style="${FONT}padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;font-weight:600;color:#475569;width:180px;">${escapeHtml(label)}</th>
        <td valign="top" style="${FONT}padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">${cell || '<span style="color:#94a3b8;">(not provided)</span>'}</td>
      </tr>`;
}

export function renderNotification(input: NotificationInput): { html: string; text: string } {
  const when = formatSubmittedAt(input.submittedAt, input.timeZone);
  const title = `New ${input.subject}`;

  const metaRows = [
    htmlRow('Form', input.formName),
    htmlRow('Source page', input.sourcePage),
    htmlRow('Submitted', `${when.local} (${when.iso})`),
    htmlRow('Reference', input.reference),
  ].join('');

  const fieldRows = input.fields.map((f) => htmlRow(f.label, f.value, f.multiline)).join('');

  const replyNote = input.visitor.email
    ? `Reply to this email to answer ${escapeHtml(input.visitor.name || 'the visitor')} directly (${escapeHtml(input.visitor.email)}).`
    : 'This submission did not include an email address.';

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:24px;background:#f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="${FONT}background:#05142d;color:#ffffff;padding:20px 24px;">
        <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9fd9ff;">Tissue Bioengineering</div>
        <div style="font-size:20px;font-weight:600;margin-top:4px;">${escapeHtml(title)}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 12px 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${metaRows}</table>
      </td>
    </tr>
    <tr>
      <td style="${FONT}padding:20px 24px 6px;font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#64748b;">Submitted details</td>
    </tr>
    <tr>
      <td style="padding:0 12px 8px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${fieldRows}</table>
      </td>
    </tr>
    <tr>
      <td style="${FONT}padding:16px 24px 24px;font-size:13px;line-height:1.5;color:#475569;">${replyNote}</td>
    </tr>
  </table>
</body>
</html>`;

  const textLines: string[] = [
    title,
    '='.repeat(title.length),
    '',
    `Form:         ${input.formName}`,
    `Source page:  ${input.sourcePage}`,
    `Submitted:    ${when.local} (${when.iso})`,
    `Reference:    ${input.reference}`,
    '',
    'Submitted details',
    '-----------------',
  ];
  for (const f of input.fields) {
    if (f.multiline) {
      textLines.push(`${f.label}:`, f.value ? f.value : '(not provided)', '');
    } else {
      textLines.push(`${f.label}: ${f.value || '(not provided)'}`);
    }
  }
  textLines.push(
    '',
    input.visitor.email
      ? `Reply to this email to answer ${input.visitor.name || 'the visitor'} directly (${input.visitor.email}).`
      : 'This submission did not include an email address.'
  );

  return { html, text: textLines.join('\n') };
}
