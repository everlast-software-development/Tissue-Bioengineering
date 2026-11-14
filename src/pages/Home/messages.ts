import type { LocalizedMessages } from '@/i18n/context';

/**
 * Home page copy, one entry per section. Collections are keyed by the id used in the section's
 * component, which keeps the non-text data (images, icons, links, order).
 */
const en = {
  seo: {
    title: 'Home | Pioneer in Bio-Grafting & 3D Bioprinting',
    description:
      'Leading Tissue Bioengineering and Regenerative Medicine institution specializing in Burn Scar Treatment, Diabetic Foot Ulcers, Facial Palsy, and 3D Bioprinted Skin Matrices.',
  },

  hero: {
    titleLine1: 'Tissue',
    titleLine2: 'Bioengineering',
    lead: 'Advancing regenerative medicine through tissue engineering, biomaterials, stem cell technologies, and personalized regenerative therapies.',
    exploreResearch: 'Explore Research',
    ourServices: 'Our Services',
    tickerLabel: 'Areas of focus',
    ticker: [
      'Skin Regeneration',
      'Biomaterial Scaffolds',
      'Stem Cell Therapy',
      '3D Bioprinting',
      'Cartilage Repair',
      'Bone Regeneration',
      'Burn Reconstruction',
      'Chronic Wound Healing',
      'Facial Tissue Engineering',
      'Personalized Regenerative Medicine',
      'Extracellular Matrix (ECM)',
      'Collagen Engineering',
      'Advanced Biomaterials',
      'Tissue Engineering',
    ],
  },

  explore: {
    sectionLabel: 'Explore Tissue Bioengineering',
    eyebrow: 'Explore Our Institute',
    title: 'Discover What We Offer',
    subtitle:
      'World-class tissue bioengineering services, cutting-edge research, and clinical excellence — all under one roof.',
    cards: {
      services: {
        title: 'Core Services',
        description: 'Empowering Solutions for Your Success.',
        buttonLabel: 'Explore Services',
      },
      research: {
        title: 'Our Researches',
        description: "Innovative Research Driving Tomorrow's Solutions.",
        buttonLabel: 'Explore Research',
      },
      articles: {
        title: 'Explore Articles',
        description: 'Discover Insights, Expand Knowledge.',
        buttonLabel: 'Read Articles',
      },
      about: {
        title: 'About Tissue Bioengineering',
        description: 'Dermatological and Anti-Aging Specialists.',
        buttonLabel: 'Learn More',
      },
    },
  },

  coreServices: {
    eyebrow: 'Medical Innovation',
    title: 'Our Core Services',
    subtitle:
      'Pioneering regenerative treatments across the spectrum of complex tissue reconstruction and aesthetic restoration.',
    items: {
      'burn-scar': {
        title: 'Burn Scar Complications',
        description:
          'Advanced autologous skin tissue engineering and cellular matrix deposition for complex burn scar reconstruction. Our approach eliminates donor-site morbidity by creating full-thickness skin grafts in 3D bioprinted matrices.',
        ctaText: 'Book Consultation',
        imageAlt:
          'Illustration of a porous biomaterial scaffold with cells and a layered skin surface forming over it',
      },
      'diabetic-foot': {
        title: 'Diabetic Foot',
        description:
          'Advanced tissue-engineering approaches designed to support healing in chronic, non-healing diabetic lower-limb ulcers using pro-angiogenic growth factor release.',
        ctaText: 'Learn More',
        imageAlt: 'Physician examining the foot of a patient with diabetes',
      },
      'wound-healing': {
        title: 'Wound Healing',
        description:
          'Bio-interactive biomaterial systems engineered to support accelerated acute and trauma wound remodeling with pH-responsive drug release and electrospun nanofiber scaffolding.',
        ctaText: 'Learn More',
        imageAlt:
          'Scanning electron micrograph of a fiber-based biomaterial scaffold (blue) partly covered by a cultured cell layer (gray)',
      },
      'scar-management': {
        title: 'Scar Management',
        description:
          'Advanced regenerative approaches targeting abnormal scar tissue remodeling and fibrotic tissue formation through targeted TGF-beta pathway inhibition.',
        ctaText: 'Learn More',
        imageAlt:
          'Histology of keloid scar tissue showing thick, disorganized collagen bundles beneath the epidermis',
      },
      'facial-palsy': {
        title: 'Facial Palsy',
        description:
          'Advanced nerve-guidance and regenerative strategies designed to support facial nerve reconstruction and muscle re-innervation using conductive nerve guidance conduits.',
        ctaText: 'Learn More',
        imageAlt: 'Light micrograph of teased peripheral nerve fibers',
      },
      vitiligo: {
        title: 'Vitiligo',
        description:
          'Next-generation regenerative approaches using mesenchymal stem-cell and exosome-based technologies to restore pigmentation and cellular balance.',
        ctaText: 'Learn More',
        imageAlt: 'Scientist handling cell culture flasks inside a biosafety cabinet',
      },
    },
  },

  clinical: {
    eyebrow: 'Clinical Applications',
    title: 'Advanced Regenerative Therapies',
    subtitle:
      'Precision bio-engineering solutions for complex wounds, tissue regeneration, facial reconstruction, scar remodeling, and advanced regenerative medicine.',
    explore: 'Explore Therapy',
    cases: {
      'case-1': {
        title: 'Advanced Burn Scar Bio-Reconstruction',
        category: 'Burn Scar Treatment',
        description:
          'Autologous skin tissue engineering and cellular matrix deposition for complex burn scar reconstruction.',
        technologies: ['Autologous cell seeding', '3D extracellular matrix synthesis'],
        duration: '3 - 6 Weeks',
        alt: '3D bioprinted tissue constructs in a 12-well transwell culture plate',
      },
      'case-2': {
        title: 'Diabetic Foot Ulcer Tissue Grafting',
        category: 'Diabetic Foot',
        description:
          'Advanced tissue-engineering approaches designed to support healing in chronic, non-healing diabetic lower-limb ulcers.',
        technologies: ['Pro-angiogenic growth factor release', 'ADSC cell matrix infusion'],
        duration: '2 - 4 Weeks',
        alt: 'Physician examining the foot of a patient with diabetes',
      },
      'case-3': {
        title: 'Smart Biomaterial Wound Matrix',
        category: 'Wound Healing',
        description:
          'Bio-interactive biomaterial systems engineered to support accelerated acute and trauma wound remodeling.',
        technologies: ['pH-responsive drug release', 'Electrospun nanofiber scaffolding'],
        duration: '1 - 3 Weeks',
        alt: 'Scanning electron micrograph of a fiber-based biomaterial scaffold (blue) partly covered by a cultured cell layer (gray)',
      },
      'case-4': {
        title: 'Keloid & Hypertrophic Scar Remodeling',
        category: 'Scar Management',
        description:
          'Advanced regenerative approaches targeting abnormal scar tissue remodeling and fibrotic tissue formation.',
        technologies: ['Targeted TGF-beta pathway inhibition', 'Enzymatic collagen degradation'],
        duration: '4 - 8 Sessions',
        alt: 'Histology of keloid scar tissue showing thick, disorganized collagen bundles beneath the epidermis',
      },
      'case-5': {
        title: 'Bio-Engineered Facial Nerve Regeneration',
        category: 'Facial Palsy',
        description:
          'Advanced nerve-guidance and regenerative strategies designed to support facial nerve reconstruction and muscle re-innervation.',
        technologies: ['Conductive nerve guidance conduits', 'Schwann cell supportive matrix'],
        duration: 'Surgical Placement + 6 Months Therapy',
        alt: 'Light micrograph of teased peripheral nerve fibers',
      },
      'case-6': {
        title: '3D Bioprinted Craniofacial Osteo-Grafts',
        category: 'Facial Asymmetry',
        description:
          'Custom anatomical 3D bio-engineered constructs designed for craniofacial contour and tissue reconstruction.',
        technologies: [
          'CT-scan accurate 3D CAD modeling',
          'Biphasic bone and cartilage bioprinting',
        ],
        duration: 'Single Surgical Grafting',
        alt: 'Transparent anatomical skull model showing craniofacial bone structure',
      },
      'case-7': {
        title: 'Systemic Stem Cell & Exosome Therapy',
        category: 'Regenerative Medicine',
        description:
          'Next-generation regenerative approaches using mesenchymal stem-cell and exosome-based technologies.',
        technologies: [
          'High-purity umbilical cord MSC exosomes',
          'Immune-evasive cellular formulations',
        ],
        duration: 'Outpatient Infusion Protocol',
        alt: 'Scientist handling cell culture flasks inside a biosafety cabinet',
      },
      'case-8': {
        title: '3D Bioprinted Skin Reconstruction',
        category: 'Tissue Engineering',
        description:
          'Advanced 3D bioprinting approaches for engineering skin-equivalent tissue structures for complex tissue reconstruction.',
        technologies: ['3D bioprinted skin scaffolds', 'Bioactive cellular matrices'],
        duration: 'Custom Treatment Protocol',
        alt: 'Researcher operating a 3D bioprinter inside a biosafety cabinet',
      },
      'case-9': {
        title: 'Advanced Facial Tissue Regeneration',
        category: 'Facial Reconstruction',
        description:
          'Precision tissue-engineering strategies designed for complex facial tissue defects, asymmetry, and regenerative reconstruction.',
        technologies: ['Customized biomaterial scaffolds', 'Cell-based tissue regeneration'],
        duration: 'Custom Treatment Protocol',
        alt: 'Illustration of a porous biomaterial scaffold for tissue regeneration',
      },
    },
  },

  why: {
    eyebrow: 'Scientific Excellence',
    title: 'Why Tissue Bioengineering Leads',
    subtitle:
      'Combining advanced microfluidics, stem cell engineering, and custom bio-printing to set new global standards in plastic & regenerative surgery.',
    reasons: {
      autology: {
        title: 'Patient-Derived Cellular Autology',
        description:
          'We harvest and expand the patient’s own stem cells to construct personalized tissue grafts, eliminating organ rejection risks and immune suppressants.',
      },
      precision: {
        title: '5-Micron 3D Bio-Printing Precision',
        description:
          'Our proprietary stereolithographic bioprinters reproduce microscopic vascular capillary networks essential for tissue survival.',
      },
      cleanrooms: {
        title: 'GMP & ISO 13485 Certified Cleanrooms',
        description:
          'All bio-ink compounding and cellular scaffold processing occurs within ISO Class 5 sterile medical cleanrooms adhering to FDA standards.',
      },
      angiogenesis: {
        title: 'Rapid Angiogenesis & Closure Rates',
        description:
          'Bio-active matrix formulations release pro-angiogenic factors, reducing deep wound closure timelines by up to 50%.',
      },
    },
  },

  research: {
    eyebrow: 'Scientific Frontier',
    title: 'Research & Clinical Innovations',
    subtitle:
      'Pioneering peer-reviewed discoveries across 3D Bioprinting, iPSC Stem Cells, Gene Editing, and Organ-on-Chip technology.',
    viewAll: 'View All 8 Research Domains',
  },

  technologies: {
    eyebrow: 'Proprietary Tech',
    title: 'Engineered Hardware & Biomaterials',
    subtitle:
      'Next-generation bioprinters, exosome bioreactors, and shear-thinning hydrogel platforms.',
  },

  process: {
    eyebrow: 'Clinical Journey',
    title: 'The 4-Step Bio-Grafting Process',
    subtitle:
      'From initial cellular harvest to 3D bio-printing and vascularized tissue integration.',
    steps: [
      {
        title: '3D Scan & Cell Biopsy',
        description:
          'High-resolution laser 3D scanning of the defect site paired with a 2mm skin punch biopsy to isolate autologous stem cells.',
        duration: 'Day 1',
      },
      {
        title: 'Cell Expansion & Bio-Ink Formulation',
        description:
          'Culturing patient fibroblasts and endothelial cells inside ISO cleanroom bioreactors for bio-ink compounding.',
        duration: 'Days 2 - 10',
      },
      {
        title: '3D Bioprinting Scaffolding',
        description:
          'Stereolithographic 3D printing of custom vascularized living tissue grafts matched precisely to CT anatomy.',
        duration: 'Day 11',
      },
      {
        title: 'Clinical Graft Placement & Remodeling',
        description:
          'Minimally invasive graft placement by surgical specialists, followed by rapid microvascular integration.',
        duration: 'Weeks 2 - 6',
      },
    ],
  },

  stats: {
    eyebrow: 'Clinical Milestones',
    title: 'Validated by Clinical Excellence',
    subtitle:
      'Proven autologous cell compliance, zero rejection rates, and accelerated wound recovery.',
    items: {
      grafts: {
        label: 'Successful Bio-Grafts',
        description: 'Living tissue matrix grafts implanted across burn, trauma, and ulcer cases.',
      },
      rejection: {
        label: 'Zero Graft Rejection',
        description: 'Immune compliance rate achieved via autologous stem cell harvesting.',
      },
      closure: {
        label: 'Clinical Closure Speed',
        description: 'Accelerated microvascular formation compared to conventional dressings.',
      },
      inks: {
        label: 'Patented Bio-Inks',
        description:
          'Proprietary extracellular formulations protected under international patents.',
      },
    },
  },

  articles: {
    eyebrow: 'Scientific Insights',
    title: 'Featured Biotech Publications',
    subtitle:
      'Articles, whitepapers, and clinical updates authored by our leading tissue bioengineers.',
  },

  testimonials: {
    eyebrow: 'Clinical Success',
    title: 'Patient Recovery Stories',
    subtitle:
      'Real testimonials from patients whose lives were transformed by living tissue bio-grafts.',
    tablistLabel: 'Patient stories',
    openQuote: '“',
    closeQuote: '”',
    rated: (value: number) => `Rated ${value} out of 5`,
    items: {
      't-1': {
        patientName: 'Eleanor Vance',
        quote:
          'Following my severe burn injury, traditional skin grafts left tight, painful contractures. The 3D bioprinted autologous graft from Tissue Bioengineering restored both mobility and my skin’s natural appearance.',
      },
      't-2': {
        patientName: 'Robert Martinez',
        quote:
          'I was facing amputation due to a chronic diabetic ulcer that hadn’t closed in 14 months. Their stem-cell bio-membrane therapy healed the wound completely in just 5 weeks.',
      },
      't-3': {
        patientName: 'Sophia Lin',
        quote:
          'The bio-engineered nerve conduit procedure restored nerve function and facial muscle control after years of palsy. The care and scientific expertise were world-class.',
      },
    },
  },

  faq: {
    eyebrow: 'Frequently Asked Questions',
    title: 'Clinical & Scientific Clarifications',
    subtitle:
      'Everything you need to know about our autologous cell harvesting, 3D bioprinting process, and consultation protocols.',
    items: [
      {
        id: 'faq-1',
        question: 'How does autologous 3D bioprinting prevent graft rejection?',
        answer:
          'Because the bio-ink is formulated using the patient’s own skin fibroblasts and stem cells isolated via punch biopsy, the immune system recognizes the grafted tissue as self-tissue, completely bypassing organ rejection.',
      },
      {
        id: 'faq-2',
        question: 'What is the recovery timeframe for diabetic ulcer tissue grafting?',
        answer:
          'Most chronic non-healing diabetic foot ulcers achieve significant re-vascularization within 14 days and complete full-thickness wound closure within 3 to 5 weeks.',
      },
      {
        id: 'faq-3',
        question: 'Are treatments covered by medical insurance or clinical trial funds?',
        answer:
          'Many of our FDA-approved autologous therapies are covered under major health insurance plans, while experimental bio-printing protocols are sponsored through IRB clinical trial grants.',
      },
      {
        id: 'faq-4',
        question: 'Can 3D bioprinted cartilage restore severe facial asymmetry?',
        answer:
          'Yes, by utilizing high-resolution 3D CT scans, our bio-engineers construct patient-specific osteo-chondral scaffolds that permanently restore natural craniofacial symmetry without donor-site surgical trauma.',
      },
    ],
  },
};

