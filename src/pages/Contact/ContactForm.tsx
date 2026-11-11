import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
import { ContactFormValues } from '@/types';
import { submitContact } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { FormField } from '@/components/common/FormField';

/** Egypt's country calling code; fixed, never typed by the user. */
const COUNTRY_CODE = '+20';

/**
 * Reduces what was typed to the Egyptian national number: digits only, without the
 * country code (+20 / 0020 / 20, if pasted) or the domestic trunk 0.
 */
function toEgyptNationalNumber(raw: string): string {
  let n = raw.replace(/[^\d+]/g, '');
  if (n.startsWith('+20')) n = n.slice(3);
  else if (n.startsWith('0020')) n = n.slice(4);
  else if (/^20\d{9,10}$/.test(n)) n = n.slice(2);
  n = n.replace(/\D/g, '');
  return n.startsWith('0') ? n.slice(1) : n;
}

/** Mobile (10/11/12/15 + 8 digits) or landline (area code + number: 8 digits for Alexandria, else 9). */
const isEgyptNationalNumber = (n: string) => /^(1[0125]\d{8}|[2-9]\d{7,8})$/.test(n);

/** The submitted form: E.164, e.g. +201012345678. */
const toEgyptE164 = (raw: string) => `${COUNTRY_CODE}${toEgyptNationalNumber(raw)}`;

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter your full name')
    .min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .trim()
    .min(1, 'Please enter your phone number')
    .refine(
      (v) => isEgyptNationalNumber(toEgyptNationalNumber(v)),
      'Please enter a valid Egyptian phone number, e.g. 10 1234 5678'
    ),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address'),
  message: z
    .string()
    .trim()
    .min(1, 'Please enter a message')
    .min(10, 'Message must be at least 10 characters long'),
});

export const ContactForm: React.FC = () => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    await submitContact({
      name: data.name,
      phone: toEgyptE164(data.phone),
      email: data.email,
      message: data.message,
    });
    setSuccess(true);
    reset();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-cf-line-strong bg-cf-panel p-5 sm:p-8 lg:p-10"
    >
      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-4 text-sm font-medium text-emerald-200"
        >
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
          <span>Thank you for contacting us! Our team will get back to you within 24 hours.</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Full name *" htmlFor="contact-name" error={errors.name}>
          {(c) => (
            <input
              {...register('name')}
              {...c}
              type="text"
              required
              autoComplete="name"
              placeholder="Dr. Sarah Connor"
              className="cf-input"
            />
          )}
        </FormField>

        <FormField label="Phone number *" htmlFor="contact-phone" error={errors.phone}>
          {(c) => (
            <div className="relative">
              {/* Fixed country code: shown inside the field, not editable. */}
              <span
                id="contact-phone-code"
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[15px] font-medium text-cf-text"
              >
                <span className="sr-only">Egypt country code </span>
                {COUNTRY_CODE}
                <span className="ml-3 h-5 w-px bg-cf-line-strong" aria-hidden="true" />
              </span>
              <input
                {...register('phone')}
                {...c}
                aria-describedby={['contact-phone-code', c['aria-describedby']]
                  .filter(Boolean)
                  .join(' ')}
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel-national"
                maxLength={20}
                placeholder="10 1234 5678"
                className="cf-input pl-[4.5rem]"
              />
            </div>
          )}
        </FormField>
      </div>

      <FormField label="Email address *" htmlFor="contact-email" error={errors.email}>
        {(c) => (
          <input
            {...register('email')}
            {...c}
            type="email"
            required
            autoComplete="email"
            placeholder="sarah@institution.edu"
            className="cf-input"
          />
        )}
      </FormField>

      <FormField label="Message *" htmlFor="contact-message" error={errors.message}>
        {(c) => (
          <textarea
            {...register('message')}
            {...c}
            required
            rows={6}
            placeholder="How can Tissue Bioengineering assist your institution or medical practice?"
            className="cf-input resize-y"
          />
        )}
      </FormField>

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
};
