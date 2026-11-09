import { ServiceCategory, ResearchCategory } from '@/types';

/** Site-wide identity and contact details (SEO, footer, CTA, contact page). */
export const SITE_METADATA = {
  name: 'Tissue Bioengineering & Regenerative Medicine',
  tagline: 'Pioneering Cell Therapeutics, 3D Bioprinting, & Tissue Repair',
  description:
    'Leading biotechnology institution specializing in Advanced Tissue Engineering, Regenerative Medicine, Stem Cell Research, and Bio-printed Graft Solutions.',
  contact: {
    email: 'info@tissuebioengineering.com',
    phone: '+971600551615',
    address: 'Medical Biotech Campus, Innovation Way, Cambridge, MA 02142',
    emergency: '+971600551615',
  },
  social: {
    linkedin: 'https://linkedin.com/company/tissue-bioengineering',
    twitter: 'https://twitter.com/tissuebioeng',
    pubmed: 'https://pubmed.ncbi.nlm.nih.gov/?term=tissue+bioengineering',
  },
};

/** Therapy areas: footer list, services filter, consultation form select + schema. */
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Burn Scar Treatment',
  'Diabetic Foot',
  'Wound Healing',
  'Scar Management',
  'Facial Palsy',
  'Facial Asymmetry',
  'Regenerative Medicine',
];

/** Research domains: research page filter. */
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
