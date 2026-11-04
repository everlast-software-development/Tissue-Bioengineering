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
