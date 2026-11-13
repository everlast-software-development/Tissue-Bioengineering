/** Fixed wording shared by the HTML and plain-text bodies. Returns raw (unescaped) text. */
import type { NotificationView } from './types.ts';

export const BRAND = 'Tissue Bioengineering';
export const HEADER_LABEL = 'Website form notification';

export function disclaimer(formName: string): string {
  return `This is an automated notification from the ${formName.toLowerCase()} on the ${BRAND} website. It may contain personal or medical information; please handle it confidentially.`;
}

export function replyLead(replyTo: NotificationView['replyTo']): string {
  return replyTo.email
    ? `Reply to this email to respond to ${replyTo.name || 'the visitor'} directly.`
    : 'This submission did not include an email address.';
}

/** Second line of the reply note when there is no email address to reply to. */
export function noEmailFallback(phone: string | undefined): string {
  return phone
    ? `Contact the visitor by phone instead: ${phone}.`
    : 'Replying to this email will not reach the visitor.';
}
