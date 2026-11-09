import { Technology } from '@/types';

export const technologies: Technology[] = [
  {
    id: 'tech-1',
    title: 'BioMatrix-3D™ Printer System',
    tagline: 'Sub-micron stereolithographic bio-printer with live cell viability control',
    description:
      'State-of-the-art multi-material bioprinter capable of printing up to four bio-ink formulations simultaneously with 98% cell survival rate.',
    specifications: {
      Resolution: '5 Microns',
      'Bio-ink Channels': '4 Independent Nozzles',
      'Temperature Control': '4°C to 42°C active',
      'Sterilization Rating': 'ISO Class 5 Cleanroom',
    },
    applications: ['Full-thickness skin grafts', 'Vascularized bone scaffolds', 'Nerve guidance channels'],
    iconName: 'Printer',
    badge: 'Flagship Hardware',
  },
  {
    id: 'tech-2',
    title: 'ExoPure™ Isolation Bioreactor',
    tagline: 'Tangential flow filtration bioreactor for clinical-grade exosome harvesting',
    description:
      'Automated closed-loop isolation platform that purifies high-potency extracellular vesicles from stem cell conditioned media without shear damage.',
    specifications: {
      Purity: '>99.2% intact exosomes',
      Throughput: '10 Liters / Batch',
      Validation: 'GMP Compliant',
    },
    applications: ['Stem cell therapy', 'Systemic anti-inflammatory infusions', 'Targeted cosmetic hydrogels'],
    iconName: 'Cpu',
    badge: 'GMP Certified',
  },
  {
    id: 'tech-3',
    title: 'SmartScaff-Gel Hydrogel Matrix',
    tagline: 'pH & Temperature responsive extracellular hydrogel scaffold',
    description:
      'Injectable bioactive matrix that polymerizes in situ upon reaching core body temperature, releasing bioactive signals for 30 days.',
    specifications: {
      Gelation: 'Instant at 37°C',
      Degradation: 'Tunable 2 to 12 weeks',
      Biocompatibility: 'Zero Cytotoxicity',
    },
    applications: ['Deep wound beds', 'Facial asymmetry filler', 'Joint cartilage seeding'],
    iconName: 'Layers',
    badge: 'Patented Bio-ink',
  },
];

/**
 * Imagery for each platform on the Technologies page, matched to its subject. Same photos as
 * the Home page's platform rows (TECH_IMAGES in pages/Home/TechnologiesSection.tsx).
 */
export const technologyImages: Record<
  string,
  { src: string; alt: string; width: number; height: number }
> = {
  'tech-1': {
    src: '/images/bioprinting-laboratory.webp',
    alt: 'Researcher operating a 3D bioprinter inside a biosafety cabinet',
    width: 1200,
    height: 800,
  },
  'tech-2': {
    src: '/images/biomedical-research-laboratory.webp',
    alt: 'Biomedical research laboratory with benchtop analytical instruments',
    width: 1200,
    height: 800,
  },
  'tech-3': {
    src: '/images/bioprinted-tissue-well-plate.webp',
    alt: '3D bioprinted hydrogel tissue constructs in a 12-well transwell culture plate',
    width: 659,
    height: 436,
  },
};
