import { Article } from '@/types';

export const articles: Article[] = [
  {
    id: 'art-1',
    slug: 'future-of-3d-bioprinting-in-reconstructive-surgery',
    title: 'The Future of 3D Bioprinting in Reconstructive Plastic Surgery',
    category: 'Biotech Innovation',
    summary:
      'How patient-specific bio-inks and stereolithographic bioprinters are replacing synthetic implants with live living tissue grafts.',
    content:
      'Reconstructive surgery is undergoing a paradigm shift. Synthetic silicone and titanium implants are being phased out in favor of patient-matched tissue engineered living matrices...',
    author: {
      name: 'Dr. Aris Thorne',
      role: 'Chief Scientific Officer',
    },
    publishedAt: 'July 14, 2026',
    readTime: '6 min read',
    coverImage: '/images/bioprinting-laboratory.webp',
    coverImageAlt: 'Researcher operating a 3D bioprinter inside a biosafety cabinet',
    tags: ['3D Bioprinting', 'Plastic Surgery', 'Tissue Grafts'],
  },
  {
    id: 'art-2',
    slug: 'stem-cell-exosomes-wound-healing-mechanisms',
    title: 'Cell-Free Regenerative Therapies: Stem Cell Exosomes Explained',
    category: 'Regenerative Medicine',
    summary:
      'Exosomes derived from umbilical cord mesenchymal stem cells represent a breakthrough in paracrine signaling for wound closure.',
    content:
      'Cell-free therapies reduce immune rejection risks while delivering concentrated microRNA and growth factor payloads directly into damaged dermis tissue...',
    author: {
      name: 'Dr. Elena Rostova',
      role: 'Head of Regenerative Therapeutics',
    },
    publishedAt: 'June 28, 2026',
    readTime: '8 min read',
    coverImage: '/images/biomedical-research-laboratory.webp',
    coverImageAlt: 'Biomedical research laboratory with benchtop analytical instruments',
    tags: ['Exosomes', 'Stem Cells', 'Wound Repair'],
  },
  {
    id: 'art-3',
    slug: 'diabetic-wound-care-breakthroughs-2026',
    title: 'Conquering Non-Healing Diabetic Foot Ulcers with Pro-Angiogenic Scaffolds',
    category: 'Clinical Breakthroughs',
    summary:
      'Integrating vascular endothelial growth factor (VEGF) releasing matrices into outpatient ulcer treatment protocols.',
    content:
      'Diabetic micro-vascular insufficiency leads to limb-threatening foot ulcers. By restoring capillary blood flow through VEGF functionalized scaffolding, clinical trial closure rates hit 92%...',
    author: {
      name: 'Dr. Michael Chen',
      role: 'Director of Clinical Research',
    },
    publishedAt: 'May 19, 2026',
    readTime: '5 min read',
    coverImage: '/images/diabetic-foot-assessment.webp',
    coverImageAlt: 'Clinician examining the foot of a patient with diabetes',
    tags: ['Diabetic Foot', 'Angiogenesis', 'Scaffolds'],
  },
];
