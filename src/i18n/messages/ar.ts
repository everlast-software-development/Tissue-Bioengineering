import type { Messages } from './en';

/** Left-to-right isolate for an email, phone number or URL inside an Arabic sentence. */
const ltr = (s: string) => `⁦${s}⁩`;

const GENERIC_ERROR = 'حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.';
const EMAIL = ltr('info@tissuebioengineering.com');

/** Arabic (Modern Standard Arabic). Same shape as `en`; see the glossary in docs/ARABIC-LOCALIZATION.md. */
export const ar: Messages = {
  site: {
    name: 'الهندسة الحيوية للأنسجة والطب التجديدي',
    description:
      'مؤسسة رائدة في مجال التقنية الحيوية، متخصصة في هندسة الأنسجة المتقدمة والطب التجديدي وأبحاث الخلايا الجذعية وحلول الطعوم المطبوعة حيويًا.',
    keywords:
      'هندسة الأنسجة، الطباعة الحيوية ثلاثية الأبعاد، الطب التجديدي، الخلايا الجذعية، علاج ندبات الحروق، قرحة القدم السكرية',
    logoAlt: 'Tissue Bioengineering',
    providerName: 'مركز إيفرلاست ويلنس الطبي',
    providerAddress: '446 شارع الخليج العربي، البطين، أبوظبي، الإمارات العربية المتحدة',
  },

  common: {
    loading: 'جارٍ تحميل البيانات...',
    bookConsultation: 'احجز استشارة',
    bookConsultationNow: 'احجز استشارتك الآن',
    callHotline: 'اتصل بالخط الساخن:',
    readArticle: 'اقرأ المقال ←',
    learnMore: 'اعرف المزيد',
    opensInNewTab: '(يُفتح في علامة تبويب جديدة)',
    authors: 'المؤلفون:',
    listSeparator: '، ',
    abstract: 'الملخص',
    keyApplications: 'أبرز التطبيقات:',
    tags: 'الوسوم',
    duration: 'المدة:',
    scrollToTop: 'العودة إلى أعلى الصفحة',
    breadcrumb: 'مسار التنقل',
    breadcrumbHome: 'الرئيسية',
  },

  language: {
    switchTo: 'عرض هذه الصفحة باللغة الإنجليزية',
  },

  nav: {
    mainLabel: 'القائمة الرئيسية',
    homeAria: 'Tissue Bioengineering – الصفحة الرئيسية',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    siteMenu: 'قائمة الموقع',
    items: {
      home: { title: 'الرئيسية', description: 'نظرة عامة على المؤسسة' },
      about: { title: 'من نحن', description: 'تاريخنا ورسالتنا' },
      research: { title: 'الأبحاث', description: 'أحدث أعمالنا في هندسة الأنسجة' },
      services: { title: 'الخدمات الأساسية', description: 'المصفوفات الجلدية ورعاية الحروق' },
      articles: { title: 'المقالات', description: 'أوراق سريرية ورؤى علمية' },
      partners: { title: 'الشركاء السريريون', description: 'شبكة المستشفيات الشريكة' },
      contact: { title: 'تواصل معنا', description: 'نسعد بتواصلك معنا' },
    },
  },

  footer: {
    links: {
      home: 'الرئيسية',
      about: 'من نحن',
      services: 'الخدمات',
      research: 'البحث والابتكار',
      technologies: 'التقنيات',
    },
    certBadge: 'غرف نظيفة معتمدة وفق ISO 13485 وGMP',
    navigation: 'روابط الموقع',
    therapies: 'العلاجات',
    contact: 'التواصل',
    treatmentAt: (name, address) => `تُقدَّم العلاجات السريرية في ${name}، ${address}.`,
    scheduleReview: 'احجز مراجعة لحالتك',
    copyright: (year) => `© ${year} Tissue Bioengineering Inc. جميع الحقوق محفوظة.`,
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الرعاية السريرية',
    ethics: 'الأخلاقيات والامتثال',
  },

  categories: {
    service: {
      'Burn Scar Treatment': 'علاج ندبات الحروق',
      'Diabetic Foot': 'القدم السكرية',
      'Wound Healing': 'التئام الجروح',
      'Scar Management': 'علاج الندبات',
      'Facial Palsy': 'شلل الوجه',
      'Facial Asymmetry': 'عدم تناظر الوجه',
      'Regenerative Medicine': 'الطب التجديدي',
    },
    research: {
      '3D Bioprinting': 'الطباعة الحيوية ثلاثية الأبعاد',
      'Stem Cells': 'الخلايا الجذعية',
      'Smart Biomaterials': 'المواد الحيوية الذكية',
      'Gene Editing': 'تحرير الجينات',
      'Organ-on-Chip': 'العضو على رقاقة',
      'Drug Delivery': 'توصيل الأدوية',
      'Tissue Engineering': 'هندسة الأنسجة',
      Nanotechnology: 'تقنية النانو',
    },
    researchStatus: {
      'In Development': 'قيد التطوير',
      'Clinical Trial': 'تجربة سريرية',
      'FDA Approved': 'معتمد من FDA',
      Published: 'منشور',
    },
  },

  cta: {
    eyebrow: 'تقييم الحالة السريرية',
    titleBefore: 'هل أنت مستعد لاستكشاف ',
    titleAccent: 'الترقيع الحيوي الذاتي',
    titleAfter: '؟',
    lead: 'احجز استشارة افتراضية سرّية مع مهندسي الأنسجة الحيوية وجرّاحي التجميل والترميم لدينا لمراجعة حالتك السريرية.',
    imageAlt:
      'صورة بالمجهر الإلكتروني الماسح لسقالة من مادة حيوية ليفية (باللون الأزرق) تغطيها جزئيًا طبقة من الخلايا المستزرعة (باللون الرمادي)',
  },

  notFound: {
    seoTitle: '404 - الصفحة غير موجودة',
    heading: 'الخريطة الخلوية غير موجودة',
    body: 'الصفحة أو المورد السريري الذي طلبته غير موجود، أو نُقل إلى مجال بحثي آخر.',
    home: 'العودة إلى الصفحة الرئيسية',
  },

  articles: {
    author: 'الكاتب',
    published: 'تاريخ النشر',
    readingTime: 'مدة القراءة',
    articleDetails: 'تفاصيل المقال',
    backToArticles: 'المقالات',
    more: 'مقالات أخرى',
  },

  forms: {
    required: 'مطلوب',
    honeypotLabel: 'الموقع الإلكتروني',
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'أدخل اسمك الكامل',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    phone: 'رقم الهاتف',
    phonePlaceholder: 'أدخل رقم هاتفك',
    validation: {
      nameRequired: 'يرجى إدخال اسمك الكامل',
      nameMin: 'يجب ألا يقل الاسم عن حرفين',
      fullNameMin: 'يجب ألا يقل الاسم الكامل عن حرفين',
      emailRequired: 'يرجى إدخال بريدك الإلكتروني',
      emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح',
      phoneRequired: 'يرجى إدخال رقم هاتفك',
      phoneTooShort: 'هذا الرقم أقصر من الطول المعتاد للدولة المحددة',
      phoneInvalid: 'يرجى إدخال رقم هاتف صحيح للدولة المحددة',
      messageRequired: 'يرجى كتابة رسالتك',
      messageMin: 'يجب ألا تقل الرسالة عن 10 أحرف',
      ageRequired: 'يرجى إدخال عمر المريض',
      ageWhole: 'يجب أن يكون العمر عددًا صحيحًا',
      ageInvalid: 'يرجى إدخال عمر صحيح',
      historyMin: 'يرجى كتابة ملخص موجز للتاريخ المرضي (10 أحرف على الأقل)',
      dateRequired: 'يرجى اختيار التاريخ المفضل',
      timeRequired: 'يرجى اختيار الموعد المفضل',
      consentRequired: 'يجب الموافقة على معالجة بياناتك لأغراض الاستشارة الطبية',
    },
    country: {
      selected: (name, code) => `رمز الاتصال الدولي: ${name} +${code}. تغيير الدولة`,
      choose: 'اختر رمز الاتصال الدولي',
      dialog: 'اختيار الدولة',
      search: 'ابحث عن الدولة بالاسم أو برمز الاتصال',
      searchPlaceholder: 'ابحث باسم الدولة أو الرمز',
      list: 'الدول',
      noMatch: (query) => `لا توجد دولة تطابق «${query}».`,
    },
    contact: {
      message: 'الرسالة',
      messagePlaceholder: 'أخبرنا كيف يمكننا مساعدتك...',
      success: 'شكرًا لتواصلك معنا! سيردّ عليك فريقنا خلال 24 ساعة.',
      submit: 'إرسال الرسالة',
    },
    consultation: {
      age: 'عمر المريض',
      agePlaceholder: 'أدخل العمر',
      therapyArea: 'مجال العلاج',
      history: 'ملخص التاريخ المرضي',
      historyHint:
        'صِف الحالة باختصار (إصابة بحروق، أو قرحة سكرية، أو نسيج ندبي، أو شلل في الوجه)، ومنذ متى بدأت، وأي علاج سابق تلقّاه المريض.',
      historyPlaceholder: 'صِف حالة المريض...',
      date: 'التاريخ المفضل',
      time: 'الموعد المفضل',
      timeSlots: {
        '09:00 AM': '09:00 صباحًا بتوقيت EST',
        '11:30 AM': '11:30 صباحًا بتوقيت EST',
        '02:00 PM': '02:00 مساءً بتوقيت EST',
        '04:30 PM': '04:30 مساءً بتوقيت EST',
      },
      consent:
        'أوافق على أن تعالج Tissue Bioengineering بياناتي الطبية المقدَّمة في هذا النموذج بسرية تامة وفق إرشادات HIPAA.',
      submit: 'إرسال طلب الاستشارة',
      successTitle: 'تم استلام طلبك!',
      successFallback: 'تم إرسال طلب الاستشارة بنجاح.',
      another: 'إرسال طلب آخر',
    },
    serverMessages: {
      // server/index.ts
      'Please check the highlighted fields and try again.':
        'يرجى مراجعة الحقول المحددة ثم المحاولة مرة أخرى.',
      'The request could not be read. Please refresh the page and try again.':
        'تعذّرت قراءة الطلب. يرجى تحديث الصفحة والمحاولة مرة أخرى.',
      'The submission is too large. Please shorten your message and try again.':
        'حجم البيانات المرسلة كبير جدًا. يرجى اختصار رسالتك ثم المحاولة مرة أخرى.',
      'Too many submissions from this connection. Please wait a few minutes and try again.':
        'أُرسل عدد كبير من الطلبات من هذا الاتصال. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.',
      'Our contact service is temporarily unavailable. Please email info@tissuebioengineering.com directly.': `خدمة التواصل غير متاحة مؤقتًا. يرجى مراسلتنا مباشرة على ${EMAIL}.`,
      'We could not send your message right now. Please try again in a few minutes or email info@tissuebioengineering.com directly.': `تعذّر إرسال رسالتك حاليًا. يرجى المحاولة مرة أخرى بعد بضع دقائق، أو مراسلتنا مباشرة على ${EMAIL}.`,
      'Something went wrong on our side. Please try again later.':
        'حدث خطأ من جانبنا. يرجى المحاولة مرة أخرى لاحقًا.',
      'Not found.': 'المورد المطلوب غير موجود.',
      // server/forms.ts (field messages with fixed wording; the rest use serverFieldFallback)
      'Please enter a valid email address': 'يرجى إدخال بريد إلكتروني صحيح',
      'Please enter a valid phone number': 'يرجى إدخال رقم هاتف صحيح',
      'Please choose a therapy area': 'يرجى اختيار مجال العلاج',
      'You must consent to data processing for medical consultation':
        'يجب الموافقة على معالجة بياناتك لأغراض الاستشارة الطبية',
      'Age must be a number': 'يجب أن يكون العمر رقمًا',
      'Age must be a whole number': 'يجب أن يكون العمر عددًا صحيحًا',
      'Age is required': 'يرجى إدخال عمر المريض',
      'Invalid age': 'يرجى إدخال عمر صحيح',
      'Preferred date must be a calendar date': 'يرجى اختيار تاريخ صحيح',
      // server/forms.ts (success messages)
      'Message sent successfully. Thank you for reaching out to Tissue Bioengineering.':
        'تم إرسال رسالتك بنجاح. شكرًا لتواصلك مع Tissue Bioengineering.',
      'Consultation request submitted successfully. Our clinical team will reach out within 24 hours.':
        'تم إرسال طلب الاستشارة بنجاح. سيتواصل معك فريقنا السريري خلال 24 ساعة.',
      // src/lib/api.ts
      'We could not reach the server. Please check your connection and try again.':
        'تعذّر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت ثم المحاولة مرة أخرى.',
      'Something went wrong while sending your request. Please try again.': GENERIC_ERROR,
    },
    serverFallback: GENERIC_ERROR,
    serverFieldFallback: 'يرجى التحقق من صحة هذا الحقل.',
  },
};
