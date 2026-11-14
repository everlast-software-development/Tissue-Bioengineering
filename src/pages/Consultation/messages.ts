import type { LocalizedMessages } from '@/i18n/context';

const en = {
  seo: {
    title: 'Request Clinical Consultation',
    description:
      'Book a confidential clinical evaluation with our tissue bioengineers and plastic surgeons to review burn scar, diabetic foot, or facial asymmetry cases.',
  },
  breadcrumb: 'Request Consultation',
  eyebrow: 'Confidential Case Assessment',
  title: 'Schedule a Specialist Consultation',
  lead: 'Our clinical board evaluates patient records, 3D imaging, and wound histories to recommend custom bio-graft protocols.',
  sectionLabel: 'Consultation request',
  expectTitle: 'What to Expect',
  expectations: {
    review: {
      title: '45-Minute Review:',
      text: 'Comprehensive evaluation with a senior plastic reconstructive surgeon.',
    },
    suitability: {
      title: '3D Bio-Print Suitability:',
      text: 'Assessment of patient autologous cell availability & scaffold design.',
    },
    privacy: {
      title: 'HIPAA Compliant:',
      text: 'Encrypted medical record transmission & patient confidentiality.',
    },
  },
  referralsTitle: 'Physician Referrals',
  referralsBody:
    'Referring plastic surgeons, endocrinologists, and trauma centers can submit patient charts directly via secure portal or phone.',
};

const ar: typeof en = {
  seo: {
    title: 'طلب استشارة سريرية',
    description:
      'احجز تقييمًا سريريًا سرّيًا مع مهندسي الأنسجة الحيوية وجرّاحي التجميل لدينا لمراجعة حالات ندبات الحروق أو القدم السكرية أو عدم تناظر الوجه.',
  },
  breadcrumb: 'طلب استشارة',
  eyebrow: 'تقييم سرّي للحالة',
  title: 'احجز استشارة مع أخصائي',
  lead: 'يقيّم مجلسنا السريري السجلات الطبية للمرضى وصور التصوير ثلاثي الأبعاد وتاريخ الجروح، ليوصي ببروتوكولات طعوم حيوية مخصّصة لكل حالة.',
  sectionLabel: 'طلب الاستشارة',
  expectTitle: 'ماذا تتوقع',
  expectations: {
    review: {
      title: 'مراجعة لمدة 45 دقيقة:',
      text: 'تقييم شامل مع استشاري في جراحة التجميل والترميم.',
    },
    suitability: {
      title: 'مدى الملاءمة للطباعة الحيوية ثلاثية الأبعاد:',
      text: 'تقييم مدى توافر الخلايا الذاتية لدى المريض، وتصميم السقالة المناسبة.',
    },
    privacy: {
      title: 'التوافق مع HIPAA:',
      text: 'نقل مشفّر للسجلات الطبية والحفاظ على سرية بيانات المريض.',
    },
  },
  referralsTitle: 'إحالات الأطباء',
  referralsBody:
    'يمكن لجرّاحي التجميل وأطباء الغدد الصماء ومراكز الإصابات المُحيلين إرسال ملفات المرضى مباشرةً عبر بوابة إلكترونية آمنة أو عبر الهاتف.',
};

export const consultationMessages: LocalizedMessages<typeof en> = { en, ar };
