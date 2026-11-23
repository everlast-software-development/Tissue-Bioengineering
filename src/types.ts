import type { RESEARCH_CATEGORIES, SERVICE_CATEGORIES } from '@/lib/site';
import type { IconName } from '@/lib/icons';
import type { Locale } from '@/i18n/config';

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

/**
 * One block of an article body, rendered in order on the article page. Text may mark emphasis
 * as `**bold**`; nothing else is interpreted.
 */
export type ArticleBlock =
  /** Source or context line set apart from the body (italic). */
  | { type: 'note'; text: string }
  /** Section heading (h2; the article title is the page's h1). */
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  /** Shown at its own aspect ratio, never cropped. `width`/`height` are the file's pixels. */
  | { type: 'image'; src: string; alt: string; width: number; height: number }
  /** Questions render as h3 under the preceding heading. */
  | { type: 'faq'; items: { question: string; answer: string }[] };

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: ArticleBlock[];
  /** Real, approved authorship only; leave out rather than invent. Hidden when absent. */
  author?: {
    name: string;
    role: string;
    /** Authentic, approved headshot only; never stock photography. */
    avatar?: string;
  };
  /** Display date. Hidden when absent. */
  publishedAt?: string;
  coverImage: string;
  /** The cover file's pixels, so the article page can show it uncropped. */
  coverImageWidth: number;
  coverImageHeight: number;
  /** Describes what the cover image shows; falls back to the title. */
  coverImageAlt?: string;
  tags: string[];
  /** Language of the text, set by `useArticles` ('en' when an article has no translation yet). */
  lang?: Locale;
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

export interface ConsultationFormValues {
  fullName: string;
  email: string;
  /** International number from <PhoneField>; submitted in E.164 form (e.g. +971501234567). */
  phone: string;
  age: number;
  serviceCategory: ServiceCategory;
  medicalHistory: string;
  preferredDate: string;
  preferredTime: string;
  consent: boolean;
  /** Hidden anti-spam field; humans never fill it, so it must be empty. */
  website?: string;
  /** Cloudflare Turnstile token from the widget; verified by the server. */
  turnstileToken: string;
}

export interface ContactFormValues {
  name: string;
  /** International number from <PhoneField>; submitted in E.164 form (e.g. +201012345678). */
  phone: string;
  email: string;
  message: string;
  /** Hidden anti-spam field; humans never fill it, so it must be empty. */
  website?: string;
  /** Cloudflare Turnstile token from the widget; verified by the server. */
  turnstileToken: string;
}