const ar: typeof en = {
  seo: {
    title: 'الرئيسية | رواد الترقيع الحيوي والطباعة الحيوية ثلاثية الأبعاد',
    description:
      'مؤسسة رائدة في الهندسة الحيوية للأنسجة والطب التجديدي، متخصصة في علاج ندبات الحروق وقرح القدم السكرية وشلل الوجه، وفي المصفوفات الجلدية المطبوعة حيويًا بتقنية ثلاثية الأبعاد.',
  },

  hero: {
    titleLine1: 'الهندسة الحيوية',
    titleLine2: 'للأنسجة',
    lead: 'نرتقي بالطب التجديدي من خلال هندسة الأنسجة والمواد الحيوية وتقنيات الخلايا الجذعية والعلاجات التجديدية المخصّصة لكل مريض.',
    exploreResearch: 'استكشف أبحاثنا',
    ourServices: 'خدماتنا',
    tickerLabel: 'مجالات التركيز',
    ticker: [
      'تجديد الجلد',
      'سقالات المواد الحيوية',
      'العلاج بالخلايا الجذعية',
      'الطباعة الحيوية ثلاثية الأبعاد',
      'إصلاح الغضاريف',
      'تجديد العظام',
      'ترميم الحروق',
      'التئام الجروح المزمنة',
      'هندسة أنسجة الوجه',
      'الطب التجديدي المخصّص',
      'المصفوفة خارج الخلوية (ECM)',
      'هندسة الكولاجين',
      'المواد الحيوية المتقدمة',
      'هندسة الأنسجة',
    ],
  },

  explore: {
    sectionLabel: 'استكشف Tissue Bioengineering',
    eyebrow: 'تعرّف على مؤسستنا',
    title: 'اكتشف ما نقدّمه',
    subtitle:
      'خدمات عالمية المستوى في الهندسة الحيوية للأنسجة، وأبحاث رائدة، وتميّز سريري — كل ذلك تحت سقف واحد.',
    cards: {
      services: {
        title: 'الخدمات الأساسية',
        description: 'حلول فعّالة تُمهّد لنجاحك.',
        buttonLabel: 'استكشف الخدمات',
      },
      research: {
        title: 'أبحاثنا',
        description: 'أبحاث مبتكرة تصنع حلول الغد.',
        buttonLabel: 'استكشف الأبحاث',
      },
      articles: {
        title: 'تصفّح المقالات',
        description: 'اكتشف رؤى جديدة ووسّع معرفتك.',
        buttonLabel: 'اقرأ المقالات',
      },
      about: {
        title: 'عن Tissue Bioengineering',
        description: 'متخصصون في الأمراض الجلدية ومكافحة الشيخوخة.',
        buttonLabel: 'اعرف المزيد',
      },
    },
  },

  coreServices: {
    eyebrow: 'ابتكار طبي',
    title: 'خدماتنا الأساسية',
    subtitle:
      'علاجات تجديدية رائدة تغطي الطيف الكامل لترميم الأنسجة المعقدة واستعادة المظهر الجمالي.',
    items: {
      'burn-scar': {
        title: 'مضاعفات ندبات الحروق',
        description:
          'هندسة متقدمة لأنسجة جلدية ذاتية المنشأ وترسيب مصفوفة خلوية لترميم ندبات الحروق المعقدة. ويُغني نهجنا عن مضاعفات الموضع المانح، إذ نُنشئ طعومًا جلدية كاملة السماكة ضمن مصفوفات مطبوعة حيويًا بتقنية ثلاثية الأبعاد.',
        ctaText: 'احجز استشارة',
        imageAlt:
          'رسم توضيحي لسقالة مسامية من مادة حيوية تحمل خلايا، وتتكوّن فوقها طبقات من سطح الجلد',
      },
      'diabetic-foot': {
        title: 'القدم السكرية',
        description:
          'أساليب متقدمة في هندسة الأنسجة صُمِّمت لدعم التئام قرح الأطراف السفلية السكرية المزمنة التي لا تلتئم، عبر إطلاق عوامل نمو محفِّزة لتكوّن الأوعية الدموية.',
        ctaText: 'اعرف المزيد',
        imageAlt: 'طبيب يفحص قدم مريض مصاب بالسكري',
      },
      'wound-healing': {
        title: 'التئام الجروح',
        description:
          'أنظمة من المواد الحيوية التفاعلية صُمِّمت لدعم الإسراع في إعادة تشكّل الجروح الحادة والجروح الناتجة عن الإصابات، بفضل إطلاق دوائي يستجيب لدرجة الحموضة (pH) وسقالات من ألياف نانوية مغزولة كهربائيًا.',
        ctaText: 'اعرف المزيد',
        imageAlt:
          'صورة بالمجهر الإلكتروني الماسح لسقالة من مادة حيوية ليفية (باللون الأزرق) تغطيها جزئيًا طبقة من الخلايا المستزرعة (باللون الرمادي)',
      },
      'scar-management': {
        title: 'علاج الندبات',
        description:
          'أساليب تجديدية متقدمة تستهدف إعادة التشكّل غير الطبيعية للنسيج الندبي وتكوّن النسيج الليفي، من خلال التثبيط الموجَّه لمسار عامل النمو المحوِّل بيتا (TGF-β).',
        ctaText: 'اعرف المزيد',
        imageAlt:
          'مقطع نسيجي لنسيج ندبة جُدرية يُظهر حزمًا كولاجينية سميكة وغير منتظمة أسفل البشرة',
      },
      'facial-palsy': {
        title: 'شلل الوجه',
        description:
          'استراتيجيات متقدمة لتوجيه الأعصاب وتجديدها، صُمِّمت لدعم ترميم العصب الوجهي وإعادة تعصيب العضلات باستخدام قنوات موصِّلة لتوجيه الأعصاب.',
        ctaText: 'اعرف المزيد',
        imageAlt: 'صورة بالمجهر الضوئي لألياف عصبية طرفية مُفرَّقة',
      },
      vitiligo: {
        title: 'البهاق',
        description:
          'أساليب تجديدية من الجيل الجديد تعتمد على تقنيات الخلايا الجذعية الوسيطة والإكسوسومات لاستعادة تصبّغ الجلد والتوازن الخلوي.',
        ctaText: 'اعرف المزيد',
        imageAlt: 'باحث يتعامل مع قوارير زراعة الخلايا داخل خزانة سلامة حيوية',
      },
    },
  },

  clinical: {
    eyebrow: 'التطبيقات السريرية',
    title: 'علاجات تجديدية متقدمة',
    subtitle:
      'حلول دقيقة في الهندسة الحيوية للجروح المعقدة وتجديد الأنسجة وترميم الوجه وإعادة تشكيل الندبات والطب التجديدي المتقدم.',
    explore: 'استكشف العلاج',
    cases: {
      'case-1': {
        title: 'الترميم الحيوي المتقدم لندبات الحروق',
        category: 'علاج ندبات الحروق',
        description:
          'هندسة أنسجة جلدية ذاتية المنشأ وترسيب مصفوفة خلوية لترميم ندبات الحروق المعقدة.',
        technologies: ['بذر خلايا ذاتية المنشأ', 'تخليق مصفوفة خارج خلوية ثلاثية الأبعاد'],
        duration: 'من 3 إلى 6 أسابيع',
        alt: 'تراكيب نسيجية مطبوعة حيويًا بتقنية ثلاثية الأبعاد في طبق استزراع من نوع Transwell ذي 12 بئرًا',
      },
      'case-2': {
        title: 'ترقيع الأنسجة لقرح القدم السكرية',
        category: 'القدم السكرية',
        description:
          'أساليب متقدمة في هندسة الأنسجة صُمِّمت لدعم التئام قرح الأطراف السفلية السكرية المزمنة التي لا تلتئم.',
        technologies: [
          'إطلاق عوامل نمو محفِّزة لتكوّن الأوعية الدموية',
          'تسريب مصفوفة خلوية من خلايا ADSC',
        ],
        duration: 'من 2 إلى 4 أسابيع',
        alt: 'طبيب يفحص قدم مريض مصاب بالسكري',
      },
      'case-3': {
        title: 'مصفوفة الجروح من المواد الحيوية الذكية',
        category: 'التئام الجروح',
        description:
          'أنظمة من المواد الحيوية التفاعلية صُمِّمت لدعم الإسراع في إعادة تشكّل الجروح الحادة والجروح الناتجة عن الإصابات.',
        technologies: [
          'إطلاق دوائي يستجيب لدرجة الحموضة (pH)',
          'سقالات من ألياف نانوية مغزولة كهربائيًا',
        ],
        duration: 'من أسبوع إلى 3 أسابيع',
        alt: 'صورة بالمجهر الإلكتروني الماسح لسقالة من مادة حيوية ليفية (باللون الأزرق) تغطيها جزئيًا طبقة من الخلايا المستزرعة (باللون الرمادي)',
      },
      'case-4': {
        title: 'إعادة تشكيل الجُدرات والندبات الضخامية',
        category: 'علاج الندبات',
        description:
          'أساليب تجديدية متقدمة تستهدف إعادة التشكّل غير الطبيعية للنسيج الندبي وتكوّن النسيج الليفي.',
        technologies: ['تثبيط موجَّه لمسار TGF-β', 'تفكيك إنزيمي للكولاجين'],
        duration: 'من 4 إلى 8 جلسات',
        alt: 'مقطع نسيجي لنسيج ندبة جُدرية يُظهر حزمًا كولاجينية سميكة وغير منتظمة أسفل البشرة',
      },
      'case-5': {
        title: 'تجديد العصب الوجهي بالهندسة الحيوية',
        category: 'شلل الوجه',
        description:
          'استراتيجيات متقدمة لتوجيه الأعصاب وتجديدها، صُمِّمت لدعم ترميم العصب الوجهي وإعادة تعصيب العضلات.',
        technologies: ['قنوات موصِّلة لتوجيه الأعصاب', 'مصفوفة داعمة لخلايا شوان'],
        duration: 'زرع جراحي + 6 أشهر من العلاج',
        alt: 'صورة بالمجهر الضوئي لألياف عصبية طرفية مُفرَّقة',
      },
      'case-6': {
        title: 'طعوم عظمية قحفية وجهية بالطباعة الحيوية ثلاثية الأبعاد',
        category: 'عدم تناظر الوجه',
        description:
          'تراكيب ثلاثية الأبعاد مُهندَسة حيويًا ومصمَّمة تشريحيًا لكل مريض، لترميم الملامح والأنسجة القحفية الوجهية.',
        technologies: [
          'نمذجة ثلاثية الأبعاد بتقنية CAD مطابقة لصور الأشعة المقطعية',
          'طباعة حيوية ثنائية الطور للعظم والغضروف',
        ],
        duration: 'عملية ترقيع جراحية واحدة',
        alt: 'نموذج تشريحي شفاف للجمجمة يُظهر البنية العظمية القحفية الوجهية',
      },
      'case-7': {
        title: 'العلاج الجهازي بالخلايا الجذعية والإكسوسومات',
        category: 'الطب التجديدي',
        description:
          'أساليب تجديدية من الجيل الجديد تعتمد على تقنيات الخلايا الجذعية الوسيطة والإكسوسومات.',
        technologies: [
          'إكسوسومات عالية النقاء من الخلايا الجذعية الوسيطة للحبل السري',
          'تركيبات خلوية مراوِغة للجهاز المناعي',
        ],
        duration: 'بروتوكول تسريب في العيادات الخارجية',
        alt: 'باحث يتعامل مع قوارير زراعة الخلايا داخل خزانة سلامة حيوية',
      },
      'case-8': {
        title: 'ترميم الجلد بالطباعة الحيوية ثلاثية الأبعاد',
        category: 'هندسة الأنسجة',
        description:
          'أساليب متقدمة في الطباعة الحيوية ثلاثية الأبعاد لهندسة بُنى نسيجية مكافئة للجلد، تُستخدم في ترميم الأنسجة المعقدة.',
        technologies: [
          'سقالات جلدية مطبوعة حيويًا بتقنية ثلاثية الأبعاد',
          'مصفوفات خلوية نشطة حيويًا',
        ],
        duration: 'بروتوكول علاجي مخصّص',
        alt: 'باحث يشغّل طابعة حيوية ثلاثية الأبعاد داخل خزانة سلامة حيوية',
      },
      'case-9': {
        title: 'التجديد المتقدم لأنسجة الوجه',
        category: 'ترميم الوجه',
        description:
          'استراتيجيات دقيقة في هندسة الأنسجة صُمِّمت لعلاج عيوب أنسجة الوجه المعقدة وعدم التناظر، وللترميم التجديدي.',
        technologies: ['سقالات مخصّصة من المواد الحيوية', 'تجديد الأنسجة بالاعتماد على الخلايا'],
        duration: 'بروتوكول علاجي مخصّص',
        alt: 'رسم توضيحي لسقالة مسامية من مادة حيوية لتجديد الأنسجة',
      },
    },
  },

  why: {
    eyebrow: 'التميّز العلمي',
    title: 'ما الذي يضع Tissue Bioengineering في الصدارة',
    subtitle:
      'نجمع بين تقنيات الموائع الدقيقة المتقدمة وهندسة الخلايا الجذعية والطباعة الحيوية المخصّصة، لنضع معايير عالمية جديدة في جراحة التجميل والجراحة التجديدية.',
    reasons: {
      autology: {
        title: 'علاج ذاتي بخلايا المريض نفسه',
        description:
          'نستخلص الخلايا الجذعية من المريض نفسه ونُكثّرها لبناء طعوم نسيجية مخصّصة له، ما يُزيل مخاطر الرفض ويُغني عن الأدوية المثبِّطة للمناعة.',
      },
      precision: {
        title: 'دقة طباعة حيوية ثلاثية الأبعاد تبلغ 5 ميكرونات',
        description:
          'تُعيد طابعاتنا الحيوية الخاصة، العاملة بتقنية الطباعة الحجرية المجسَّمة، إنتاجَ شبكات الشعيرات الدموية المجهرية الضرورية لبقاء الأنسجة.',
      },
      cleanrooms: {
        title: 'غرف نظيفة معتمدة وفق GMP وISO 13485',
        description:
          'تُجرى جميع عمليات تركيب الأحبار الحيوية ومعالجة السقالات الخلوية داخل غرف نظيفة طبية معقّمة من الفئة 5 وفق ISO، تلتزم بمعايير إدارة الغذاء والدواء الأمريكية (FDA).',
      },
      angiogenesis: {
        title: 'تكوّن سريع للأوعية الدموية والتئام أسرع',
        description:
          'تُطلق تركيبات المصفوفة النشطة حيويًا عوامل محفِّزة لتكوّن الأوعية الدموية، ما يُقلّص مدة التئام الجروح العميقة بنسبة تصل إلى 50%.',
      },
    },
  },

  research: {
    eyebrow: 'آفاق علمية',
    title: 'الأبحاث والابتكارات السريرية',
    subtitle:
      'اكتشافات رائدة محكَّمة علميًا في مجالات الطباعة الحيوية ثلاثية الأبعاد، والخلايا الجذعية المحفَّزة متعددة القدرات (iPSC)، وتحرير الجينات، وتقنية العضو على رقاقة.',
    viewAll: 'عرض مجالات البحث الثمانية',
  },

  technologies: {
    eyebrow: 'تقنياتنا الخاصة',
    title: 'أجهزة ومواد حيوية مُهندَسة',
    subtitle:
      'طابعات حيوية من الجيل الجديد، ومفاعلات حيوية للإكسوسومات، ومنصات من الهلام المائي المترقّق بالقص.',
  },

  process: {
    eyebrow: 'الرحلة العلاجية',
    title: 'مراحل الترقيع الحيوي الأربع',
    subtitle:
      'من الحصول على الخلايا في البداية، إلى الطباعة الحيوية ثلاثية الأبعاد، وصولًا إلى اندماج النسيج المزوَّد بالأوعية الدموية.',
    steps: [
      {
        title: 'مسح ثلاثي الأبعاد وخزعة خلوية',
        description:
          'مسح ليزري ثلاثي الأبعاد عالي الدقة لموضع العيب، مع أخذ خزعة جلدية بالمثقب قطرها 2 مم لعزل الخلايا الجذعية الذاتية.',
        duration: 'اليوم الأول',
      },
      {
        title: 'إكثار الخلايا وتحضير الحبر الحيوي',
        description:
          'استزراع الخلايا الليفية والخلايا البطانية للمريض داخل مفاعلات حيوية في غرف نظيفة وفق معايير ISO، تمهيدًا لتركيب الحبر الحيوي.',
        duration: 'من اليوم 2 إلى اليوم 10',
      },
      {
        title: 'طباعة السقالات حيويًا بتقنية ثلاثية الأبعاد',
        description:
          'طباعة ثلاثية الأبعاد بتقنية الطباعة الحجرية المجسَّمة لطعوم نسيجية حية مزوَّدة بالأوعية الدموية ومخصّصة لكل مريض، تطابق بدقة التشريح المستخلص من صور الأشعة المقطعية (CT).',
        duration: 'اليوم 11',
      },
      {
        title: 'زرع الطعم سريريًا وإعادة التشكّل',
        description:
          'يزرع الجرّاحون المتخصصون الطعم بإجراء طفيف التوغّل، يعقبه اندماج سريع للأوعية الدموية الدقيقة.',
        duration: 'من الأسبوع 2 إلى الأسبوع 6',
      },
    ],
  },

  stats: {
    eyebrow: 'إنجازات سريرية',
    title: 'نتائج يؤكدها التميّز السريري',
    subtitle: 'توافق مثبت للخلايا الذاتية، ومعدلات رفض معدومة، وتعافٍ أسرع للجروح.',
    items: {
      grafts: {
        label: 'طعوم حيوية ناجحة',
        description: 'طعوم من مصفوفات نسيجية حية زُرعت في حالات الحروق والإصابات والقرح.',
      },
      rejection: {
        label: 'انعدام رفض الطعوم',
        description:
          'معدل التوافق المناعي المتحقّق بفضل الحصول على الخلايا الجذعية من المريض نفسه.',
      },
      closure: {
        label: 'سرعة الالتئام السريري',
        description: 'تسارع تكوّن الأوعية الدموية الدقيقة مقارنةً بالضمادات التقليدية.',
      },
      inks: {
        label: 'أحبار حيوية حاصلة على براءات اختراع',
        description: 'تركيبات خارج خلوية خاصة بنا، محمية ببراءات اختراع دولية.',
      },
    },
  },

  articles: {
    eyebrow: 'رؤى علمية',
    title: 'منشورات مختارة في التقنية الحيوية',
    subtitle: 'مقالات وأوراق بيضاء ومستجدات سريرية يكتبها نخبة مهندسي الأنسجة الحيوية لدينا.',
  },

  testimonials: {
    eyebrow: 'نجاحات سريرية',
    title: 'قصص تعافي المرضى',
    subtitle: 'شهادات حقيقية لمرضى غيّرت الطعوم الحيوية من الأنسجة الحية حياتهم.',
    tablistLabel: 'قصص المرضى',
    openQuote: '«',
    closeQuote: '»',
    rated: (value) => `التقييم ${value} من 5`,
    items: {
      't-1': {
        patientName: 'إليانور فانس',
        quote:
          'بعد إصابتي بحروق شديدة، خلّفت طعوم الجلد التقليدية تقفّعات مشدودة ومؤلمة. أما الطعم الذاتي المطبوع حيويًا بتقنية ثلاثية الأبعاد من Tissue Bioengineering، فقد أعاد إليّ حرية الحركة والمظهر الطبيعي لبشرتي.',
      },
      't-2': {
        patientName: 'روبرت مارتينيز',
        quote:
          'كان البتر يهدّدني بسبب قرحة سكرية مزمنة لم تلتئم طوال 14 شهرًا. لكن علاجهم بالغشاء الحيوي المعزَّز بالخلايا الجذعية شفى الجرح تمامًا في 5 أسابيع فقط.',
      },
      't-3': {
        patientName: 'صوفيا لين',
        quote:
          'أعاد إجراء القناة العصبية المُهندَسة حيويًا وظيفةَ العصب والتحكم في عضلات وجهي بعد سنوات من الشلل. كانت الرعاية والخبرة العلمية بمستوى عالمي.',
      },
    },
  },

  faq: {
    eyebrow: 'الأسئلة الشائعة',
    title: 'إيضاحات سريرية وعلمية',
    subtitle:
      'كل ما تحتاج إلى معرفته عن الحصول على الخلايا الذاتية، ومراحل الطباعة الحيوية ثلاثية الأبعاد، وبروتوكولات الاستشارة لدينا.',
    items: [
      {
        id: 'faq-1',
        question: 'كيف تمنع الطباعة الحيوية الذاتية ثلاثية الأبعاد رفض الطعم؟',
        answer:
          'لأن الحبر الحيوي يُحضَّر من الخلايا الليفية الجلدية والخلايا الجذعية للمريض نفسه، والتي تُعزل بواسطة خزعة جلدية بالمثقب، فإن الجهاز المناعي يتعرّف على النسيج المزروع بوصفه نسيجًا ذاتيًا، فيُتجنَّب رفضه تمامًا.',
      },
      {
        id: 'faq-2',
        question: 'ما المدة المتوقعة للتعافي بعد ترقيع الأنسجة لقرح القدم السكرية؟',
        answer:
          'تحقق معظم قرح القدم السكرية المزمنة التي لا تلتئم إعادةَ توعية دموية ملحوظة خلال 14 يومًا، وإغلاقًا كاملًا للجرح بكامل سماكته خلال 3 إلى 5 أسابيع.',
      },
      {
        id: 'faq-3',
        question: 'هل يغطي التأمين الطبي أو تمويل التجارب السريرية تكاليف العلاج؟',
        answer:
          'تشمل كثير من خطط التأمين الصحي الكبرى عددًا من علاجاتنا الذاتية المعتمدة من إدارة الغذاء والدواء الأمريكية (FDA)، بينما تُموَّل بروتوكولات الطباعة الحيوية التجريبية من خلال منح للتجارب السريرية خاضعة لإشراف مجالس المراجعة المؤسسية (IRB).',
      },
      {
        id: 'faq-4',
        question:
          'هل يمكن للغضروف المطبوع حيويًا بتقنية ثلاثية الأبعاد علاج عدم تناظر الوجه الشديد؟',
        answer:
          'نعم، فبالاستعانة بصور الأشعة المقطعية (CT) ثلاثية الأبعاد عالية الدقة، يبني مهندسونا الحيويون سقالات عظمية غضروفية مخصّصة لكل مريض، تعيد التناظر القحفي الوجهي الطبيعي بشكل دائم، دون رضح جراحي في الموضع المانح.',
      },
    ],
  },
};

export const homeMessages: LocalizedMessages<typeof en> = { en, ar };
