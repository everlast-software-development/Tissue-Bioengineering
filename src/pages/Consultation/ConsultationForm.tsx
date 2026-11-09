import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';
import { ConsultationFormValues } from '@/types';
import { SERVICE_CATEGORIES } from '@/lib/site';
import { consultationApi } from '@/lib/api';
import { Button } from '@/components/common/Button';
import {
  FormField,
  FieldError,
  controlClass,
  textControlClass,
} from '@/components/common/FormField';

const consultationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  age: z.coerce.number().min(1, 'Age is required').max(120, 'Invalid age'),
  serviceCategory: z.enum(SERVICE_CATEGORIES as [string, ...string[]]),
  medicalHistory: z.string().min(10, 'Please provide a brief medical history summary'),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a preferred time slot'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to data processing for medical consultation' }),
  }),
});

export const ConsultationForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [serverMessage, setServerMessage] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      serviceCategory: 'Burn Scar Treatment',
      preferredTime: '10:00 AM',
      consent: true,
    },
  });

  const onSubmit = async (values: ConsultationFormValues) => {
    try {
      const res = await consultationApi.submitConsultation(values);
      setIsSubmitted(true);
      setServerMessage(res.message || 'Consultation submitted successfully.');
      reset();
    } catch {
      setServerMessage('Failed to submit consultation. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-emerald-400/30 bg-cf-panel p-8 text-center sm:p-12" role="status">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/40 text-emerald-300">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h3 className="mb-3 text-2xl font-semibold tracking-[-0.02em] text-cf-text">Request Received!</h3>
        <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-cf-text-2">{serverMessage}</p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-cf-line-strong bg-cf-panel p-5 sm:p-8 lg:p-10"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Full Name *" htmlFor="consult-fullName" error={errors.fullName}>
          {(c) => (
            <input
              {...register('fullName')}
              {...c}
              type="text"
              autoComplete="name"
              placeholder="Dr. / Mr. / Ms. John Doe"
              className={textControlClass}
            />
          )}
        </FormField>

        <FormField label="Email Address *" htmlFor="consult-email" error={errors.email}>
          {(c) => (
            <input
              {...register('email')}
              {...c}
              type="email"
              autoComplete="email"
              placeholder="patient@example.com"
              className={textControlClass}
            />
          )}
        </FormField>

        <FormField label="Phone Number *" htmlFor="consult-phone" error={errors.phone}>
          {(c) => (
            <input
              {...register('phone')}
              {...c}
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              className={textControlClass}
            />
          )}
        </FormField>

        <FormField label="Patient Age *" htmlFor="consult-age" error={errors.age}>
          {(c) => (
            <input
              {...register('age')}
              {...c}
              type="number"
              inputMode="numeric"
              placeholder="e.g. 42"
              className={textControlClass}
            />
          )}
        </FormField>
      </div>

      <FormField label="Select Therapy Area *" htmlFor="consult-serviceCategory">
        {(c) => (
          <select {...register('serviceCategory')} {...c} className={controlClass}>
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <FormField
        label="Medical History Summary *"
        htmlFor="consult-medicalHistory"
        error={errors.medicalHistory}
      >
        {(c) => (
          <textarea
            {...register('medicalHistory')}
            {...c}
            rows={5}
            placeholder="Briefly describe the burn injury, diabetic ulcer condition, scar tissue, or facial palsy history..."
            className={`${textControlClass} resize-y`}
          />
        )}
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Preferred Date *" htmlFor="consult-preferredDate" error={errors.preferredDate}>
          {(c) => <input {...register('preferredDate')} {...c} type="date" className={controlClass} />}
        </FormField>

        <FormField
          label="Preferred Time Slot *"
          htmlFor="consult-preferredTime"
          error={errors.preferredTime}
        >
          {(c) => (
            <select {...register('preferredTime')} {...c} className={controlClass}>
              <option value="09:00 AM">09:00 AM EST</option>
              <option value="11:30 AM">11:30 AM EST</option>
              <option value="02:00 PM">02:00 PM EST</option>
              <option value="04:30 PM">04:30 PM EST</option>
            </select>
          )}
        </FormField>
      </div>

      {/* Consent checkbox */}
      <div className="border-t border-cf-line pt-6">
        <div className="flex items-start gap-3">
          <input
            {...register('consent')}
            type="checkbox"
            id="consent"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            className="cf-focus mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-cf-line-strong accent-cf-accent"
          />
          <label htmlFor="consent" className="cursor-pointer text-sm leading-relaxed text-cf-text-2">
            I consent to Tissue Bioengineering processing my medical intake details confidentially
            under HIPAA guidelines.
          </label>
        </div>
        {errors.consent && <FieldError id="consent-error" message={errors.consent.message} />}
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Submit Consultation Request
      </Button>
    </form>
  );
};
