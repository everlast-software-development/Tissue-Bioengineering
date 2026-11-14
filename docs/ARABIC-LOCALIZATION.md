# Arabic Localization

The site is published in English (default, original URLs) and Arabic (`/ar/...`, right-to-left).
This document covers how it works, where every string lives, the RTL rules for components,
the Arabic terminology glossary, and the content that needs human (medical) review.

## How it works

| Piece | File | Role |
|---|---|---|
| Locales and URLs | `src/i18n/config.ts` | `en` at `/…`, `ar` at `/ar/…`; `localizePath`, `stripLocale`, `localeFromPath` |
| Provider | `src/i18n/I18nProvider.tsx` | Derives the locale from the URL; sets `<html lang dir>` |
| Hooks | `src/i18n/context.ts` | `useI18n()` → `{ locale, dir, t, to }`; `useMessages(bundle)` for page copy |
| Localized link | `src/i18n/Link.tsx` | Drop-in for react-router's `<Link>`: `/about` becomes `/ar/about` in Arabic |
| Switcher | `src/components/layout/LanguageSwitcher.tsx` | Same page in the other language; keeps query and hash; scroll position kept |
| SEO | `src/components/common/SEOHead.tsx` | Localized title/description/keywords, `og:locale`, self canonical, `hreflang` en/ar/x-default |
| Pre-paint direction | `index.html` (inline script) | Sets `lang="ar" dir="rtl"` before first paint on `/ar` URLs |

Routes are declared once (`pageRoutes` in `src/App.tsx`) and mounted under `/` and `/ar`
inside one layout route, so switching language re-renders the page in place.

## Where text lives

| Text | English | Arabic |
|---|---|---|
| Shared UI: nav, footer, CTA band, forms, validation, categories, 404, article meta | `src/i18n/messages/en.ts` | `src/i18n/messages/ar.ts` |
| Page copy (hero, sections, SEO) | `src/pages/<Page>/messages.ts` (`en`) | same file (`ar`) |
| Services, research, technologies, articles | `src/data/*.ts` (unchanged) | `src/data/ar/*.ts`, by record id |
| Country names in the phone picker | `react-phone-number-input/locale/en` | `react-phone-number-input/locale/ar` |
| API messages (server answers in English) | shown as sent | `forms.serverMessages` in `ar.ts` |

Type safety: `ar.ts` is typed `Messages` and each page's Arabic object is typed `typeof en`, so a
missing or extra key fails `npm run typecheck`. Data records without an Arabic entry fall back to
English and log `[i18n] No translation for …` in development.

### Adding or changing text

1. Add the English string to the right `en` object; the typecheck then lists where Arabic is missing.
2. Add the Arabic string at the same key. Use the glossary below for recurring terms.
3. In components, read it with `useI18n().t.…` (shared) or `useMessages(pageMessages)` (page).
4. New content record (e.g. a service): add it to `src/data/*.ts` and its text to `src/data/ar/*.ts`
   under the same `id`.
5. Filter keys and form values stay English (`SERVICE_CATEGORIES`, time slots): translate their
   labels only (`t.categories.service[cat]`), never the submitted value — the API validates them.
6. New server message (`server/index.ts`, `server/forms.ts`): add its exact English text and
   Arabic translation to `forms.serverMessages` in `ar.ts`. Unlisted messages show a generic
   Arabic message (`serverFallback` / `serverFieldFallback`).

## RTL rules for components

- Use logical utilities: `ms-/me-`, `ps-/pe-`, `start-/end-`, `border-s/border-e`, `text-start/text-end`.
  They render identically in English.
- Directional icons (`ArrowRight`, `ArrowLeft`, `ExternalLink`): add `rtl:-scale-x-100`; hover nudges
  get the mirrored `rtl:group-hover:-translate-x-…`.
- Elements centred on a point with `-translate-x-1/2` and a logical `start-…`: add `rtl:translate-x-1/2`.
- Wrap phone numbers, emails, URLs, DOIs and ISO dates in `<Ltr>` (`src/components/common/Ltr.tsx`);
  inside a translated string use the `⁦…⁩` isolate (see `ltr()` in `ar.ts`).
