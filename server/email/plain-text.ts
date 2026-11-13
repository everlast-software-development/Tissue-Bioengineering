/**
 * Plain-text alternative, built from the same view as the HTML so the two always carry the
 * same information in the same order. Values are raw: plain text needs no escaping.
 */
import { BRAND, disclaimer, HEADER_LABEL, noEmailFallback, replyLead } from './copy.ts';
import { displayValue, NOT_PROVIDED, normalizeNewlines } from './format.ts';
import type { EmailField, MetaItem, NotificationView } from './types.ts';

const RULE = '-'.repeat(60);

/** Section heading, underlined. Case is kept so field labels read exactly as in the HTML. */
function heading(text: string): string[] {
  return ['', text, '-'.repeat(text.length)];
}

/** Label/value lines with the values aligned in one column. */
function aligned(rows: { label: string; value: string }[]): string[] {
  const width = Math.max(...rows.map((r) => r.label.length)) + 2;
  return rows.map((r) => `${`${r.label}:`.padEnd(width)}${r.value}`);
}

function metaValue(item: MetaItem): string {
  return item.detail ? `${item.value} (${item.detail})` : item.value;
}

function fieldValue(field: EmailField): string {
  const shown = displayValue(field);
  return shown.detail ? `${shown.primary} (${shown.detail})` : shown.primary;
}

export function renderText(view: NotificationView): string {
  const lines: string[] = [
    `${BRAND.toUpperCase()}  |  ${HEADER_LABEL}`,
    RULE,
    '',
    view.title,
    '='.repeat(view.title.length),
    view.summary,
    ...heading('Submission'),
    ...aligned(view.meta.map((m) => ({ label: m.label, value: metaValue(m) }))),
  ];

  for (const s of view.sections) {
    if (s.kind === 'fields') {
      lines.push(
        ...heading(s.heading),
        ...aligned(s.fields.map((f) => ({ label: f.label, value: fieldValue(f) })))
      );
    } else {
      lines.push(...heading(s.label), s.value ? normalizeNewlines(s.value) : NOT_PROVIDED);
    }
  }

  const { email, phone } = view.replyTo;
  lines.push(
    ...heading('Reply'),
    replyLead(view.replyTo),
    email ? `Your reply goes to ${email}.` : noEmailFallback(phone),
    '',
    RULE,
    BRAND,
    disclaimer(view.formName),
    `Reference ${view.reference}`
  );

  return lines.join('\n');
}
