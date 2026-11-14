import type { LocalizedMessages } from '@/i18n/context';
import type { CaseStudy } from '@/types';

/** The translatable fields of a case study (src/pages/CaseStudies/CaseStudiesPage.tsx). */
type CaseText = Pick<
  CaseStudy,
  | 'title'
  | 'patientInitials'
  | 'duration'
  | 'summary'
  | 'procedure'
  | 'outcome'
  | 'beforeAfterImageAlt'
  | 'attendingSurgeon'
>;

const en = {
  seo: {
    title: 'Clinical Case Studies',
    description:
      'Review documented clinical case reports showcasing rapid wound closure, neck contracture restoration, and diabetic limb salvage.',
  },
  breadcrumb: 'Case Studies',
  eyebrow: 'Evidence-Based Medicine',
  title: 'Documented Clinical Case Reports',
  lead: 'Detailed patient histories, therapeutic procedures, and 100% tissue remodeling outcomes verified by Doppler ultrasound.',
  illustrative: 'Illustrative image · not a patient photograph',
  treatment: 'Treatment:',
  surgeon: 'Attending Surgeon:',
  history: 'Patient History:',
  procedure: 'Bio-Therapeutic Procedure:',
  outcome: 'Clinical Outcome:',
  cases: {
    'cs-1': {
      title: 'Complete Healing of Grade 3 Diabetic Foot Ulcer in 35 Days',
      patientInitials: 'D.M. (Age 61)',
      duration: '5 Weeks',
      summary:
        'A 61-year-old male with a 14-month history of non-healing neuropathic plantar ulcer unresponsive to conventional hyperbaric and debridement therapy.',
      procedure:
        'Application of vascularized ADSC-hydrogel membrane combined with bi-weekly low-level laser bio-stimulation.',
      outcome:
        '100% full-thickness skin closure achieved with neo-vascularization verified by Doppler ultrasound.',
      beforeAfterImageAlt: 'Scientist handling cell culture flasks inside a biosafety cabinet',
      attendingSurgeon: 'Dr. Michael Chen, MD',
    },
    'cs-2': {
      title: 'Functional Range of Motion Restoration in Pediatric Neck Burn Contracture',
      patientInitials: 'K.S. (Age 9)',
      duration: '8 Weeks',
      summary:
        'Severe post-burn hypertrophic neck contracture limiting cervical extension to less than 15 degrees.',
      procedure:
        'Surgical excision of scar tissue followed by immediate grafting of 3D bioprinted autologous skin matrix.',
      outcome:
        'Restoration of 85-degree cervical extension without graft shrinkage or donor site morbidity.',
      beforeAfterImageAlt:
        'Surgical team viewed from the operating table during a reconstructive procedure',
      attendingSurgeon: 'Dr. Aris Thorne, MD, PhD',
    },
  } as Record<'cs-1' | 'cs-2', CaseText>,
};

const ar: typeof en = {
  seo: {
    title: 'دراسات الحالة السريرية',
    description:
      'اطّلع على تقارير حالات سريرية موثّقة تستعرض الالتئام السريع للجروح، واستعادة حركة العنق بعد التقفّع، وإنقاذ الأطراف لدى مرضى السكري.',
  },
  breadcrumb: 'دراسات الحالة',
  eyebrow: 'الطب المبني على الدليل',
  title: 'تقارير حالات سريرية موثّقة',
  lead: 'تواريخ مرضية مفصّلة، وإجراءات علاجية، ونتائج إعادة تشكّل نسيجي بنسبة 100% تحقّق منها تصوير دوبلر بالموجات فوق الصوتية.',
  illustrative: 'صورة توضيحية · ليست صورة لمريض',
  treatment: 'مدة العلاج:',
  surgeon: 'الجرّاح المعالج:',
  history: 'التاريخ المرضي:',
  procedure: 'الإجراء العلاجي الحيوي:',
  outcome: 'النتيجة السريرية:',
  cases: {
    'cs-1': {
      title: 'شفاء تام لقرحة قدم سكرية من الدرجة الثالثة خلال 35 يومًا',
      patientInitials: 'D.M. (العمر 61 عامًا)',
      duration: '5 أسابيع',
      summary:
        'رجل يبلغ من العمر 61 عامًا، يعاني منذ 14 شهرًا قرحةً أخمصية اعتلالية عصبية لا تلتئم، ولم تستجب للعلاج التقليدي بالأكسجين عالي الضغط وتنضير الجرح.',
      procedure:
        'وضع غشاء وعائي من الهلام المائي المحمَّل بالخلايا الجذعية المشتقة من الدهون (ADSC)، مع جلسات تحفيز حيوي بالليزر منخفض الشدة مرتين أسبوعيًا.',
      outcome:
        'تحقّق إغلاق الجلد بكامل سماكته بنسبة 100%، مع تكوّن أوعية دموية جديدة تحقّق منه تصوير دوبلر بالموجات فوق الصوتية.',
      beforeAfterImageAlt: 'باحث يتعامل مع قوارير زراعة الخلايا داخل خزانة سلامة حيوية',
      attendingSurgeon: 'د. مايكل تشين (MD)',
    },
    'cs-2': {
      title: 'استعادة المدى الوظيفي للحركة لدى طفل مصاب بتقفّع في العنق ناتج عن الحروق',
      patientInitials: 'K.S. (العمر 9 سنوات)',
      duration: '8 أسابيع',
      summary: 'تقفّع ضخامي شديد في العنق بعد الحروق، يحدّ من بسط العنق إلى أقل من 15 درجة.',
      procedure:
        'استئصال جراحي للنسيج الندبي، يليه مباشرةً ترقيع بمصفوفة جلدية ذاتية المنشأ مطبوعة حيويًا بتقنية ثلاثية الأبعاد.',
      outcome: 'استعادة بسط العنق حتى 85 درجة، دون انكماش في الطعم أو مضاعفات في الموضع المانح.',
      beforeAfterImageAlt: 'فريق جراحي كما يبدو من طاولة العمليات أثناء إجراء جراحة ترميمية',
      attendingSurgeon: 'د. آريس ثورن (MD, PhD)',
    },
  },
};

export const caseStudiesMessages: LocalizedMessages<typeof en> = { en, ar };
