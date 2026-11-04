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
      <div className="card-navy border-status-success/40 mx-auto max-w-lg bg-white p-8 text-center">
        <CheckCircle2 className="text-status-success mx-auto mb-4 h-16 w-16 animate-bounce" />
        <h3 className="mb-2 text-2xl font-bold text-navy">Request Received!</h3>
        <p className="mb-6 text-sm text-text-secondary">{serverMessage}</p>
        <Button variant="primary" onClick={() => setIsSubmitted(false)}>
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-navy mx-auto max-w-2xl space-y-6 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Full Name *" error={errors.fullName}>
          <input
            {...register('fullName')}
            type="text"
            placeholder="Dr. / Mr. / Ms. John Doe"
            className={textControlClass}
          />
        </FormField>

        <FormField label="Email Address *" error={errors.email}>
          <input
            {...register('email')}
            type="email"
            placeholder="patient@example.com"
            className={textControlClass}
          />
        </FormField>

        <FormField label="Phone Number *" error={errors.phone}>
          <input
            {...register('phone')}
            type="tel"
            placeholder="+1 (555) 000-0000"
            className={textControlClass}
          />
        </FormField>

        <FormField label="Patient Age *" error={errors.age}>
          <input
            {...register('age')}
            type="number"
            placeholder="e.g. 42"
            className={textControlClass}
          />
        </FormField>
      </div>

      <FormField label="Select Therapy Area *">
        <select {...register('serviceCategory')} className={controlClass}>
          {SERVICE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-white text-text-primary">
              {cat}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Medical History Summary *" error={errors.medicalHistory}>
        <textarea
          {...register('medicalHistory')}
          rows={4}
          placeholder="Briefly describe the burn injury, diabetic ulcer condition, scar tissue, or facial palsy history..."
          className={textControlClass}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Preferred Date *" error={errors.preferredDate}>
          <input {...register('preferredDate')} type="date" className={controlClass} />
        </FormField>

        <FormField label="Preferred Time Slot *">
          <select {...register('preferredTime')} className={controlClass}>
            <option value="09:00 AM" className="bg-white">
              09:00 AM EST
            </option>
            <option value="11:30 AM" className="bg-white">
              11:30 AM EST
            </option>
            <option value="02:00 PM" className="bg-white">
              02:00 PM EST
            </option>
            <option value="04:30 PM" className="bg-white">
              04:30 PM EST
            </option>
          </select>
        </FormField>
      </div>

      {/* Consent checkbox */}
      <div className="flex items-start space-x-2 pt-2">
        <input
          {...register('consent')}
          type="checkbox"
          id="consent"
          className="mt-1 rounded border-border-light bg-slate-50 text-navy focus:ring-navy/40"
        />
        <label htmlFor="consent" className="text-xs text-text-secondary">
          I consent to Tissue Bioengineering processing my medical intake details confidentially
          under HIPAA guidelines.
        </label>
      </div>
      {errors.consent && <FieldError message={errors.consent.message} className="" />}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Submit Consultation Request
      </Button>
    </form>
  );
};
