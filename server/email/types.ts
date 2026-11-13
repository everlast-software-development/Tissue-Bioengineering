/**
 * Data model shared by every notification email.
 *
 *   form template (per form)  ->  NotificationContent   what the visitor submitted, grouped
 *   renderNotification        ->  NotificationView      content + submission metadata
 *   html.ts / plain-text.ts   ->  HTML and text bodies  rendered from the same view
 */

/** How a single-line value is presented. Defaults to plain text. */
export type FieldFormat = 'text' | 'email' | 'phone' | 'date';

export interface EmailField {
  label: string;
  value: string;
  format?: FieldFormat;
}

export type EmailSection =
  /** Short values shown as label/value rows. */
  | { kind: 'fields'; heading: string; fields: EmailField[] }
  /** One free-text answer (textarea) shown as a readable block; the label is the heading. */
  | { kind: 'longText'; label: string; value: string };

/** The form-specific part of a notification. */
export interface NotificationContent {
  /** One sentence under the title explaining what was received. */
  summary: string;
  sections: EmailSection[];
}

/** Turns a validated submission into email content. One per website form. */
export type NotificationTemplate<T> = (data: T) => NotificationContent;

export interface MetaItem {
  label: string;
  value: string;
  /** Secondary line under the value. */
  detail?: string;
  mono?: boolean;
}

/** Everything both renderers need, already resolved. Values are raw (unescaped) text. */
export interface NotificationView {
  title: string;
  summary: string;
  /** Inbox preview text. */
  preheader: string;
  formName: string;
  reference: string;
  meta: MetaItem[];
  sections: EmailSection[];
  /** The visitor replies reach (the message's Reply-To). */
  replyTo: { name?: string; email?: string; phone?: string };
}
