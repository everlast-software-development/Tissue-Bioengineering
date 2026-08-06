import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { consultationSchema } from '@/utils/validators';
import { ConsultationFormValues } from '@/types';
import { SERVICE_CATEGORIES } from '@/constants';
import { Button } from '@/components/common/Button';
import { consultationApi } from '@/services/researchApi';
import { CheckCircle2, AlertCircle } from 'lucide-react';

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
      <div className="card-navy p-8 text-center max-w-lg mx-auto border-status-success/40 bg-white">
        <CheckCircle2 className="w-16 h-16 text-status-success mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-navy mb-2">Request Received!</h3>
        <p className="text-sm text-text-secondary mb-6">{serverMessage}</p>
        <Button variant="primary" onClick={() => setIsSubmitted(false)}>
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-navy p-6 sm:p-8 space-y-6 max-w-2xl mx-auto bg-white shadow-card">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Full Name *
          </label>
          <input
            {...register('fullName')}
            type="text"
            placeholder="Dr. / Mr. / Ms. John Doe"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
          />
          {errors.fullName && (
            <p className="text-xs text-status-error mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="patient@example.com"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
          />
          {errors.email && (
            <p className="text-xs text-status-error mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Phone Number *
          </label>
          <input
            {...register('phone')}
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
          />
          {errors.phone && (
            <p className="text-xs text-status-error mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.phone.message}
            </p>
          )}
        </div>

        {/* Age */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Patient Age *
          </label>
          <input
            {...register('age')}
            type="number"
            placeholder="e.g. 42"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
          />
          {errors.age && (
            <p className="text-xs text-status-error mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.age.message}
            </p>
          )}
        </div>
      </div>

      {/* Therapy Category */}
      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1.5">
          Select Therapy Area *
        </label>
        <select
          {...register('serviceCategory')}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
        >
          {SERVICE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-white text-text-primary">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Medical History */}
      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1.5">
          Medical History Summary *
        </label>
        <textarea
          {...register('medicalHistory')}
          rows={4}
          placeholder="Briefly describe the burn injury, diabetic ulcer condition, scar tissue, or facial palsy history..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
        />
        {errors.medicalHistory && (
          <p className="text-xs text-status-error mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.medicalHistory.message}
          </p>
        )}
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Preferred Date *
          </label>
          <input
            {...register('preferredDate')}
            type="date"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
          />
          {errors.preferredDate && (
            <p className="text-xs text-status-error mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.preferredDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Preferred Time Slot *
          </label>
          <select
            {...register('preferredTime')}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
          >
            <option value="09:00 AM" className="bg-white">09:00 AM EST</option>
            <option value="11:30 AM" className="bg-white">11:30 AM EST</option>
            <option value="02:00 PM" className="bg-white">02:00 PM EST</option>
            <option value="04:30 PM" className="bg-white">04:30 PM EST</option>
          </select>
        </div>
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
          I consent to Tissue Bioengineering processing my medical intake details confidentially under HIPAA guidelines.
        </label>
      </div>
      {errors.consent && (
        <p className="text-xs text-status-error flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {errors.consent.message}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Submit Consultation Request
      </Button>
    </form>
  );
};
