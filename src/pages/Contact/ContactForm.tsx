import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
import { ContactFormValues } from '@/types';
import { submitContact } from '@/lib/api';
import { Button } from '@/components/common/Button';
import { FormField } from '@/components/common/FormField';

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
    await submitContact(data);
    setSuccess(true);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-cf-line-strong bg-cf-panel p-5 sm:p-8 lg:p-10"
    >
      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-4 text-sm font-medium text-emerald-200"
        >
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
          <span>Thank you for contacting us! Our team will get back to you within 24 hours.</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Your Name *" htmlFor="contact-name" error={errors.name}>
          {(c) => (
            <input
              {...register('name')}
              {...c}
              type="text"
              autoComplete="name"
              placeholder="Dr. Sarah Connor"
              className="cf-input"
            />
          )}
        </FormField>

        <FormField label="Email Address *" htmlFor="contact-email" error={errors.email}>
          {(c) => (
            <input
              {...register('email')}
              {...c}
              type="email"
              autoComplete="email"
              placeholder="sarah@institution.edu"
              className="cf-input"
            />
          )}
        </FormField>
      </div>

      <FormField label="Subject *" htmlFor="contact-subject" error={errors.subject}>
        {(c) => (
          <input
            {...register('subject')}
            {...c}
            type="text"
            placeholder="Clinical Partnership Inquiry"
            className="cf-input"
          />
        )}
      </FormField>

      <FormField label="Message *" htmlFor="contact-message" error={errors.message}>
        {(c) => (
          <textarea
            {...register('message')}
            {...c}
            rows={6}
            placeholder="How can Tissue Bioengineering assist your institution or medical practice?"
            className="cf-input resize-y"
          />
        )}
      </FormField>

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
};
