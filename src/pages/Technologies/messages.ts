import type { LocalizedMessages } from '@/i18n/context';

const en = {
  seo: {
    title: 'Biotech Hardware & Bio-Inks',
    description:
      'Discover our proprietary 3D Bioprinter hardware systems, tangential flow exosome bioreactors, and smart hydrogels.',
  },
  breadcrumb: 'Technologies',
  eyebrow: 'Hardware & Bio-Ink Platforms',
  title: 'Patented Bio-Engineering Platforms',
  lead: 'Engineered systems enabling micron-level tissue bioprinting and clinical-grade exosome harvesting.',
  platformsLabel: 'Platforms',
};

const ar: typeof en = {
  seo: {
    title: 'أجهزة التقنية الحيوية والأحبار الحيوية',
    description:
      'اكتشف أنظمة الطابعات الحيوية ثلاثية الأبعاد التي طوّرناها، ومفاعلاتنا الحيوية لاستخلاص الإكسوسومات بالتدفق المماسي، وهلاماتنا المائية الذكية.',
  },
  breadcrumb: 'التقنيات',
  eyebrow: 'منصات الأجهزة والأحبار الحيوية',
  title: 'منصات هندسة حيوية حاصلة على براءات اختراع',
  lead: 'أنظمة مُهندَسة تتيح طباعة الأنسجة حيويًا بدقة على مستوى الميكرون، واستخلاص الإكسوسومات بجودة سريرية.',
  platformsLabel: 'المنصات',
};

export const technologiesMessages: LocalizedMessages<typeof en> = { en, ar };
