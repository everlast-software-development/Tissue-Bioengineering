/** Notification content for the consultation request form (/consultation). */
import type { ConsultationSubmission } from '../../forms.ts';
import type { NotificationTemplate } from '../types.ts';

/**
 * One label per submitted field. `satisfies` makes the build fail when the schema gains a field
 * this template does not label, so a new field cannot silently go missing from the email.
 */
const LABEL = {
  fullName: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
  age: 'Patient age',
  serviceCategory: 'Therapy area',
  medicalHistory: 'Medical history summary',
  preferredDate: 'Preferred date',
  preferredTime: 'Preferred time slot',
  consent: 'Consent to data processing',
} as const satisfies Record<Exclude<keyof ConsultationSubmission, 'website'>, string>;

export const consultationEmail: NotificationTemplate<ConsultationSubmission> = (d) => ({
  summary:
    'A patient requested a consultation through the Tissue Bioengineering website. Their details and preferred appointment are below.',
  sections: [
    {
      kind: 'fields',
      heading: 'Patient',
      fields: [
        { label: LABEL.fullName, value: d.fullName },
        { label: LABEL.email, value: d.email, format: 'email' },
        { label: LABEL.phone, value: d.phone, format: 'phone' },
        { label: LABEL.age, value: String(d.age) },
      ],
    },
    {
      kind: 'fields',
      heading: 'Requested consultation',
      fields: [
        { label: LABEL.serviceCategory, value: d.serviceCategory },
        { label: LABEL.preferredDate, value: d.preferredDate, format: 'date' },
        { label: LABEL.preferredTime, value: d.preferredTime },
      ],
    },
    { kind: 'longText', label: LABEL.medicalHistory, value: d.medicalHistory },
    {
      kind: 'fields',
      heading: 'Consent',
      fields: [{ label: LABEL.consent, value: d.consent ? 'Yes' : 'No' }],
    },
  ],
});
