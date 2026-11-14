import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ContactFormValues } from '@/types';
import { getApiErrorMessage, getApiFieldErrors, submitContact } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { FormAlert, FormField } from '@/components/common/FormField';
import { PhoneField } from '@/components/common/phone/PhoneField';
import { phoneSchema, toE164 } from '@/components/common/phone/phone';

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter your full name')
    .min(2, 'Name must be at least 2 characters'),
  phone: phoneSchema,
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSuccess(false);
    setErrorMessage(null);
    try {
      // Resolves only once the server confirms the email was accepted for delivery.
      await submitContact({
        name: data.name,
        phone: toE164(data.phone),
        email: data.email,
        message: data.message,
        website: data.website ?? '',
      });
      setSuccess(true);
      reset();
    } catch (err) {
      for (const [field, messages] of Object.entries(getApiFieldErrors(err))) {
        if (field in data)
          setError(field as keyof ContactFormValues, { type: 'server', message: messages[0] });
      }
      setErrorMessage(getApiErrorMessage(err));
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 rounded-2xl border border-cf-line-strong bg-cf-panel p-4 sm:p-8 lg:p-10"
    >
      {/* Anti-spam honeypot: hidden from people and assistive tech; the server discards submissions that fill it. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          {...register('website')}
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Stacked at lg, where the form column is narrowest. */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <FormField label="Full name" required htmlFor="contact-name" error={errors.name}>
          {(c) => (
            <input
              {...register('name')}
              {...c}
              type="text"
              required
              autoComplete="name"
              placeholder="Enter your full name"
              className="cf-field"
            />
          )}
        </FormField>

        <FormField label="Email address" required htmlFor="contact-email" error={errors.email}>
          {(c) => (
            <input
              {...register('email')}
              {...c}
              type="email"
              required
              autoComplete="email"
              spellCheck={false}
              placeholder="Enter your email address"
              className="cf-field"
            />
          )}
        </FormField>
      </div>

      <FormField label="Phone number" required htmlFor="contact-phone" error={errors.phone}>
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

      <FormField label="Message" required htmlFor="contact-message" error={errors.message}>
        {(c) => (
          <textarea
            {...register('message')}
            {...c}
            required
            rows={6}
            placeholder="Tell us how we can help you..."
            className="cf-field"
          />
        )}
      </FormField>

      {/* Result next to the button the visitor just pressed, so it's in view on every screen size. */}
      {success && (
        <FormAlert tone="success">
          Thank you for contacting us! Our team will get back to you within 24 hours.
        </FormAlert>
      )}
      {errorMessage && <FormAlert tone="error">{errorMessage}</FormAlert>}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
};
