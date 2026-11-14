import type { LocalizedMessages } from '@/i18n/context';

const en = {
  seo: {
    title: 'Services & Bio-Therapies',
    description:
      'Comprehensive regenerative medical services including Burn Scar Bio-Reconstruction, Diabetic Foot Ulcer Grafting, Facial Palsy Nerve Conduits, and Systemic Stem Cell Therapies.',
  },
  breadcrumb: 'Services & Therapies',
  eyebrow: 'Clinical Capabilities',
  /** Title: `titleStart` + `titleKeep` (never split) on line one, `titleAccent` on line two. */
  titleStart: 'Cellular ',
  titleKeep: 'Bio-Therapies',
  titleAccent: '& Grafting',
  lead: 'Explore our specialized reconstructive treatments for burn scars, non-healing diabetic ulcers, facial asymmetry, and wound remodeling.',
  filterLabel: 'Filter therapies by category',
  allLabel: 'All Therapies',
  sectionLabel: 'Therapies',
  keyFeatures: 'Key Features',
  treatmentDuration: 'Treatment Duration',
  recoveryPeriod: 'Recovery Period',
  requestConsultation: 'Request Consultation',
  figure: 'Fig.',
};

const ar: typeof en = {
  seo: {
    title: 'الخدمات والعلاجات الحيوية',
    description:
      'خدمات طبية تجديدية شاملة، تشمل الترميم الحيوي لندبات الحروق، وترقيع قرح القدم السكرية، والقنوات العصبية لعلاج شلل الوجه، والعلاجات الجهازية بالخلايا الجذعية.',
  },
  breadcrumb: 'الخدمات والعلاجات',
  eyebrow: 'قدراتنا السريرية',
  titleStart: 'العلاجات ',
  titleKeep: 'الحيوية الخلوية',
  titleAccent: 'والترقيع',
  lead: 'استكشف علاجاتنا الترميمية المتخصصة لندبات الحروق، وقرح السكري التي لا تلتئم، وعدم تناظر الوجه، وإعادة تشكيل الجروح.',
  filterLabel: 'تصفية العلاجات حسب الفئة',
  allLabel: 'جميع العلاجات',
  sectionLabel: 'العلاجات',
  keyFeatures: 'أبرز الخصائص',
  treatmentDuration: 'مدة العلاج',
  recoveryPeriod: 'فترة التعافي',
  requestConsultation: 'اطلب استشارة',
  figure: 'شكل',
};

export const servicesMessages: LocalizedMessages<typeof en> = { en, ar };
