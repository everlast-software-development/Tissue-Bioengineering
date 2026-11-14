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
import { phoneSchema, toE164 } from '@/components/common/phone/phone';

// Same rules as the server schema (server/forms.ts), with messages for the empty case.
const consultationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Please enter your full name')
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address'),
  phone: phoneSchema,
  age: z.coerce
    .number({ invalid_type_error: "Please enter the patient's age" })
    .int('Age must be a whole number')
    .min(1, "Please enter the patient's age")
    .max(120, 'Please enter a valid age'),
  serviceCategory: z.enum(SERVICE_CATEGORIES),
  medicalHistory: z
    .string()
    .trim()
    .min(10, 'Please provide a brief medical history summary (at least 10 characters)'),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a preferred time slot'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to data processing for medical consultation' }),
  }),
});

export const ConsultationForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [serverMessage, setServerMessage] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');
  const successRef = React.useRef<HTMLHeadingElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      phone: '',
      serviceCategory: 'Burn Scar Treatment',
      preferredTime: '09:00 AM',
      consent: true,
    },
  });

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
      setServerMessage(res.message || 'Consultation submitted successfully.');
      reset();
    } catch (err) {
      for (const [field, messages] of Object.entries(getApiFieldErrors(err))) {
        if (field in values) {
          setError(field as keyof ConsultationFormValues, { type: 'server', message: messages[0] });
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
          Request Received!
        </h3>
        <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-cf-text-2">
          {serverMessage}
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Submit Another Request
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
        <label htmlFor="consult-website">Website</label>
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
          label="Full name"
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
              placeholder="Enter your full name"
              className="cf-field"
            />
          )}
        </FormField>

        <FormField
          label="Email address"
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
              placeholder="Enter your email address"
              className="cf-field"
            />
          )}
        </FormField>

        <FormField
          label="Phone number"
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
          label="Patient age"
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
              placeholder="Enter age"
              className="cf-field tabular-nums"
            />
          )}
        </FormField>
      </div>

      <FormField label="Therapy area" required htmlFor="consult-serviceCategory">
        {(c) => (
          <select {...register('serviceCategory')} {...c} required className="cf-field">
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <FormField
        label="Medical history summary"
        required
        htmlFor="consult-medicalHistory"
        hint="Briefly describe the condition (burn injury, diabetic ulcer, scar tissue or facial palsy), how long it has been present and any previous treatment."
        error={errors.medicalHistory}
      >
        {(c) => (
          <textarea
            {...register('medicalHistory')}
            {...c}
            required
            rows={5}
            placeholder="Describe the patient's condition..."
            className="cf-field"
          />
        )}
      </FormField>

      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        <FormField
          label="Preferred date"
          required
          htmlFor="consult-preferredDate"
          error={errors.preferredDate}
        >
          {(c) => (
            <input {...register('preferredDate')} {...c} type="date" required className="cf-field" />
          )}
        </FormField>

        <FormField
          label="Preferred time slot"
          required
          htmlFor="consult-preferredTime"
          error={errors.preferredTime}
        >
          {(c) => (
            <select {...register('preferredTime')} {...c} required className="cf-field">
              <option value="09:00 AM">09:00 AM EST</option>
              <option value="11:30 AM">11:30 AM EST</option>
              <option value="02:00 PM">02:00 PM EST</option>
              <option value="04:30 PM">04:30 PM EST</option>
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
            I consent to Tissue Bioengineering processing my medical intake details confidentially
            under HIPAA guidelines.
          </label>
        </div>
        {errors.consent && (
          <FieldError id="consult-consent-error" message={errors.consent.message} className="mt-2 pl-8" />
        )}
      </div>

      {submitError && <FormAlert tone="error">{submitError}</FormAlert>}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Submit Consultation Request
      </Button>
    </form>
  );
};