- The phone field is always left-to-right (code then number); its country list follows the page.
- Email inputs are `dir="ltr"` with `rtl:text-right`.
- Gradients, masks and the ticker that are written with physical directions are mirrored in the
  "Arabic (right-to-left)" block at the end of `src/index.css`.
- `InfiniteSlider` takes `rtl` so the carousel loops in the reading direction.

## Typography

IBM Plex Sans Arabic (Google Fonts, weights 300–700) is the companion of IBM Plex Sans and is
used only on Arabic pages; its files download only when Arabic text renders. On Arabic pages:
letter-spacing is reset to 0 (tracking breaks letter joins), heading line-height opens to 1.35,
`leading-none/tight/snug` open up, and the 11px uppercase label grows to 12.5px.

## Translation conventions

- Modern Standard Arabic, written for patients and referring clinicians; no dialect.
- Western digits (0–9) throughout (`ar-AE-u-nu-latn`), matching figures, units and scientific values.
- Ranges are written in words: "3 - 6 Weeks" → «من 3 إلى 6 أسابيع».
- The brand **Tissue Bioengineering** and product trademarks (BioMatrix-3D™, ExoPure™, SmartScaff-Gel)
  stay in Latin script. Standards and regulators stay as acronyms (ISO, GMP, FDA, HIPAA, IRB, DOI).
- Scientific abbreviations are kept in Latin after the Arabic term on first use: «المصفوفة خارج الخلوية (ECM)».
- Personal names are transliterated, the same spelling everywhere (e.g. «د. آريس ثورن»); degree
  abbreviations stay Latin: «(MD, PhD)». Job titles use the standard (grammatically masculine)
  form of Arabic titles. Monograms stay Latin.
- Arabic quotation marks «…»; Arabic comma «،» in lists.

## Glossary (English → Arabic)

| English | Arabic |
|---|---|
| Tissue engineering | هندسة الأنسجة |
| Tissue bioengineering (discipline) | الهندسة الحيوية للأنسجة |
| Regenerative medicine | الطب التجديدي |
| 3D bioprinting / bioprinter | الطباعة الحيوية ثلاثية الأبعاد / طابعة حيوية |
| Bio-ink | الحبر الحيوي |
| Scaffold | سقالة |
| Hydrogel | هلام مائي |
| Biomaterials / smart biomaterials | المواد الحيوية / المواد الحيوية الذكية |
| Extracellular matrix (ECM) | المصفوفة خارج الخلوية |
| Autologous | ذاتي المنشأ |
| Graft / grafting / bio-grafting | طُعم (طعوم) / ترقيع / الترقيع الحيوي |
| Donor site / donor-site morbidity | الموضع المانح / مضاعفات الموضع المانح |
| Stem cells | الخلايا الجذعية |
| Mesenchymal stem cells (MSC) | الخلايا الجذعية الوسيطة |
| Mesenchymal stromal cells | الخلايا اللحمية الوسيطة |
| iPSC | الخلايا الجذعية المحفَّزة متعددة القدرات |
| Adipose-derived stem cells (ADSC) | الخلايا الجذعية المشتقة من الدهون |
| Exosomes / extracellular vesicles | الإكسوسومات / الحويصلات خارج الخلوية |
| Fibroblasts / keratinocytes / chondrocytes | الخلايا الليفية / الخلايا الكيراتينية / الخلايا الغضروفية |
| Schwann cells | خلايا شوان |
| Angiogenesis / pro-angiogenic | تكوّن الأوعية الدموية / محفِّز لتكوّن الأوعية الدموية |
| Re-innervation / nerve guidance conduit | إعادة التعصيب / قناة توجيه الأعصاب |
| Burn scar | ندبة الحروق |
| Keloid / hypertrophic scar | الجُدرة / الندبة الضخامية |
| Contracture | التقفّع |
| Diabetic foot ulcer | قرحة القدم السكرية |
| Wound healing / wound closure | التئام الجروح / إغلاق الجرح |
| Facial palsy / facial asymmetry | شلل الوجه / عدم تناظر الوجه |
| Craniofacial / osteochondral | قحفي وجهي / عظمي غضروفي |
| Stereolithography | الطباعة الحجرية المجسَّمة |
| Electrospun nanofibers | ألياف نانوية مغزولة كهربائيًا |
| Microfluidics / organ-on-chip | الموائع الدقيقة / العضو على رقاقة |
| Paracrine | نظير الصماوي |
| Cleanroom | غرفة نظيفة |
| Punch biopsy | خزعة جلدية بالمثقب |
| Debridement / hyperbaric oxygen | تنضير الجرح / الأكسجين عالي الضغط |
| Doppler ultrasound | تصوير دوبلر بالموجات فوق الصوتية |
| CT scan | الأشعة المقطعية (CT) |
| Infusion | تسريب |

