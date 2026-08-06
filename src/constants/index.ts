import { NavItem, ServiceCategory, ResearchCategory } from '@/types';

export const SITE_METADATA = {
  name: 'Tissue Bioengineering & Regenerative Medicine',
  tagline: 'Pioneering Cell Therapeutics, 3D Bioprinting, & Tissue Repair',
  description:
    'Leading biotechnology institution specializing in Advanced Tissue Engineering, Regenerative Medicine, Stem Cell Research, and Bio-printed Graft Solutions.',
  contact: {
    email: 'info@tissuebioengineering.com',
    phone: '+1 (800) 555-BIO-TISSUE',
    address: 'Medical Biotech Campus, Innovation Way, Cambridge, MA 02142',
    emergency: '+1 (800) 999-REGEN',
  },
  social: {
    linkedin: 'https://linkedin.com/company/tissue-bioengineering',
    twitter: 'https://twitter.com/tissuebioeng',
    pubmed: 'https://pubmed.ncbi.nlm.nih.gov/?term=tissue+bioengineering',
  },
};

export const NAV_LINKS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Research & Innovation', path: '/research' },
  { label: 'Technologies', path: '/technologies' },
  { label: 'Articles', path: '/articles' },
  { label: 'Case Studies', path: '/case-studies' },
  { label: 'Request Consultation', path: '/consultation' },
  { label: 'Contact Us', path: '/contact' },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Burn Scar Treatment',
  'Diabetic Foot',
  'Wound Healing',
  'Scar Management',
  'Facial Palsy',
  'Facial Asymmetry',
  'Regenerative Medicine',
];

export const RESEARCH_CATEGORIES: ResearchCategory[] = [
  '3D Bioprinting',
  'Stem Cells',
  'Smart Biomaterials',
  'Gene Editing',
  'Organ-on-Chip',
  'Drug Delivery',
  'Tissue Engineering',
  'Nanotechnology',
];

export const API_ENDPOINTS = {
  SERVICES: '/api/v1/services',
  RESEARCH: '/api/v1/research',
  TECHNOLOGIES: '/api/v1/technologies',
  ARTICLES: '/api/v1/articles',
  CASE_STUDIES: '/api/v1/case-studies',
  CONSULTATION: '/api/v1/consultations',
  CONTACT: '/api/v1/contact',
  NEWSLETTER: '/api/v1/newsletter',
};
