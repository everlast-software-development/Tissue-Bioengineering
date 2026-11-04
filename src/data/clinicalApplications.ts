export interface ClinicalApplication {
  id: string;
  category: string;
  label: string;
  title: string;
  description: string;
  highlights: string[];
  duration: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

export const clinicalApplicationsData: ClinicalApplication[] = [
  {
    id: 'burn-scar',
    category: 'Burn Scar Treatment',
    label: 'CLINICAL CASE STUDY',
    title: 'Advanced Burn Scar Bio-Reconstruction',
    description: 'Bioengineered skin substitutes and extracellular-matrix-based strategies designed to support reconstruction and remodeling of complex burn-scar tissue.',
    highlights: ['Autologous cell-based tissue engineering', 'Extracellular matrix reconstruction'],
    duration: 'Duration: 3–6 Weeks',
    imageSrc: '/images/burn_scar_doctor.png',
    imageAlt: 'Doctor evaluating burn scar reconstruction',
    href: '/blog/burn-scar-bio-reconstruction',
  },
  {
    id: 'diabetic-foot',
    category: 'Diabetic Foot',
    label: 'CLINICAL CASE STUDY',
    title: 'Diabetic Foot Ulcer Tissue Regeneration',
    description: 'Biomaterial-based regenerative strategies designed to support vascularization, matrix remodeling, and tissue repair in chronic diabetic wounds.',
    highlights: ['Pro-angiogenic biomaterial systems', 'Adipose-derived stromal/stem cell (ADSC) strategies'],
    duration: 'Duration: 2–4 Weeks',
    imageSrc: '/images/diabetic_foot_doctor.png',
    imageAlt: 'Wound-care specialist examining diabetic foot',
    href: '/blog/diabetic-foot-tissue-regeneration',
  },
  {
    id: 'wound-healing',
    category: 'Wound Healing',
    label: 'CLINICAL APPLICATION',
    title: 'Smart Biomaterial Wound Matrices',
    description: 'Bioactive collagen and nanofiber-based matrices engineered to provide a supportive microenvironment for acute and complex wound repair.',
    highlights: ['Stimuli-responsive therapeutic delivery', 'Electrospun nanofiber scaffolding'],
    duration: 'Duration: 1–3 Weeks',
    imageSrc: '/images/wound_healing_doctor.png',
    imageAlt: 'Physician evaluating advanced wound treatment',
    href: '/blog/smart-wound-matrices',
  },
  {
    id: 'scar-management',
    category: 'Scar Management',
    label: 'CLINICAL CONSULTATION',
    title: 'Keloid & Hypertrophic Scar Remodeling',
    description: 'Targeted biomaterial and molecular strategies designed to modulate excessive extracellular-matrix deposition and fibrotic scar remodeling.',
    highlights: ['TGF-β pathway modulation', 'Controlled collagen remodeling'],
    duration: 'Duration: 4–8 Sessions',
    imageSrc: '/images/scar_management_doctor.png',
    imageAlt: 'Dermatologist consultation for scar management',
    href: '/blog/keloid-scar-remodeling',
  },
  {
    id: 'facial-palsy',
    category: 'Facial Palsy',
    label: 'CLINICAL CASE STUDY',
    title: 'Bioengineered Facial Nerve Regeneration',
    description: 'Engineered nerve-guidance systems designed to support peripheral nerve regeneration and reinnervation of affected facial musculature.',
    highlights: ['Conductive nerve guidance biomaterials', 'Schwann-cell-supportive matrices'],
    duration: 'Duration: Surgical Placement + Long-Term Rehabilitation',
    imageSrc: '/images/facial_palsy_doctor.png',
    imageAlt: 'Neurologist evaluating facial nerve asymmetry',
    href: '/blog/facial-nerve-regeneration',
  },
  {
    id: 'facial-asymmetry',
    category: 'Facial Asymmetry',
    label: 'CLINICAL CASE STUDY',
    title: '3D Bioprinted Craniofacial Tissue Constructs',
    description: 'Patient-specific biofabrication strategies combining 3D modeling, biomaterials, and tissue-engineering principles for craniofacial reconstruction.',
    highlights: ['CT-derived 3D anatomical modeling', 'Bone–cartilage biofabrication'],
    duration: 'Duration: Patient-Specific Surgical Planning',
    imageSrc: '/images/facial_asymmetry_doctor.png',
    imageAlt: 'Craniofacial surgeon reviewing 3D anatomical CT imaging',
    href: '/blog/craniofacial-bioprinting',
  },
  {
    id: 'regenerative-medicine',
    category: 'Regenerative Medicine',
    label: 'REGENERATIVE MEDICINE',
    title: 'Stem Cell & Extracellular Vesicle Research',
    description: 'Advanced regenerative medicine strategies investigating mesenchymal stromal cells and extracellular vesicles as biological modulators of tissue repair.',
    highlights: ['Mesenchymal stromal cell platforms', 'Extracellular vesicle-based therapeutics'],
    duration: 'Duration: Protocol Dependent',
    imageSrc: '/images/cell-matrix-bg.png',
    imageAlt: 'Stem cell laboratory research',
    href: '/blog/stem-cell-extracellular-vesicle-research',
  },
  {
    id: '3d-tissue',
    category: '3D Tissue Bioengineering',
    label: 'TISSUE ENGINEERING',
    title: '3D Bioprinted Tissue Engineering',
    description: 'Additive biofabrication approaches combining cells, biomaterials, and computational design to develop tissue-mimetic three-dimensional constructs.',
    highlights: ['Cell-laden bioink systems', 'Layer-by-layer tissue fabrication'],
    duration: 'Duration: Research & Development Dependent',
    imageSrc: '/images/scaffold-bg.png',
    imageAlt: '3D bioprinted tissue scaffold',
    href: '/blog/3d-tissue-bioengineering',
  },
  {
    id: 'advanced-biomaterials',
    category: 'Advanced Biomaterials',
    label: 'BIOMEDICAL RESEARCH',
    title: 'Smart Biomaterials for Tissue Regeneration',
    description: 'Next-generation biomaterial platforms engineered to recreate key biochemical and mechanical cues of the native tissue microenvironment.',
    highlights: ['Stimuli-responsive biomaterials', 'Extracellular-matrix-mimetic scaffolds'],
    duration: 'Duration: Research Protocol Dependent',
    imageSrc: '/images/biotech-hero-bg.png',
    imageAlt: 'Biomaterials research and scaffold analysis',
    href: '/blog/smart-biomaterials',
  }
];
