import type { RESEARCH_CATEGORIES, SERVICE_CATEGORIES } from '@/lib/site';
import type { IconName } from '@/lib/icons';

export type ResearchCategory = (typeof RESEARCH_CATEGORIES)[number];

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  iconName: IconName;
  features: string[];
  benefits: string[];
  treatmentDuration: string;
  recoveryPeriod: string;
  image: string;
  /** Describes what the image shows; falls back to the title. */
  imageAlt?: string;
  featured?: boolean;
}

export interface ResearchItem {
  id: string;
  slug: string;
  title: string;
  category: ResearchCategory;
  abstract: string;
  fullDetails: string;
  publicationDate: string;
  doi?: string;
  authors: string[];
  status: 'In Development' | 'Clinical Trial' | 'FDA Approved' | 'Published';
  coverImage: string;
  pdfUrl?: string;
}

export interface Technology {
  id: string;
  title: string;
  tagline: string;
  description: string;
  specifications: Record<string, string>;
  applications: string[];
  iconName: IconName;
  badge: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: {
    name: string;
    role: string;
    /** Authentic, approved headshot only; never stock photography. */
    avatar?: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  /** Describes what the cover image shows; falls back to the title. */
  coverImageAlt?: string;
  tags: string[];
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  patientInitials: string;
  condition: ServiceCategory;
  duration: string;
  summary: string;
  procedure: string;
  outcome: string;
  beforeAfterImage: string;
  /** Describes what the image shows; falls back to the title. */
  beforeAfterImageAlt?: string;
  attendingSurgeon: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  treatment: ServiceCategory;
  quote: string;
  rating: number;
  date: string;
  avatarUrl?: string;
}

export interface Statistic {
  id: string;
  label: string;
  value: string;
  unit?: string;
  description: string;
  iconName: IconName;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface TimelineStep {
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
}

export interface ConsultationFormValues {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  serviceCategory: ServiceCategory;
  medicalHistory: string;
  preferredDate: string;
  preferredTime: string;
  consent: boolean;
  /** Hidden anti-spam field; humans never fill it, so it must be empty. */
  website?: string;
}

export interface ContactFormValues {
  name: string;
  /** Egyptian number; the form submits it in E.164 form, always starting with +20. */
  phone: string;
  email: string;
  message: string;
  /** Hidden anti-spam field; humans never fill it, so it must be empty. */
  website?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}
