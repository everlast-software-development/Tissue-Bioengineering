import { Service } from '@/types';

export const mockServices: Service[] = [
  {
    id: 'srv-1',
    slug: 'burn-scar-treatment',
    title: 'Advanced Burn Scar Bio-Reconstruction',
    category: 'Burn Scar Treatment',
    shortDescription:
      'Autologous skin tissue engineering and cellular matrix deposition for third-degree burn scar replacement.',
    fullDescription:
      'Our burn scar therapy uses patient-derived dermal fibroblasts and keratinocytes cultured on biodegradable scaffolds to restore elasticity, pigmentation, and tactile sensation.',
    iconName: 'Flame',
    features: [
      'Autologous cell seeding',
      '3D extracellular matrix synthesis',
      'Minimal immune rejection risk',
      'Restoration of skin elasticity and microvascular network',
    ],
    benefits: [
      'Reduces contracture formation',
      'Improves cosmetic appearance',
      'Accelerates re-epithelialization',
    ],
    treatmentDuration: '3 - 6 Weeks',
    recoveryPeriod: '2 - 4 Months',
    image: '/images/surgical-team-operating-room.webp',
    imageAlt: 'Surgical team viewed from the operating table during a reconstructive procedure',
    featured: true,
  },
  {
    id: 'srv-2',
    slug: 'diabetic-foot-ulcer-regeneration',
    title: 'Diabetic Foot Ulcer Tissue Grafting',
    category: 'Diabetic Foot',
    shortDescription:
      'Vascularized stem-cell hydrogels designed to jumpstart healing in chronic non-healing diabetic lower-limb ulcers.',
    fullDescription:
      'Using pro-angiogenic factors combined with adipose-derived stem cells (ADSCs), our diabetic foot therapy stimulates rapid capillary sprouting and tissue regeneration in ischemic wound beds.',
    iconName: 'Activity',
    features: [
      'Pro-angiogenic growth factor release',
      'ADSC cell matrix infusion',
      'Anti-microbial peptide coating',
      'Non-invasive topical bio-membrane application',
    ],
    benefits: [
      'Prevents amputation risks',
      'Promotes micro-vascular formation',
      'Significantly lowers infection recurrence',
    ],
    treatmentDuration: '2 - 4 Weeks',
    recoveryPeriod: '1 - 2 Months',
    image: '/images/diabetic-foot-examination.webp',
    imageAlt: 'Physician examining the foot of a patient with diabetes',
    featured: true,
  },
  {
    id: 'srv-3',
    slug: 'wound-healing-biomaterials',
    title: 'Smart Biomaterial Wound Matrix',
    category: 'Wound Healing',
    shortDescription:
      'Bio-interactive collagen-nanofiber hydrogels engineered for accelerated acute and trauma wound remodeling.',
    fullDescription:
      'Smart biomaterials respond dynamically to wound bed micro-environments (pH and ROS levels), releasing localized therapeutic agents to optimize natural healing cascades.',
    iconName: 'ShieldCheck',
    features: [
      'pH-responsive drug release',
      'Electrospun nanofiber scaffolding',
      'Sustained anti-inflammatory signaling',
    ],
    benefits: [
      'Faster closure time by 45%',
      'Reduced keloid and hypertrophic scar formation',
      'Pain mitigation properties',
    ],
    treatmentDuration: '1 - 3 Weeks',
    recoveryPeriod: '3 - 6 Weeks',
    image: '/images/nanofiber-scaffold-sem.webp',
    imageAlt: 'Scanning electron micrograph of a fiber-based biomaterial scaffold (blue) partly covered by a cultured cell layer (gray)',
    featured: true,
  },
  {
    id: 'srv-4',
    slug: 'scar-management-therapeutics',
    title: 'Keloid & Hypertrophic Scar Remodeling',
    category: 'Scar Management',
    shortDescription:
      'Targeted gene-silencing and micro-needle cell delivery to regress fibrotic scar tissue.',
    fullDescription:
      'Combines miRNA targeted therapy with extracellular matrix-degrading enzymes to dissolve excess collagen deposits in keloids and hypertrophic scars.',
    iconName: 'Sparkles',
    features: [
      'Targeted TGF-beta pathway inhibition',
      'Enzymatic collagen degradation',
      'Precision micro-needle delivery system',
    ],
    benefits: ['Smooths elevated scar tissue', 'Restores natural skin tone', 'Relieves itching and tightness'],
    treatmentDuration: '4 - 8 Sessions',
    recoveryPeriod: 'Minimal downtime',
    image: '/images/keloid-histopathology.webp',
    imageAlt: 'Histology of keloid scar tissue showing thick, disorganized collagen bundles beneath the epidermis',
  },
  {
    id: 'srv-5',
    slug: 'facial-palsy-nerve-reconstruction',
    title: 'Bio-Engineered Facial Nerve Regeneration',
    category: 'Facial Palsy',
    shortDescription:
      'Conductive nerve guidance conduits infused with neurotrophic stem cells for re-innervating facial muscles.',
    fullDescription:
      'Bio-synthetic nerve conduits provide structural alignment and electrical guidance cues to promote rapid axonal sprouting across damaged facial nerve gaps.',
    iconName: 'Zap',
    features: [
      'Piezoelectric conductive polymers',
      'Schwann cell supportive matrix',
      'Custom 3D printed conduit geometry',
    ],
    benefits: ['Restores facial expression symmetry', 'Speeds up nerve regeneration rates', 'Minimizes graft donor-site morbidity'],
    treatmentDuration: 'Surgical Placement + 6 Months Therapy',
    recoveryPeriod: '6 - 12 Months',
    image: '/images/peripheral-nerve-fibers.webp',
    imageAlt: 'Light micrograph of teased peripheral nerve fibers',
  },
  {
    id: 'srv-6',
    slug: 'facial-asymmetry-reconstruction',
    title: '3D Bioprinted Craniofacial Osteo-Grafts',
    category: 'Facial Asymmetry',
    shortDescription:
      'Custom anatomical 3D bio-printed osteo-chondral constructs tailored for craniofacial contour restoration.',
    fullDescription:
      'Using high-resolution CT scans, patient-specific bio-scaffolding printed with bio-ceramic and osteogenic stem cells seamlessly integrates with host facial bones.',
    iconName: 'Box',
    features: [
      'CT-scan accurate 3D CAD modeling',
      'Biphasic bone and cartilage bioprinting',
      'Osseointegrative bio-active coatings',
    ],
    benefits: ['Perfect anatomical symmetry match', 'Long-term structural permanence', 'No metal hardware requirement'],
    treatmentDuration: 'Single Surgical Grafting',
    recoveryPeriod: '3 - 6 Months',
    image: '/images/craniofacial-skull-model.webp',
    imageAlt: 'Transparent anatomical skull model showing craniofacial bone structure',
  },
  {
    id: 'srv-7',
    slug: 'regenerative-stem-cell-medicine',
    title: 'Systemic Stem Cell & Exosome Therapy',
    category: 'Regenerative Medicine',
    shortDescription:
      'Next-generation mesenchymal stem cell (MSC) and purified exosome infusions for multi-organ cellular repair.',
    fullDescription:
      'Engineered extracellular vesicles carrying bioactive microRNAs and growth factors target systemic inflammation and cellular senescence.',
    iconName: 'Dna',
    features: [
      'High-purity umbilical cord MSC exosomes',
      'Immune-evasive cellular formulations',
      'Standardized potency assay testing',
    ],
    benefits: ['Enhances systemic tissue rejuvenation', 'Reduces oxidative stress markers', 'Promotes organ function recovery'],
    treatmentDuration: 'Outpatient Infusion Protocol',
    recoveryPeriod: '1 - 2 Days',
    image: '/images/stem-cell-culture-flasks.webp',
    imageAlt: 'Scientist handling cell culture flasks inside a biosafety cabinet',
    featured: true,
  },
];
