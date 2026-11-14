import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ContactFormValues } from '@/types';
import { getApiErrorMessage, getApiFieldErrors, submitContact } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { FormAlert, FormField } from '@/components/common/FormField';
import { PhoneField } from '@/components/common/phone/PhoneField';
import { makePhoneSchema, toE164 } from '@/components/common/phone/phone';
import { useI18n } from '@/i18n/context';
import type { Messages } from '@/i18n/messages/en';
import { localizeServerFieldError, localizeServerMessage } from '@/i18n/serverMessages';

const makeContactSchema = (v: Messages['forms']['validation']) =>
  z.object({
    name: z.string().trim().min(1, v.nameRequired).min(2, v.nameMin),
    phone: makePhoneSchema(v),
    email: z.string().trim().min(1, v.emailRequired).email(v.emailInvalid),
    message: z.string().trim().min(1, v.messageRequired).min(10, v.messageMin),
  });

export const ContactForm: React.FC = () => {
  const { t, locale } = useI18n();
  const [success, setSuccess] = useState(false);
  /** As received (English); shown in the current language. */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resolver = useMemo(
    () => zodResolver(makeContactSchema(t.forms.validation)),
    [t.forms.validation]
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver,
    defaultValues: { phone: '' },
  });

  // After a language switch, re-check the fields showing an error so the messages follow it.
  useEffect(() => {
    const invalid = Object.keys(errors) as (keyof ContactFormValues)[];
    if (invalid.length) void trigger(invalid);
    // Only on a language change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

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
          setError(field as keyof ContactFormValues, {
            type: 'server',
            message: localizeServerFieldError(messages[0], t.forms),
          });
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
        <label htmlFor="contact-website">{t.forms.honeypotLabel}</label>
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

      {/* Result next to the button the visitor just pressed, so it's in view on every screen size. */}
      {success && <FormAlert tone="success">{t.forms.contact.success}</FormAlert>}
      {errorMessage && (
        <FormAlert tone="error">{localizeServerMessage(errorMessage, t.forms)}</FormAlert>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        {t.forms.contact.submit}
      </Button>
    </form>
  );
};
