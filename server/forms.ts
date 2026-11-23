/**
 * Every website form, with its server-side schema, endpoint, subject and email template.
 * The notification's content and field order live in the form's template (below).
 */
import { z } from 'zod';
import { SERVICE_CATEGORIES } from '../src/lib/site.ts';
import type { NotificationTemplate } from './email.ts';

const NO_LINE_BREAKS = /^[^\r\n]*$/;
const singleLine = (label: string, min: number, max: number) =>
  z
    .string({ required_error: `${label} is required`, invalid_type_error: `${label} must be text` })
    .trim()
    .min(min, min <= 1 ? `${label} is required` : `${label} must be at least ${min} characters`)
    .max(max, `${label} must be at most ${max} characters`)
    .regex(NO_LINE_BREAKS, `${label} must be a single line`);

const multiLine = (label: string, min: number, max: number) =>
  z
    .string({ required_error: `${label} is required`, invalid_type_error: `${label} must be text` })
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} must be at most ${max} characters`);

const email = singleLine('Email address', 1, 254).email('Please enter a valid email address');

/** Digits with the punctuation phone numbers are usually typed with. */
const phone = singleLine('Phone number', 1, 40).regex(
  /^\+?[0-9][0-9\s().-]{5,}$/,
  'Please enter a valid phone number'
);

/** Hidden anti-spam field: humans never see it, so a value means a bot filled the form. */
const honeypot = z.string().max(1000).optional();

/** Cloudflare Turnstile token from the widget; checked against siteverify in server/index.ts. */
const turnstileToken = z
  .string({
    required_error: 'Please complete the security check',
    invalid_type_error: 'Please complete the security check',
  })
  .min(1, 'Please complete the security check')
  .max(2048, 'The security check expired. Please try again.');

export const contactSchema = z
  .object({
    name: singleLine('Full name', 2, 200),
    phone,
    email,
    message: multiLine('Message', 10, 5000),
    website: honeypot,
    turnstileToken,
  })
  .strict();

export const consultationSchema = z
  .object({
    fullName: singleLine('Full name', 2, 200),
    email,
    phone: phone.pipe(z.string().min(10, 'Please enter a valid phone number')),
    age: z.coerce
      .number({ invalid_type_error: 'Age must be a number' })
      .int('Age must be a whole number')
      .min(1, 'Age is required')
      .max(120, 'Invalid age'),
    serviceCategory: z.enum(SERVICE_CATEGORIES, {
      errorMap: () => ({ message: 'Please choose a therapy area' }),
    }),
    medicalHistory: multiLine('Medical history summary', 10, 10000),
    preferredDate: singleLine('Preferred date', 1, 40).regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Preferred date must be a calendar date'
    ),
    preferredTime: singleLine('Preferred time slot', 1, 40),
    consent: z.literal(true, {
      errorMap: () => ({ message: 'You must consent to data processing for medical consultation' }),
    }),
    website: honeypot,
    turnstileToken,
  })
  .strict();

export type ContactSubmission = z.infer<typeof contactSchema>;
export type ConsultationSubmission = z.infer<typeof consultationSchema>;

/* ── Email templates: which fields the notification shows, grouped how, in what order ──────
   Each LABEL map has one label per submitted field. `satisfies` makes the build fail when the
   schema gains a field its template does not label, so a new field cannot silently go missing
   from the email. */

/** Contact form (/contact). */
const CONTACT_LABEL = {
  name: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
  message: 'Message',
} as const satisfies Record<Exclude<keyof ContactSubmission, 'website' | 'turnstileToken'>, string>;

const contactEmail: NotificationTemplate<ContactSubmission> = (d) => ({
  summary:
    'A visitor sent a message through the contact form on the Tissue Bioengineering website.',
  sections: [
    {
      kind: 'fields',
      heading: 'Contact details',
      fields: [
        { label: CONTACT_LABEL.name, value: d.name },
        { label: CONTACT_LABEL.email, value: d.email, format: 'email' },
        { label: CONTACT_LABEL.phone, value: d.phone, format: 'phone' },
      ],
    },
    { kind: 'longText', label: CONTACT_LABEL.message, value: d.message },
  ],
});

/** Consultation request form (/consultation). */
const CONSULTATION_LABEL = {
  fullName: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
  age: 'Patient age',
  serviceCategory: 'Therapy area',
  medicalHistory: 'Medical history summary',
  preferredDate: 'Preferred date',
  preferredTime: 'Preferred time slot',
  consent: 'Consent to data processing',
} as const satisfies Record<Exclude<keyof ConsultationSubmission, 'website' | 'turnstileToken'>, string>;

const consultationEmail: NotificationTemplate<ConsultationSubmission> = (d) => ({
  summary:
    'A patient requested a consultation through the Tissue Bioengineering website. Their details and preferred appointment are below.',
  sections: [
    {
      kind: 'fields',
      heading: 'Patient',
      fields: [
        { label: CONSULTATION_LABEL.fullName, value: d.fullName },
        { label: CONSULTATION_LABEL.email, value: d.email, format: 'email' },
        { label: CONSULTATION_LABEL.phone, value: d.phone, format: 'phone' },
        { label: CONSULTATION_LABEL.age, value: String(d.age) },
      ],
    },
    {
      kind: 'fields',
      heading: 'Requested consultation',
      fields: [
        { label: CONSULTATION_LABEL.serviceCategory, value: d.serviceCategory },
        { label: CONSULTATION_LABEL.preferredDate, value: d.preferredDate, format: 'date' },
        { label: CONSULTATION_LABEL.preferredTime, value: d.preferredTime },
      ],
    },
    { kind: 'longText', label: CONSULTATION_LABEL.medicalHistory, value: d.medicalHistory },
    {
      kind: 'fields',
      heading: 'Consent',
      fields: [{ label: CONSULTATION_LABEL.consent, value: d.consent ? 'Yes' : 'No' }],
    },
  ],
});

/** Fields every form carries for spam protection; they are never part of the email. */
export interface ProtectedFields {
  website?: string;
  turnstileToken: string;
}

export interface FormDefinition<T extends ProtectedFields> {
  id: string;
  /** Prefix of the submission reference shown to the visitor and in the email. */
  referencePrefix: string;
  endpoint: string;
  /** Name shown in the notification's "Form" row. */
  name: string;
  /** Email subject (full). */
  subject: string;
  /** Route of the page that hosts the form; used when the request carries no Referer. */
  page: string;
  /** Message the visitor sees after the SMTP server accepted the email. */
  successMessage: string;
  schema: z.ZodType<T, z.ZodTypeDef, unknown>;
  /** Builds the notification email's content from a validated submission. */
  email: NotificationTemplate<T>;
  visitor: (data: T) => { name?: string; email?: string; phone?: string };
}

export const contactForm: FormDefinition<ContactSubmission> = {
  id: 'contact',
  referencePrefix: 'MSG',
  endpoint: '/api/v1/contact',
  name: 'Contact Form',
  subject: 'New Contact Form Submission',
  page: '/contact',
  successMessage: 'Message sent successfully. Thank you for reaching out to Tissue Bioengineering.',
  schema: contactSchema,
  email: contactEmail,
  visitor: (d) => ({ name: d.name, email: d.email, phone: d.phone }),
};

export const consultationForm: FormDefinition<ConsultationSubmission> = {
  id: 'consultation',
  referencePrefix: 'CONS',
  endpoint: '/api/v1/consultations',
  name: 'Consultation Request Form',
  subject: 'New Consultation Request',
  page: '/consultation',
  successMessage:
    'Consultation request submitted successfully. Our clinical team will reach out within 24 hours.',
  schema: consultationSchema,
  email: consultationEmail,
  visitor: (d) => ({ name: d.fullName, email: d.email, phone: d.phone }),
};

/** All forms the API accepts. Add new website forms here. */
export const FORMS = [contactForm, consultationForm] as const;
