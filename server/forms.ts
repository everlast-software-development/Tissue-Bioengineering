/**
 * Every website form, with its server-side schema, endpoint, subject and email layout.
 * The field order here is the order in the notification email.
 */
import { z } from 'zod';
import { SERVICE_CATEGORIES } from '../src/lib/site.ts';
import type { NotificationField } from './email.ts';

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

export const contactSchema = z
  .object({
    name: singleLine('Full name', 2, 200),
    phone,
    email,
    message: multiLine('Message', 10, 5000),
    website: honeypot,
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
  })
  .strict();

export type ContactSubmission = z.infer<typeof contactSchema>;
export type ConsultationSubmission = z.infer<typeof consultationSchema>;

export interface FormDefinition<T extends { website?: string }> {
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
  fields: (data: T) => NotificationField[];
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
  fields: (d) => [
    { label: 'Full name', value: d.name },
    { label: 'Email address', value: d.email },
    { label: 'Phone number', value: d.phone },
    { label: 'Message', value: d.message, multiline: true },
  ],
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
  fields: (d) => [
    { label: 'Full name', value: d.fullName },
    { label: 'Email address', value: d.email },
    { label: 'Phone number', value: d.phone },
    { label: 'Patient age', value: String(d.age) },
    { label: 'Therapy area', value: d.serviceCategory },
    { label: 'Medical history summary', value: d.medicalHistory, multiline: true },
    { label: 'Preferred date', value: d.preferredDate },
    { label: 'Preferred time slot', value: d.preferredTime },
    { label: 'Consent to data processing', value: d.consent ? 'Yes' : 'No' },
  ],
  visitor: (d) => ({ name: d.fullName, email: d.email, phone: d.phone }),
};

/** All forms the API accepts. Add new website forms here. */
export const FORMS = [contactForm, consultationForm] as const;
