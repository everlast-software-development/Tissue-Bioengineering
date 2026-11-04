import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
import { ContactFormValues } from '@/types';
import { consultationApi } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { FormField, textControlClass } from '@/components/common/FormField';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-navy space-y-5 bg-white p-6 shadow-card sm:p-8"
    >
      {success && (
        <div className="text-status-success flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold">
          <CheckCircle className="text-status-success h-5 w-5 shrink-0" />
          <span>Thank you for contacting us! Our team will get back to you within 24 hours.</span>
        </div>
      )}

      <FormField label="Your Name *" error={errors.name} labelClassName="mb-1">
        <input
          {...register('name')}
          type="text"
          placeholder="Dr. Sarah Connor"
          className={textControlClass}
        />
      </FormField>

      <FormField label="Email Address *" error={errors.email} labelClassName="mb-1">
        <input
          {...register('email')}
          type="email"
          placeholder="sarah@institution.edu"
          className={textControlClass}
        />
      </FormField>

      <FormField label="Subject *" error={errors.subject} labelClassName="mb-1">
        <input
          {...register('subject')}
          type="text"
          placeholder="Clinical Partnership Inquiry"
          className={textControlClass}
        />
      </FormField>

      <FormField label="Message *" error={errors.message} labelClassName="mb-1">
        <textarea
          {...register('message')}
          rows={4}
          placeholder="How can Tissue Bioengineering assist your institution or medical practice?"
          className={textControlClass}
        />
      </FormField>

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
};
