import type { LocalizedMessages } from '@/i18n/context';

const en = {
  seo: {
    title: 'Research & Innovation',
    description:
      'Peer-reviewed publications, patent portfolios, and breakthrough clinical trials across 3D Bioprinting, Stem Cells, Smart Biomaterials, Gene Editing, Organ-on-Chip, Drug Delivery, Tissue Engineering, and Nanotechnology.',
  },
  breadcrumb: 'Research & Innovation',
  eyebrow: '8 Core Research Pillars',
  title: 'Scientific Research & Discovery',
  lead: 'Advancing the boundaries of regenerative medicine through bio-printing, organ-on-chip models, and precision nanomedicine.',
  sectionLabel: 'Publications',
  filterLabel: 'Filter research by domain',
  allLabel: (count: number) => `All Research (${count})`,
  allHeading: 'All Research',
};

const ar: typeof en = {
  seo: {
    title: 'البحث والابتكار',
    description:
      'منشورات علمية محكَّمة، ومحافظ براءات اختراع، وتجارب سريرية رائدة في مجالات الطباعة الحيوية ثلاثية الأبعاد، والخلايا الجذعية، والمواد الحيوية الذكية، وتحرير الجينات، والعضو على رقاقة، وتوصيل الأدوية، وهندسة الأنسجة، وتقنية النانو.',
  },
  breadcrumb: 'البحث والابتكار',
  eyebrow: 'ثماني ركائز بحثية أساسية',
  title: 'البحث العلمي والاكتشاف',
  lead: 'نوسّع آفاق الطب التجديدي من خلال الطباعة الحيوية، ونماذج العضو على رقاقة، والطب النانوي الدقيق.',
  sectionLabel: 'المنشورات',
  filterLabel: 'تصفية الأبحاث حسب المجال',
  allLabel: (count) => `جميع الأبحاث (${count})`,
  allHeading: 'جميع الأبحاث',
};

export const researchMessages: LocalizedMessages<typeof en> = { en, ar };
