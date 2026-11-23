import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ContactFormValues } from '@/types';
import { submitContact } from '@/lib/api';
import { FormAlert, FormField, FormSubmit, Honeypot } from '@/components/forms/FormField';
import { PhoneField } from '@/components/forms/PhoneField';
import { makePhoneSchema, toE164 } from '@/components/forms/phone';
import { useFormSubmission } from '@/components/forms/useFormSubmission';
import { useI18n } from '@/i18n/context';
import type { Messages } from '@/i18n/messages/en';

const makeContactSchema = (v: Messages['forms']['validation']) =>
  z.object({
    name: z.string().trim().min(1, v.nameRequired).min(2, v.nameMin),
    phone: makePhoneSchema(v),
    email: z.string().trim().min(1, v.emailRequired).email(v.emailInvalid),
    message: z.string().trim().min(1, v.messageRequired).min(10, v.messageMin),
  });

export const ContactForm: React.FC = () => {
  const { t } = useI18n();
  const resolver = useMemo(
    () => zodResolver(makeContactSchema(t.forms.validation)),
    [t.forms.validation]
  );
  const form = useForm<ContactFormValues>({ resolver, defaultValues: { phone: '' } });
  const { register, control } = form;
  const errors = form.formState.errors;
  const submission = useFormSubmission(form, (d, turnstileToken) =>
    submitContact({
      name: d.name,
      phone: toE164(d.phone),
      email: d.email,
      message: d.message,
      website: d.website ?? '',
      turnstileToken,
    })
  );

  return (
    <form
      noValidate
      onSubmit={submission.onSubmit}
      className="grid grid-cols-1 gap-6 rounded-2xl border border-cf-line-strong bg-cf-panel p-4 sm:p-8 lg:p-10"
    >
      <Honeypot id="contact-website" {...register('website')} />

      {/* Stacked at lg, where the form column is narrowest. */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <FormField label={t.forms.fullName} required htmlFor="contact-name" error={errors.name}>
          {(c) => (
            <input
              {...register('name')}
              {...c}
              type="text"
              required
              autoComplete="name"
              placeholder={t.forms.fullNamePlaceholder}
              className="cf-field"
            />
          )}
        </FormField>

        <FormField label={t.forms.email} required htmlFor="contact-email" error={errors.email}>
          {(c) => (
            <input
              {...register('email')}
              {...c}
              type="email"
              required
              autoComplete="email"
              spellCheck={false}
              // Addresses are typed left-to-right; aligned with the other fields in Arabic.
              dir="ltr"
              placeholder={t.forms.emailPlaceholder}
              className="cf-field rtl:text-right"
            />
          )}
        </FormField>
      </div>

      <FormField label={t.forms.phone} required htmlFor="contact-phone" error={errors.phone}>
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

      <FormField label={t.forms.contact.message} required htmlFor="contact-message" error={errors.message}>
        {(c) => (
          <textarea
            {...register('message')}
            {...c}
            required
            rows={6}
            placeholder={t.forms.contact.messagePlaceholder}
            className="cf-field"
          />
        )}
      </FormField>

      {submission.result && <FormAlert tone="success">{t.forms.contact.success}</FormAlert>}
      <FormSubmit submission={submission} turnstileId="contact-turnstile">
        {t.forms.contact.submit}
      </FormSubmit>
    </form>
  );
};
