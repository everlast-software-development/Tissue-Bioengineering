import type { LocalizedMessages } from '@/i18n/context';

const en = {
  seo: {
    title: 'Contact Us',
    description:
      'Get in touch with Tissue Bioengineering. Clinical treatments are provided at Everlast Wellness Medical Center, located in Al Bateen, Abu Dhabi, UAE.',
  },
  breadcrumb: 'Contact Us',
  eyebrow: 'Contact Us',
  title: 'Get in Touch with Our Clinical Team',
  lead: 'Whether you have questions regarding patient care, academic research partnerships, or cleanroom facility tours.',
  sectionLabel: 'Contact details and form',
  infoTitle: 'Contact Information',
  infoBody: (provider: string) =>
    `Clinical treatments are provided at ${provider}, located in Al Bateen, Abu Dhabi.`,
  labels: {
    location: 'Treatment Location',
    website: 'Treatment Provider Website',
    phone: 'Main Clinical Line',
    email: 'General Inquiries',
  },
  urgentTitle: 'Urgent Burn / Trauma Hotline',
  urgentBody: 'Emergency transfer team available 24/7 for acute surgical consults:',
};

const ar: typeof en = {
  seo: {
    title: 'تواصل معنا',
    description:
      'تواصل مع Tissue Bioengineering. تُقدَّم العلاجات السريرية في مركز إيفرلاست ويلنس الطبي في منطقة البطين بأبوظبي، الإمارات العربية المتحدة.',
  },
  breadcrumb: 'تواصل معنا',
  eyebrow: 'تواصل معنا',
  title: 'تواصل مع فريقنا السريري',
  lead: 'نسعد بالإجابة عن أسئلتك، سواء تعلّقت برعاية المرضى، أو بالشراكات البحثية الأكاديمية، أو بزيارة مرافق الغرف النظيفة.',
  sectionLabel: 'بيانات التواصل ونموذج المراسلة',
  infoTitle: 'معلومات التواصل',
  infoBody: (provider) => `تُقدَّم العلاجات السريرية في ${provider} في منطقة البطين بأبوظبي.`,
  labels: {
    location: 'موقع العلاج',
    website: 'الموقع الإلكتروني لمقدّم العلاج',
    phone: 'الخط السريري الرئيسي',
    email: 'الاستفسارات العامة',
  },
  urgentTitle: 'الخط الساخن لحالات الحروق والإصابات العاجلة',
  urgentBody:
    'فريق نقل الحالات الطارئة متاح على مدار الساعة طوال أيام الأسبوع للاستشارات الجراحية العاجلة:',
};

export const contactMessages: LocalizedMessages<typeof en> = { en, ar };
