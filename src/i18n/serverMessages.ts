import type { Messages } from './messages/en';

/**
 * The API (server/) answers in English, and the backend is shared by every language. These
 * map its visitor-facing messages to the current locale using `forms.serverMessages`; a
 * message with no translation falls back to the locale's generic text (English shows every
 * message exactly as sent).
 */
export function localizeServerMessage(message: string, forms: Messages['forms']): string {
  if (Object.hasOwn(forms.serverMessages, message)) return forms.serverMessages[message];
  return forms.serverFallback ?? message;
}

/** Same as localizeServerMessage, for a server-side field validation message. */
export function localizeServerFieldError(message: string, forms: Messages['forms']): string {
  if (Object.hasOwn(forms.serverMessages, message)) return forms.serverMessages[message];
  return forms.serverFieldFallback ?? message;
}
