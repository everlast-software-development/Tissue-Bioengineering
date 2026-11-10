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

/**
 * Therapy areas: footer list, services filter, consultation form select + schema.
 * Also the source of the `ServiceCategory` type (src/types.ts).
 */
export const SERVICE_CATEGORIES = [
  'Burn Scar Treatment',
  'Diabetic Foot',
  'Wound Healing',
  'Scar Management',
  'Facial Palsy',
  'Facial Asymmetry',
  'Regenerative Medicine',
] as const;

/** Research domains: research page filter. Also the source of the `ResearchCategory` type. */
export const RESEARCH_CATEGORIES = [
  '3D Bioprinting',
  'Stem Cells',
  'Smart Biomaterials',
  'Gene Editing',
  'Organ-on-Chip',
  'Drug Delivery',
  'Tissue Engineering',
  'Nanotechnology',
] as const;
