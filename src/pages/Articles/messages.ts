import type { LocalizedMessages } from '@/i18n/context';

const en = {
  seo: {
    title: 'Articles & Biotech Insights',
    description:
      'Latest clinical updates, whitepapers, and scientific articles on tissue engineering, wound care, and stem cell advancements.',
  },
  breadcrumb: 'Articles & Blog',
  eyebrow: 'Biotech Knowledge Hub',
  titleBefore: 'Scientific Articles & ',
  titleAccent: 'Clinical Notes',
  lead: 'Clinical insights and patient guides on regenerative medicine, tissue engineering and wound care.',
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
  titleBefore: 'مقالات علمية ',
  titleAccent: 'وملاحظات سريرية',
  lead: 'رؤى سريرية وأدلة للمرضى في الطب التجديدي وهندسة الأنسجة والعناية بالجروح.',
  sectionLabel: 'المقالات',
};

export const articlesMessages: LocalizedMessages<typeof en> = { en, ar };
