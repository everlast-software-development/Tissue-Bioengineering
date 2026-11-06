import { ResearchItem } from '@/types';

export const researchItems: ResearchItem[] = [
  {
    id: 'res-1',
    slug: 'laser-assisted-3d-bioprinting-vascularization',
    title: 'Laser-Assisted Laser-Guided 3D Bioprinting of Microvascular Networks',
    category: '3D Bioprinting',
    abstract:
      'Demonstrating high-precision laser-assisted bioprinting of capillary-scale endothelial channels embedded within gelatin-methacryloyl (GelMA) hydrogels for thick tissue survival.',
    fullDetails:
      'Perfusion of thick bio-printed tissue constructs remains a fundamental bottleneck in regenerative medicine. This study introduces a dual-laser stereolithography technique that achieves 10-micron channel resolutions, enabling physiological nutrient perfusion and cardiac muscle tissue survival over 90 days.',
    publicationDate: '2026-03-15',
    doi: '10.1038/s41587-026-00412-x',
    authors: ['Dr. Aris Thorne', 'Dr. Elena Rostova', 'Prof. Marcus Vance'],
    status: 'Published',
    coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'res-2',
    slug: 'induced-pluripotent-stem-cells-cartilage',
    title: 'Autologous iPSC-Derived Chondrocytes for Articular Surface Renewal',
    category: 'Stem Cells',
    abstract:
      'Reprogramming adult dermal fibroblasts into iPSCs to generate immunologically silent hyaline cartilage matrix grafts.',
    fullDetails:
      'We demonstrate successful 12-month joint cartilage repair in animal models using non-viral episomal reprogrammed iPSCs differentiated into COL2A1-rich chondrogenic pellets.',
    publicationDate: '2026-01-20',
    doi: '10.1016/j.stem.2025.11.004',
    authors: ['Dr. Sarah Jenkins', 'Dr. Hiroshi Tanaka'],
    status: 'Clinical Trial',
    coverImage: '/images/biomedical-research-laboratory.webp',
  },
  {
    id: 'res-3',
    slug: 'self-healing-supramolecular-biomaterials',
    title: 'Shear-Thinning Self-Healing Supramolecular Hydrogels for Injectable Tissue Repair',
    category: 'Smart Biomaterials',
    abstract:
      'Reversible host-guest chemistry hydrogels that transition from fluid under shear pressure during injection to robust solid matrix post-implantation.',
    fullDetails:
      'Injectable supramolecular hydrogels formulated with cyclodextrin-adamantane inclusion complexes provide immediate mechanical support while continuously releasing osteogenic signals.',
    publicationDate: '2025-11-10',
    doi: '10.1021/acs.biomac.5b01290',
    authors: ['Dr. Michael Chen', 'Dr. Olivia Vance'],
    status: 'Published',
    coverImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'res-4',
    slug: 'crispr-prime-editing-fibrotic-genes',
    title: 'CRISPR-Prime Editing Knockdown of Fibrotic Collagen Genes in Keloids',
    category: 'Gene Editing',
    abstract:
      'Precise single-nucleotide editing of COL1A1 promoter regions prevents hyper-fibrotic scarring in skin explants.',
    fullDetails:
      'Prime editing offers unprecedented precision without double-stranded DNA breaks. Our lipid nanoparticle delivery system selectively transfects wound fibroblasts, reducing fibrotic markers by 82%.',
    publicationDate: '2026-05-04',
    doi: '10.1016/j.cell.2026.04.019',
    authors: ['Dr. Clara Dupont', 'Dr. Aris Thorne'],
    status: 'In Development',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'res-5',
    slug: 'microfluidic-organ-on-chip-skin-barrier',
    title: 'Multi-Layer Microfluidic Skin-on-Chip Platform for High-Throughput Drug Screening',
    category: 'Organ-on-Chip',
    abstract:
      'Emulating human dermis-epidermis-vasculature crosstalk in microfluidic bio-chips to replace animal testing in wound drug validation.',
    fullDetails:
      'Integrating micro-sensors into dynamic microfluidic channels allows real-time measurement of Transepithelial Electrical Resistance (TEER) and inflammatory cytokine profiles under fluidic stress.',
    publicationDate: '2025-09-18',
    doi: '10.1039/d5lc00481f',
    authors: ['Dr. Liam Gallagher', 'Dr. Maya Patel'],
    status: 'Published',
    coverImage: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'res-6',
    slug: 'targeted-nanoparticle-exosome-drug-delivery',
    title: 'Targeted Nanoparticle-Exosome Hybrids for Deep Tissue Regeneration',
    category: 'Drug Delivery',
    abstract:
      'Hybrid vesicle platforms combining synthetic liposomes with biological exosomes for deep dermal therapeutic cargo transport.',
    fullDetails:
      'Engineered hybrid vesicles display skin-homing peptides on their surface, enabling deep penetration across thick burn eschars to deliver micro-RNA 21 directly to basal stem cells.',
    publicationDate: '2026-02-14',
    doi: '10.1002/adma.202509124',
    authors: ['Dr. Sofia Ramirez', 'Dr. Aris Thorne'],
    status: 'FDA Approved',
    coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'res-7',
    slug: 'decellularized-extracellular-matrix-grafts',
    title: 'Decellularized Whole-Organ Tissue Engineering Scaffolds for Complex Reconstruction',
    category: 'Tissue Engineering',
    abstract:
      'Perfusion decellularization protocols preserving native extracellular matrix micro-architecture for functional recellularization.',
    fullDetails:
      'By removing donor cells while maintaining intact collagen type IV and elastin frameworks, decellularized tissues provide structural cues for patient-specific cell seeding.',
    publicationDate: '2025-12-01',
    doi: '10.1002/term.3218',
    authors: ['Prof. Marcus Vance', 'Dr. Elena Rostova'],
    status: 'Published',
    coverImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'res-8',
    slug: 'nanostructured-bio-active-dressings',
    title: 'Nanostructured Silver-Graphene Bio-Active Dressings for Antimicrobial Wound Regeneration',
    category: 'Nanotechnology',
    abstract:
      'Electro-active nanostructured membranes providing sustained ion release and localized micro-current stimulation.',
    fullDetails:
      'Nanotechnology-enabled dressings combine antimicrobial silver nanoparticles with conductive graphene ribbons to accelerate cell migration via electrical field guiding.',
    publicationDate: '2026-04-12',
    doi: '10.1021/acsnano.6b01429',
    authors: ['Dr. Hiroshi Tanaka', 'Dr. Clara Dupont'],
    status: 'Clinical Trial',
    coverImage: '/images/surgical-team-operating-room.webp',
  },
];
