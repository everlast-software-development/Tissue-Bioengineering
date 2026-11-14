import type { LocalizedMessages } from '@/i18n/context';

const en = {
  seo: {
    title: 'Articles & Biotech Insights',
    description:
      'Latest clinical updates, whitepapers, and scientific articles on tissue engineering, wound care, and stem cell advancements.',
  },
  breadcrumb: 'Articles & Blog',
  eyebrow: 'Biotech Knowledge Hub',
  title: 'Scientific Articles & Clinical Notes',
  lead: 'In-depth analysis of 3D bioprinting trends, stem cell exosome therapies, and wound closure innovations.',
  sectionLabel: 'Articles',
};

const ar: typeof en = {
  seo: {
    title: 'المقالات ورؤى التقنية الحيوية',
    description:
      'أحدث المستجدات السريرية والأوراق البيضاء والمقالات العلمية حول هندسة الأنسجة والعناية بالجروح وتطورات أبحاث الخلايا الجذعية.',
  },
  breadcrumb: 'المقالات والمدونة',
  eyebrow: 'مركز المعرفة في التقنية الحيوية',
  title: 'مقالات علمية وملاحظات سريرية',
  lead: 'تحليلات معمّقة لاتجاهات الطباعة الحيوية ثلاثية الأبعاد، وعلاجات إكسوسومات الخلايا الجذعية، والابتكارات في إغلاق الجروح.',
  sectionLabel: 'المقالات',
};

export const articlesMessages: LocalizedMessages<typeof en> = { en, ar };
