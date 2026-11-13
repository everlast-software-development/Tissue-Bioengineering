/**
 * Escaping and value formatting shared by the HTML and plain-text renderers.
 */
import type { EmailField } from './types.ts';

/** Escapes text for HTML element content and double- or single-quoted attribute values. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escapes multi-line visitor text and keeps its layout: line breaks become `<br>` (Outlook
 * ignores `white-space: pre-wrap`) and runs of spaces are kept with non-breaking spaces.
 */
export function escapeMultiline(value: string): string {
  return normalizeNewlines(value)
    .split('\n')
    .map((line) => escapeHtml(line).replace(/ {2}/g, ' &nbsp;'))
    .join('<br>');
}

export function normalizeNewlines(value: string): string {
  return value.replace(/\r\n?/g, '\n');
}

export const NOT_PROVIDED = '(not provided)';

/** A field value ready to display: `primary` always, `detail` as a quieter second part. */
export interface DisplayValue {
  primary: string;
  detail?: string;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** `2026-11-20` -> `Friday, 20 November 2026`, keeping the original as detail. */
function formatCalendarDate(value: string): DisplayValue {
  const match = ISO_DATE.exec(value);
  if (!match) return { primary: value };
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return { primary: value };
  }
  const primary = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', dateStyle: 'full' }).format(
    date
  );
  return { primary, detail: value };
}

export function displayValue(field: EmailField): DisplayValue {
  if (!field.value) return { primary: NOT_PROVIDED };
  return field.format === 'date' ? formatCalendarDate(field.value) : { primary: field.value };
}

/** Submission time for people (in the configured zone) plus the exact UTC timestamp. */
export function formatSubmittedAt(date: Date, timeZone: string): { local: string; iso: string } {
  const local = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
  return { local, iso: date.toISOString() };
}

/** Conservative address check before an address is put in a `mailto:` link. */
const LINKABLE_EMAIL = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function mailtoHref(address: string): string | null {
  return LINKABLE_EMAIL.test(address) ? `mailto:${address}` : null;
}

/** `tel:` link with only a leading + and digits, or null when there are too few digits. */
export function telHref(phone: string): string | null {
  const digits = phone.replace(/[^\d]/g, '');
  if (digits.length < 6) return null;
  return `tel:${phone.trim().startsWith('+') ? '+' : ''}${digits}`;
}
