import type { LocalizedMessages } from '@/i18n/context';

const en = {
  seo: {
    title: 'About Us',
    description:
      "Learn about Tissue Bioengineering's mission, executive team, cleanroom infrastructure, and clinical breakthroughs in stem cell therapies.",
  },
  breadcrumb: 'About Tissue Bioengineering',
  eyebrow: 'Our Mission & Legacy',
  titleBefore: 'Redefining Healing Through ',
  titleAccent: 'Living Tissue Architecture',
  lead: 'Founded by world-renowned reconstructive surgeons and stem cell bioengineers, Tissue Bioengineering bridges fundamental cellular biology with clinical plastic surgery.',
  heroImageAlt: 'Scientist working with cell cultures inside a biosafety cabinet',
  bridgeTitle: 'Bridging the Gap Between Benchtop & Bedside',
  bridgeBody:
    'Traditional reconstructive techniques rely on harvesting donor skin from uninjured body parts, leaving painful donor sites and disfiguring scars. Our tissue bioengineering approach eliminates donor-site morbidity by creating full-thickness skin grafts in 3D bioprinted matrices seeded with autologous stem cells.',
  facts: {
    cleanrooms: { value: 'ISO Class 5', label: 'Sterile Cleanrooms' },
    patents: { value: '18+ Patents', label: 'Bio-ink Innovations' },
  },
  leadership: {
    eyebrow: 'Scientific Leadership',
    title: 'World-Class Bioengineers & Surgeons',
    subtitle:
      'Our multidisciplinary board combines plastic surgery pioneers, microfluidics experts, and stem cell scientists.',
  },
  /** Keyed by the English name (src/pages/About/AboutPage.tsx LEADERSHIP). */
  leaders: {
    thorne: {
      name: 'Dr. Aris Thorne, MD, PhD',
      role: 'Chief Scientific Officer & Co-Founder',
      bio: 'Pioneer in 3D bioprinting micro-vascular networks with over 20 years in plastic surgery innovation.',
    },
    rostova: {
      name: 'Dr. Elena Rostova, PhD',
      role: 'Head of Regenerative Therapeutics',
      bio: 'Specialist in umbilical mesenchymal stem cell paracrine factors and purified exosome delivery.',
    },
    chen: {
      name: 'Dr. Michael Chen, MD',
      role: 'Director of Clinical Surgery',
      bio: 'Leading reconstructive surgeon focused on diabetic lower limb salvage and complex burn care.',
    },
  },
};

const ar: typeof en = {
  seo: {
    title: 'من نحن',
    description:
      'تعرّف على رسالة Tissue Bioengineering وفريقها التنفيذي وبنية غرفها النظيفة وإنجازاتها السريرية في العلاج بالخلايا الجذعية.',
  },
  breadcrumb: 'عن Tissue Bioengineering',
  eyebrow: 'رسالتنا وإرثنا',
  titleBefore: 'نُعيد تعريف الشفاء عبر ',
  titleAccent: 'بنية الأنسجة الحية',
  lead: 'تأسست Tissue Bioengineering على يد نخبة من جرّاحي الترميم ومهندسي الخلايا الجذعية المعروفين عالميًا، لتربط بين علم الأحياء الخلوي الأساسي وجراحة التجميل السريرية.',
  heroImageAlt: 'باحث يعمل على مزارع خلوية داخل خزانة سلامة حيوية',
  bridgeTitle: 'سدّ الفجوة بين المختبر وسرير المريض',
  bridgeBody:
    'تعتمد تقنيات الترميم التقليدية على أخذ الجلد من مناطق سليمة في الجسم، ما يخلّف مواضع مانحة مؤلمة وندبات مشوِّهة. أما نهجنا في الهندسة الحيوية للأنسجة فيُغني عن مضاعفات الموضع المانح، إذ نُنشئ طعومًا جلدية كاملة السماكة ضمن مصفوفات مطبوعة حيويًا بتقنية ثلاثية الأبعاد ومبذورة بخلايا جذعية ذاتية المنشأ.',
  facts: {
    cleanrooms: { value: 'الفئة 5 وفق ISO', label: 'غرف نظيفة معقّمة' },
    patents: { value: '18+ براءة اختراع', label: 'ابتكارات في الأحبار الحيوية' },
  },
  leadership: {
    eyebrow: 'القيادة العلمية',
    title: 'مهندسون حيويون وجرّاحون بمستوى عالمي',
    subtitle:
      'يضم مجلسنا متعدد التخصصات روّادًا في جراحة التجميل، وخبراء في الموائع الدقيقة، وعلماء متخصصين في الخلايا الجذعية.',
  },
  leaders: {
    thorne: {
      name: 'د. آريس ثورن (MD, PhD)',
      role: 'كبير المسؤولين العلميين والشريك المؤسس',
      bio: 'ريادة في الطباعة الحيوية ثلاثية الأبعاد لشبكات الأوعية الدموية الدقيقة، وخبرة تزيد على 20 عامًا في الابتكار بمجال جراحة التجميل.',
    },
    rostova: {
      name: 'د. إيلينا روستوفا (PhD)',
      role: 'رئيس قسم العلاجات التجديدية',
      bio: 'خبرة متخصصة في العوامل نظيرة الصماوية للخلايا الجذعية الوسيطة المشتقة من الحبل السري، وفي توصيل الإكسوسومات المنقّاة.',
    },
    chen: {
      name: 'د. مايكل تشين (MD)',
      role: 'مدير الجراحة السريرية',
      bio: 'خبرة رائدة في جراحة الترميم، مع تركيز على إنقاذ الأطراف السفلية لدى مرضى السكري ورعاية الحروق المعقدة.',
    },
  },
};

export const aboutMessages: LocalizedMessages<typeof en> = { en, ar };
