import { z } from 'zod';
import { SERVICE_CATEGORIES } from '@/constants';

export const consultationSchema = z.object({
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

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});
