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
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    },
    publishedAt: 'July 14, 2026',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
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
      avatar: 'https://images.unsplash.com/photo-1594824813570-8263158c30a8?auto=format&fit=crop&w=200&q=80',
    },
    publishedAt: 'June 28, 2026',
    readTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
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
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
    },
    publishedAt: 'May 19, 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    tags: ['Diabetic Foot', 'Angiogenesis', 'Scaffolds'],
  },
];
