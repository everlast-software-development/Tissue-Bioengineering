/** Notification content for the contact form (/contact). */
import type { ContactSubmission } from '../../forms.ts';
import type { NotificationTemplate } from '../types.ts';

/**
 * One label per submitted field. `satisfies` makes the build fail when the schema gains a field
 * this template does not label, so a new field cannot silently go missing from the email.
 */
const LABEL = {
  name: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
  message: 'Message',
} as const satisfies Record<Exclude<keyof ContactSubmission, 'website'>, string>;

export const contactEmail: NotificationTemplate<ContactSubmission> = (d) => ({
  summary:
    'A visitor sent a message through the contact form on the Tissue Bioengineering website.',
  sections: [
    {
      kind: 'fields',
      heading: 'Contact details',
      fields: [
        { label: LABEL.name, value: d.name },
        { label: LABEL.email, value: d.email, format: 'email' },
        { label: LABEL.phone, value: d.phone, format: 'phone' },
      ],
    },
    { kind: 'longText', label: LABEL.message, value: d.message },
  ],
});
