import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/utils/validators';
import { ContactFormValues } from '@/types';
import { Button } from '@/components/common/Button';
import { consultationApi } from '@/services/researchApi';
import { CheckCircle, AlertCircle } from 'lucide-react';

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
    await consultationApi.submitContact(data);
    setSuccess(true);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-navy p-6 sm:p-8 space-y-5 bg-white shadow-card">
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-status-success text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-status-success shrink-0" />
          <span>Thank you for contacting us! Our team will get back to you within 24 hours.</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">Your Name *</label>
        <input
          {...register('name')}
          type="text"
          placeholder="Dr. Sarah Connor"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
        />
        {errors.name && (
          <p className="text-xs text-status-error mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">Email Address *</label>
        <input
          {...register('email')}
          type="email"
          placeholder="sarah@institution.edu"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
        />
        {errors.email && (
          <p className="text-xs text-status-error mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">Subject *</label>
        <input
          {...register('subject')}
          type="text"
          placeholder="Clinical Partnership Inquiry"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
        />
        {errors.subject && (
          <p className="text-xs text-status-error mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">Message *</label>
        <textarea
          {...register('message')}
          rows={4}
          placeholder="How can Tissue Bioengineering assist your institution or medical practice?"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm"
        />
        {errors.message && (
          <p className="text-xs text-status-error mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
};
