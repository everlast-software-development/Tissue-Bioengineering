import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';
import { ConsultationFormValues } from '@/types';
import { SERVICE_CATEGORIES } from '@/lib/site';
import { getApiErrorMessage, getApiFieldErrors, submitConsultation } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { FormAlert, FormField, FieldError } from '@/components/common/FormField';
import { PhoneField } from '@/components/common/phone/PhoneField';
import { makePhoneSchema, toE164 } from '@/components/common/phone/phone';
import { useI18n } from '@/i18n/context';
import type { Messages } from '@/i18n/messages/en';
import { localizeServerFieldError, localizeServerMessage } from '@/i18n/serverMessages';

/** Submitted values of the time slot select (unchanged in every language; the label is translated). */
const TIME_SLOTS = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];

// Same rules as the server schema (server/forms.ts), with messages for the empty case.
const makeConsultationSchema = (v: Messages['forms']['validation']) =>
  z.object({
    fullName: z.string().trim().min(1, v.nameRequired).min(2, v.fullNameMin),
    email: z.string().trim().min(1, v.emailRequired).email(v.emailInvalid),
    phone: makePhoneSchema(v),
    age: z.coerce
      .number({ invalid_type_error: v.ageRequired })
      .int(v.ageWhole)
      .min(1, v.ageRequired)
      .max(120, v.ageInvalid),
    serviceCategory: z.enum(SERVICE_CATEGORIES),
    medicalHistory: z.string().trim().min(10, v.historyMin),
    preferredDate: z.string().min(1, v.dateRequired),
    preferredTime: z.string().min(1, v.timeRequired),
    consent: z.literal(true, {
      errorMap: () => ({ message: v.consentRequired }),
    }),
  });

export const ConsultationForm: React.FC = () => {
  const { t, locale } = useI18n();
  const f = t.forms.consultation;
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  /** Messages are kept as received (English) and shown in the current language. */
  const [serverMessage, setServerMessage] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');
  const successRef = React.useRef<HTMLHeadingElement>(null);

  const resolver = React.useMemo(
    () => zodResolver(makeConsultationSchema(t.forms.validation)),
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
  } = useForm<ConsultationFormValues>({
    resolver,
    defaultValues: {
      phone: '',
      serviceCategory: 'Burn Scar Treatment',
      preferredTime: '09:00 AM',
      consent: true,
    },
  });

  // After a language switch, re-check the fields showing an error so the messages follow it.
  React.useEffect(() => {
    const invalid = Object.keys(errors) as (keyof ConsultationFormValues)[];
    if (invalid.length) void trigger(invalid);
    // Only on a language change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // The confirmation replaces the (taller) form: move focus to it so it is announced and in view.
  React.useEffect(() => {
    if (isSubmitted) successRef.current?.focus();
  }, [isSubmitted]);

  const onSubmit = async (values: ConsultationFormValues) => {
    setSubmitError('');
    try {
      // Resolves only once the server confirms the email was accepted for delivery.
      const res = await submitConsultation({ ...values, phone: toE164(values.phone) });
      setIsSubmitted(true);
      setServerMessage(res.message || '');
      reset();
    } catch (err) {
      for (const [field, messages] of Object.entries(getApiFieldErrors(err))) {
        if (field in values) {
          setError(field as keyof ConsultationFormValues, {
            type: 'server',
            message: localizeServerFieldError(messages[0], t.forms),
          });
        }
      }
      setSubmitError(getApiErrorMessage(err));
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="rounded-2xl border border-emerald-400/30 bg-cf-panel p-8 text-center sm:p-12"
        role="status"
      >
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/40 text-emerald-300">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mb-3 scroll-mt-32 text-2xl font-semibold tracking-[-0.02em] text-cf-text focus:outline-none"
        >
          {f.successTitle}
        </h3>
        <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-cf-text-2">
          {serverMessage ? localizeServerMessage(serverMessage, t.forms) : f.successFallback}
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          {f.another}
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 rounded-2xl border border-cf-line-strong bg-cf-panel p-4 sm:p-8 lg:p-10"
    >
      {/* Anti-spam honeypot: hidden from people and assistive tech; the server discards submissions that fill it. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="consult-website">{t.forms.honeypotLabel}</label>
        <input
          {...register('website')}
          id="consult-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Six columns from sm: name and email split evenly; phone gets the room it needs beside the
          short age field. At lg the form column is narrowest, so phone takes the full row there. */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-6">
        <FormField
          label={t.forms.fullName}
          required
          htmlFor="consult-fullName"
          error={errors.fullName}
          className="sm:col-span-3"
        >
          {(c) => (
            <input
              {...register('fullName')}
              {...c}
              type="text"
              required
              autoComplete="name"
              placeholder={t.forms.fullNamePlaceholder}
              className="cf-field"
            />
          )}
        </FormField>

        <FormField
          label={t.forms.email}
          required
          htmlFor="consult-email"
          error={errors.email}
          className="sm:col-span-3"
        >
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

        <FormField
          label={t.forms.phone}
          required
          htmlFor="consult-phone"
          error={errors.phone}
          className="sm:col-span-4 lg:col-span-6 xl:col-span-4"
        >
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

        <FormField
          label={f.age}
          required
          htmlFor="consult-age"
          error={errors.age}
          className="sm:col-span-2 lg:col-span-3 xl:col-span-2"
        >
          {(c) => (
            <input
              {...register('age')}
              {...c}
              type="number"
              inputMode="numeric"
              required
              placeholder={f.agePlaceholder}
              className="cf-field tabular-nums"
            />
          )}
        </FormField>
      </div>

      <FormField label={f.therapyArea} required htmlFor="consult-serviceCategory">
        {(c) => (
          <select {...register('serviceCategory')} {...c} required className="cf-field">
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t.categories.service[cat]}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <FormField
        label={f.history}
        required
        htmlFor="consult-medicalHistory"
        hint={f.historyHint}
        error={errors.medicalHistory}
      >
        {(c) => (
          <textarea
            {...register('medicalHistory')}
            {...c}
            required
            rows={5}
            placeholder={f.historyPlaceholder}
            className="cf-field"
          />
        )}
      </FormField>

      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        <FormField
          label={f.date}
          required
          htmlFor="consult-preferredDate"
          error={errors.preferredDate}
        >
          {(c) => (
            <input {...register('preferredDate')} {...c} type="date" required className="cf-field" />
          )}
        </FormField>

        <FormField
          label={f.time}
          required
          htmlFor="consult-preferredTime"
          error={errors.preferredTime}
        >
          {(c) => (
            <select {...register('preferredTime')} {...c} required className="cf-field">
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {f.timeSlots[slot]}
                </option>
              ))}
            </select>
          )}
        </FormField>
      </div>

      {/* Consent */}
      <div className="border-t border-cf-line pt-6">
        <div className="flex items-start gap-3">
          <input
            {...register('consent')}
            type="checkbox"
            id="consult-consent"
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'consult-consent-error' : undefined}
            className="cf-focus mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-cf-line-strong accent-cf-accent [color-scheme:dark]"
          />
          <label
            htmlFor="consult-consent"
            className="cursor-pointer text-sm leading-relaxed text-cf-text-2"
          >
            {f.consent}
          </label>
        </div>
        {errors.consent && (
          <FieldError id="consult-consent-error" message={errors.consent.message} className="mt-2 ps-8" />
        )}
      </div>

      {submitError && (
        <FormAlert tone="error">{localizeServerMessage(submitError, t.forms)}</FormAlert>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        {f.submit}
      </Button>
    </form>
  );
};
