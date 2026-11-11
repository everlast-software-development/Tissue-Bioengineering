import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input/max';
import { validatePhoneNumberLength } from 'libphonenumber-js/max';
import { ContactFormValues } from '@/types';
import { submitContact } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { FormField } from '@/components/common/FormField';
import { PhoneField } from './PhoneField';

/** The phone field's value is E.164 for the selected country (e.g. +201012345678). */
function phoneError(e164: string): string | undefined {
  if (isValidPhoneNumber(e164)) return undefined;
  return validatePhoneNumberLength(e164) === 'TOO_SHORT'
    ? 'This number is too short for the selected country'
    : 'Please enter a valid phone number for the selected country';
}

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
    .superRefine((v, ctx) => {
      const message = phoneError(v);
      if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    }),
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
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = async (data: ContactFormValues) => {
    await submitContact({
      name: data.name,
      // Already E.164 from the phone field; normalised once more so only canonical
      // numbers are ever sent (the schema guarantees it's valid).
      phone: parsePhoneNumber(data.phone)?.number ?? data.phone,
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

      {/* Stacked at lg, where the form column is narrowest. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
      </div>

      {/* minmax(0,1fr) column stops the number input's intrinsic width from widening the page on narrow phones. */}
      <div className="grid grid-cols-1">
        <FormField label="Phone number *" htmlFor="contact-phone" error={errors.phone}>
          {(c) => (
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneField
                  {...c}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              )}
            />
          )}
        </FormField>
      </div>

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