## For human review

Translations follow the English source faithfully; these points need a decision from a
clinician or the content owner (several are issues in the English source itself, see also
`docs/SCIENTIFIC-CONTENT-AUDIT.md`):

1. **"bi-weekly"** (case study 1, low-level laser) is ambiguous in English (twice a week or every
   two weeks). Translated as «مرتين أسبوعيًا» (twice weekly); confirm.
2. **Time slots in EST** on the consultation form for an Abu Dhabi clinic. Translated as
   «بتوقيت EST»; confirm the intended time zone.
3. **"Laser-Assisted Laser-Guided"** (research 1 title) is redundant in English; rendered «بمساعدة الليزر وتوجيهه».
4. **"Sub-micron" vs "5 Microns"** (BioMatrix-3D™ tagline vs specification) contradict each other;
   both translated as written.
5. **"immunologically silent"** (research 2) rendered «لا تُثير استجابة مناعية» (do not elicit an immune response).
6. **"neurotrophic stem cells"** (service 5) rendered «خلايا جذعية مغذِّية للأعصاب».
7. **"Immune-evasive cellular formulations"** rendered «تركيبات خلوية مراوِغة للجهاز المناعي».
8. **"sponsored through IRB clinical trial grants"** (FAQ 3): IRBs approve and oversee trials rather than
   fund them; rendered «منح للتجارب السريرية خاضعة لإشراف مجالس المراجعة المؤسسية (IRB)».
9. **"organ rejection"** in FAQ 1 and "Why us" refers to graft rejection; rendered as rejection of
   the grafted tissue.
10. **Arabic name of the treatment provider**: «مركز إيفرلاست ويلنس الطبي» is a transliteration; use
    the centre's official Arabic name if it has one.
11. **Transliterated personal names** (authors, leadership, patients) should be confirmed by the people named.
12. **"Dermatological and Anti-Aging Specialists"** (Home "About" card) does not match the rest of the
    site's positioning; translated as written.
13. "senior plastic reconstructive surgeon" rendered «استشاري في جراحة التجميل والترميم» (consultant, the
    regional title for a senior surgeon).

The claims themselves (FDA approval, "zero rejection", 100% closure, statistics, DOIs) are translated
faithfully, not verified; the scientific audit lists the ones that need evidence.

## Known limitations

- The site renders on the client. Crawlers that do not run JavaScript, and most social-media link
  previews, see `index.html` (English title, no hreflang) for every URL. Search engines that render
  JavaScript (Google, Bing) see the localized tags. Server-side rendering or pre-rendering would
  remove this limitation.
- Native date inputs show the browser's own format (e.g. mm/dd/yyyy) regardless of page language.
- `docs/SCIENTIFIC-CONTENT-AUDIT.md` cites file and line numbers from before localization; English
  copy that was inline in components now lives in each page's `messages.ts`.
- Not translated because nothing renders them: service `benefits`, research `fullDetails`, and
  `src/data/clinicalApplications.ts` (not imported anywhere).
