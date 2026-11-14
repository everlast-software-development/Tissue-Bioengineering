import type { ResearchCategory, ResearchItem, ServiceCategory } from '@/types';

/**
 * Shared UI strings: layout, navigation, shared sections, forms and category labels.
 * Page-specific copy lives next to each page (`pages/<Page>/messages.ts`).
 *
 * This object is the source of truth for the shape: `ar.ts` is typed `Messages`, so a key
 * missing from the Arabic dictionary fails the type check.
 */
export const en = {
  site: {
    /** Suffix of every page title. */
    name: 'Tissue Bioengineering & Regenerative Medicine',
    description:
      'Leading biotechnology institution specializing in Advanced Tissue Engineering, Regenerative Medicine, Stem Cell Research, and Bio-printed Graft Solutions.',
    keywords:
      'Tissue Engineering, 3D Bioprinting, Regenerative Medicine, Stem Cells, Burn Scar Treatment, Diabetic Foot Ulcer',
    logoAlt: 'Tissue Bioengineering',
    providerName: 'Everlast Wellness Medical Center',
    providerAddress: '446 Al Khaleej Al Arabi St, Al Bateen, Abu Dhabi, UAE',
  },

  common: {
    loading: 'Loading Regenerative Data...',
    bookConsultation: 'Book Consultation',
    bookConsultationNow: 'Book Consultation Now',
    callHotline: 'Call Hotline:',
    readArticle: 'Read Article →',
    learnMore: 'Learn More',
    opensInNewTab: '(opens in a new tab)',
    authors: 'Authors:',
    /** Joins names in a list (authors). */
    listSeparator: ', ',
    abstract: 'Abstract',
    keyApplications: 'Key Applications:',
    tags: 'Tags',
    duration: 'Duration:',
    scrollToTop: 'Scroll to top',
    breadcrumb: 'Breadcrumb',
    breadcrumbHome: 'Home',
  },

  language: {
    /** Accessible name of the switcher link; the visible text is the other language's name. */
    switchTo: 'Read this page in Arabic',
  },

  nav: {
    mainLabel: 'Main',
    homeAria: 'Tissue Bioengineering home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    siteMenu: 'Site menu',
    items: {
      home: { title: 'Home', description: 'Main portal & overview' },
      about: { title: 'About Us', description: 'Our history & mission' },
      research: { title: 'Research', description: 'Latest tissue engineering work' },
      services: { title: 'Core Services', description: 'Skin matrices & burn care' },
      articles: { title: 'Articles', description: 'Clinical papers & insights' },
      partners: { title: 'Clinical Partners', description: 'Our hospital network' },
      contact: { title: 'Contact', description: 'Get in touch with us' },
    },
  },

  footer: {
    links: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      research: 'Research & Innovation',
      technologies: 'Technologies',
    },
    certBadge: 'ISO 13485 & GMP Certified Cleanrooms',
    navigation: 'Navigation',
    therapies: 'Therapies',
    contact: 'Contact',
    treatmentAt: (name: string, address: string) =>
      `Clinical treatments provided at ${name}, ${address}.`,
    scheduleReview: 'Schedule Case Review',
    copyright: (year: number) => `© ${year} Tissue Bioengineering Inc. All rights reserved.`,
    privacy: 'Privacy Policy',
    terms: 'Terms of Clinical Care',
    ethics: 'Ethics & Compliance',
  },

  categories: {
    service: {
      'Burn Scar Treatment': 'Burn Scar Treatment',
      'Diabetic Foot': 'Diabetic Foot',
      'Wound Healing': 'Wound Healing',
      'Scar Management': 'Scar Management',
      'Facial Palsy': 'Facial Palsy',
      'Facial Asymmetry': 'Facial Asymmetry',
      'Regenerative Medicine': 'Regenerative Medicine',
    } satisfies Record<ServiceCategory, string> as Record<ServiceCategory, string>,
    research: {
      '3D Bioprinting': '3D Bioprinting',
      'Stem Cells': 'Stem Cells',
      'Smart Biomaterials': 'Smart Biomaterials',
      'Gene Editing': 'Gene Editing',
      'Organ-on-Chip': 'Organ-on-Chip',
      'Drug Delivery': 'Drug Delivery',
      'Tissue Engineering': 'Tissue Engineering',
      Nanotechnology: 'Nanotechnology',
    } satisfies Record<ResearchCategory, string> as Record<ResearchCategory, string>,
    researchStatus: {
      'In Development': 'In Development',
      'Clinical Trial': 'Clinical Trial',
      'FDA Approved': 'FDA Approved',
      Published: 'Published',
    } satisfies Record<ResearchItem['status'], string> as Record<ResearchItem['status'], string>,
  },

  /** Consultation band shared by Home, inner pages and the Services closing CTA. */
  cta: {
    eyebrow: 'Clinical Case Assessment',
    titleBefore: 'Ready to Explore ',
    titleAccent: 'Autologous Bio-Grafting',
    titleAfter: '?',
    lead: 'Schedule a confidential virtual consultation with our tissue bioengineers and plastic reconstructive surgeons to review your clinical case.',
    imageAlt:
      'Scanning electron micrograph of a fiber-based biomaterial scaffold (blue) partly covered by a cultured cell layer (gray)',
  },

  notFound: {
    seoTitle: '404 - Page Not Found',
    heading: 'Cellular Map Not Found',
    body: 'The page or clinical resource you requested does not exist or has been relocated to another research domain.',
    home: 'Return to Homepage',
  },

  articles: {
    author: 'Author',
    published: 'Published',
    readingTime: 'Reading time',
    articleDetails: 'Article details',
    backToArticles: 'Articles',
    more: 'More Articles',
  },

  forms: {
    required: 'required',
    honeypotLabel: 'Website',
    fullName: 'Full name',
    fullNamePlaceholder: 'Enter your full name',
    email: 'Email address',
    emailPlaceholder: 'Enter your email address',
    phone: 'Phone number',
    phonePlaceholder: 'Enter your phone number',
    validation: {
      nameRequired: 'Please enter your full name',
      nameMin: 'Name must be at least 2 characters',
      fullNameMin: 'Full name must be at least 2 characters',
      emailRequired: 'Please enter your email address',
      emailInvalid: 'Please enter a valid email address',
      phoneRequired: 'Please enter your phone number',
      phoneTooShort: 'This number is too short for the selected country',
      phoneInvalid: 'Please enter a valid phone number for the selected country',
      messageRequired: 'Please enter a message',
      messageMin: 'Message must be at least 10 characters long',
      ageRequired: "Please enter the patient's age",
      ageWhole: 'Age must be a whole number',
      ageInvalid: 'Please enter a valid age',
      historyMin: 'Please provide a brief medical history summary (at least 10 characters)',
      dateRequired: 'Please select a preferred date',
      timeRequired: 'Please select a preferred time slot',
      consentRequired: 'You must consent to data processing for medical consultation',
    },
    country: {
      selected: (name: string, code: string) =>
        `Country calling code: ${name} +${code}. Change country`,
      choose: 'Choose country calling code',
      dialog: 'Choose country',
      search: 'Search countries by name or calling code',
      searchPlaceholder: 'Search country or code',
      list: 'Countries',
      noMatch: (query: string) => `No countries match “${query}”.`,
    },
    contact: {
      message: 'Message',
      messagePlaceholder: 'Tell us how we can help you...',
      success: 'Thank you for contacting us! Our team will get back to you within 24 hours.',
      submit: 'Send Message',
    },
    consultation: {
      age: 'Patient age',
      agePlaceholder: 'Enter age',
      therapyArea: 'Therapy area',
      history: 'Medical history summary',
      historyHint:
        'Briefly describe the condition (burn injury, diabetic ulcer, scar tissue or facial palsy), how long it has been present and any previous treatment.',
      historyPlaceholder: "Describe the patient's condition...",
      date: 'Preferred date',
      time: 'Preferred time slot',
      /** Display labels for the time slots; the submitted values stay as in the form. */
      timeSlots: {
        '09:00 AM': '09:00 AM EST',
        '11:30 AM': '11:30 AM EST',
        '02:00 PM': '02:00 PM EST',
        '04:30 PM': '04:30 PM EST',
      } as Record<string, string>,
      consent:
        'I consent to Tissue Bioengineering processing my medical intake details confidentially under HIPAA guidelines.',
      submit: 'Submit Consultation Request',
      successTitle: 'Request Received!',
      successFallback: 'Consultation submitted successfully.',
      another: 'Submit Another Request',
    },
    /**
     * Visitor-facing messages that arrive from the API (server/index.ts, server/forms.ts) or
     * from lib/api.ts, keyed by their English text. English shows them unchanged; a locale
     * that translates them lists each one here and sets `serverFallback` for anything else.
     */
    serverMessages: {} as Record<string, string>,
    /** Shown instead of an untranslated server message; null shows the message as sent. */
    serverFallback: null as string | null,
    /** Shown instead of an untranslated server field error; null shows it as sent. */
    serverFieldFallback: null as string | null,
  },
};

export type Messages = typeof en;
