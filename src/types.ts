export type ResearchCategory =
  | '3D Bioprinting'
  | 'Stem Cells'
  | 'Smart Biomaterials'
  | 'Gene Editing'
  | 'Organ-on-Chip'
  | 'Drug Delivery'
  | 'Tissue Engineering'
  | 'Nanotechnology';

export type ServiceCategory =
  | 'Burn Scar Treatment'
  | 'Diabetic Foot'
  | 'Wound Healing'
  | 'Scar Management'
  | 'Facial Palsy'
  | 'Facial Asymmetry'
  | 'Regenerative Medicine';

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
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
  iconName: string;
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
    avatar: string;
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
  iconName: string;
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
}

export interface ContactFormValues {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}
