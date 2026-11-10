# Scientific Content & Accuracy Audit

**Site:** Tissue Bioengineering (React/Vite source in `src/`)
**Audit date:** 2026-11-09
**Type:** Read-only audit. No website content, source code, configuration, assets or existing documentation was changed. This report is the only file created.

---

## 1. Executive Summary

The site makes a large number of specific clinical, regulatory and scientific claims. The repository contains no supporting evidence for any of them: no clinical data, no regulatory filings, no certificates, no patent records, no consent records and no references beyond the DOIs listed on the Research page.

The one category that could be checked externally was the research DOIs, and it failed. **None of the 8 DOIs points to the paper the site attributes to it.** Six are not registered with the DOI system at all. The other two resolve to unrelated papers (a SARS-CoV-2 virology paper in *Cell*, and a 2021 meniscus-cell paper). The site presents these as "peer-reviewed discoveries" and links them as clickable DOI badges on the Home page and the Research page.

The highest-risk claims are:

1. **FDA approval claims with no identified product or approval.** The Home FAQ says "Many of our FDA-approved autologous therapies are covered under major health insurance plans". A research item carries an "FDA Approved" status badge. (C-01, C-02)
2. **Absolute safety and outcome claims.** These include "Zero Graft Rejection", "completely bypassing organ rejection" and "100% full-thickness skin closure", and they are presented as "Validated by Clinical Excellence" and "Evidence-Based Medicine". (C-03, C-04, C-05)
3. **Systemic stem-cell and exosome infusions for "multi-organ cellular repair"**, marketed as an outpatient service with 1–2 days of recovery. (C-07)
4. **Unverifiable research citations.** All 8 DOIs failed verification. (C-08)
5. **Patient testimonials and case reports** labeled "Real", including a 9-year-old patient. No consent or source records are in the repository. (C-05, C-06)

Other important themes:

- Certification wording mixes up standards. For example, "ISO 13485 Certified Cleanrooms": ISO 13485 certifies an organization's quality management system, not a room. (H-09)
- A HIPAA compliance claim sits on a medical intake form whose code shows a success message even when submission fails. (H-10)
- Several numbers contradict each other. Closure speed is given as "up to 50%" faster, "3.5x" faster and "45%" faster. The bioprinter is called "Sub-micron" but has a "5 Microns" resolution. (H-03, H-14)

**Totals:** 225 claim statements reviewed. They are grouped into 44 findings: 10 Critical, 16 High, 10 Medium and 8 Low. A further 13 statements raised no material concern. No claim could be classified as Verified or Partially Supported, because no qualifying evidence was found in the repository or through the external checks this audit could run. That outcome means the evidence is missing. It does not mean any claim was shown to be false, except where this report says a specific check failed (the DOIs).

---

## 2. Audit Scope and Methodology

### 2.1 Content inspected

Every route registered in `src/App.tsx`, plus the shared layout and every data source:

| Route | Components / data inspected |
|---|---|
| `/` Home | `pages/Home/*` (Hero, ExploreBioCards, CoreServicesTimeline, ServicesOverview, WhyChooseUs, ResearchHighlights, TechnologiesSection, TreatmentProcess, StatisticsSection, FeaturedArticles, PatientTestimonials, FAQSection), `components/common/SectionHeader.tsx` |
| `/about` | `pages/About/AboutPage.tsx` |
| `/services` | `pages/Services/ServicesPage.tsx`, `ServiceCard.tsx`, `data/mockServices.ts` |
| `/research` | `pages/Research/ResearchPage.tsx`, `components/cards/ResearchCard.tsx`, `data/research.ts` |
| `/technologies` | `pages/Technologies/TechnologiesPage.tsx`, `TechnologyCard.tsx`, `data/technologies.ts` |
| `/articles`, `/articles/:slug` | `pages/Articles/ArticlesPage.tsx`, `ArticleDetailPage.tsx`, `components/cards/ArticleCard.tsx`, `data/articles.ts` |
| `/case-studies` | `pages/CaseStudies/CaseStudiesPage.tsx` |
| `/consultation` | `pages/Consultation/ConsultationPage.tsx`, `ConsultationForm.tsx`, `lib/api.ts` (user-visible messages) |
| `/contact` | `pages/Contact/ContactPage.tsx`, `ContactForm.tsx` |
| `*` (404) | `pages/NotFound/NotFoundPage.tsx` |
| Shared | `components/layout/*` (Navbar, MobileNavDrawer, Footer, navData), `components/common/*` (CTASection, PageHero, PageShell, SEOHead), `lib/site.ts`, `index.html` |
| Data not rendered | `data/clinicalApplications.ts` (no imports anywhere), the `benefits` field in `data/mockServices.ts` (no component renders it), the `fullDetails` field in `data/research.ts` (no component renders it) |

SEO `<title>` and `<meta name="description">` strings were included, because search engines and link previews show them.

### 2.2 Rendered vs. unrendered content

The audit traced which data fields reach the page:

- **Rendered:** service `shortDescription`, `fullDescription`, `features`, `treatmentDuration`, `recoveryPeriod`. Research `title`, `abstract`, `status`, `authors`, `doi`, `publicationDate`. Technology `tagline`, `description`, `specifications`, `applications`, `badge`. Article `title`, `summary`, `category`, `tags`, author name and role, and the `content` body (on the detail page only).
- **Not rendered:** service `benefits`, research `fullDetails`, research `coverImage`, and all of `data/clinicalApplications.ts`.

Unrendered content is still audited, because one component change would publish it. **Rule applied:** a finding made up *entirely* of unrendered content is ranked one priority level lower than the same wording would be if rendered. Mixed findings take their priority from the rendered parts. Each finding says what is rendered.

### 2.3 Evidence sources consulted

| Source | Result |
|---|---|
| Repository (all files outside `node_modules/` and `dist/`) | No clinical data, regulatory filings, certificates, patent records, consent forms, study protocols or reference lists were found. `docs/image-sources.md` was read for context. It records that stock portraits captioned as named staff were removed as misleading. |
| Crossref REST API (`api.crossref.org/works/{doi}`), queried 2026-11-09 | Checked all 8 DOIs. See Section 7. |
| doi.org Handle API (`doi.org/api/handles/{doi}`), queried 2026-11-09 | Checked whether each DOI is registered. See Section 7. |
| Crossref bibliographic title search, queried 2026-11-09 | Searched each research title, in case the paper exists under another DOI. See Section 7. |

### 2.4 Sources NOT consulted (limitations)

This audit did **not** query the following. Every claim that depends on them is therefore **not independently verified**:

- FDA databases: Drugs@FDA, the Purple Book / BLA approvals, 510(k), PMA, De Novo, Establishment Registration & Device Listing, and HCT/P establishment registration.
- ClinicalTrials.gov or any other trial registry.
- Patent and trademark registries (USPTO, WIPO PATENTSCOPE, EPO).
- ISO certification-body registers, and GMP inspection or certificate databases.
- State medical licensing boards, NPI registry, PubMed or author profiles.
- Insurance coverage policies.

Where the report gives general scientific or regulatory context (for example, how FDA regulates exosome products, or what ISO 13485 covers), that context comes from the auditor's general knowledge and is marked as such. It was **not** re-verified against primary sources during this audit, and the owner's regulatory or legal advisors should confirm it.

The tracked `dist/` build directory was not opened. If the deployed site is served from `dist/`, its text may differ from `src/`.

### 2.5 Classification and priority

The classifications (Verified, Partially Supported, Unverified, Potentially Misleading, Needs Owner Confirmation) and priorities (Critical, High, Medium, Low) follow the audit brief. Each finding gets one primary classification. Where both "Needs Owner Confirmation" and "Potentially Misleading" apply, "Potentially Misleading" is used when the wording would be a problem *even if* supporting records exist. Examples: absolute terms like "zero" or "100%", and terms like "certified cleanroom" that describe the wrong thing.

---

## 3. Critical Findings

### C-01 — "FDA-approved autologous therapies" covered by insurance

- **Page / Route:** Home `/` (FAQ section, third question)
- **Exact existing wording:**
  - Question: "Are treatments covered by medical insurance or clinical trial funds?"
  - Answer: "Many of our FDA-approved autologous therapies are covered under major health insurance plans, while experimental bio-printing protocols are sponsored through IRB clinical trial grants."
- **Source:** `src/pages/Home/FAQSection.tsx:19-22` (`faqList`, id `faq-3`)
- **Classification:** Potentially Misleading
- **Priority:** Critical
- **Evidence reviewed:** No product name, BLA/PMA/510(k) number, approval letter or regulatory filing appears anywhere in the repository. No insurer coverage policy is referenced. FDA databases were not queried (Section 2.4).
- **Why it needs attention:**
  - "FDA-approved" is a specific regulatory status. FDA *approves* drugs and biologics (NDA/BLA) and high-risk devices (PMA). It *clears* devices via 510(k), and *grants* De Novo requests. Establishments *register*, and products are *listed*. None of these is the same as approval. Autologous cell-based and bioprinted tissue products would generally be regulated as biologics or HCT/Ps (auditor's general knowledge, not re-verified). The site does not say which pathway any therapy followed.
  - "Many of our" implies more than one approved product. The rest of the site describes these therapies as investigational in character ("Research & Development Dependent" in unrendered data; "experimental bio-printing protocols" in this same answer).
  - "IRB clinical trial grants" misuses the term. An Institutional Review Board approves and oversees human-subjects research on ethical grounds. It does not issue grants or sponsor trials.
  - Insurance coverage depends on the insurer and the policy. A general statement could lead patients to expect reimbursement.
- **Documentation / verification needed:** For each therapy said to be FDA-approved: the product name, application type and number (BLA/PMA/510(k)/De Novo), the approval or clearance letter, and the approved indication. For any therapy that is not approved: whether it is offered under an IND, an IDE, or as a 361 HCT/P, with supporting documentation. For the insurance claim: named payer coverage policies or CPT/HCPCS codes. For trials: the funding source and IRB of record.
- **Recommended owner review:** Regulatory affairs and legal should confirm whether any FDA approval exists. If none does, the answer needs to be reconsidered in full.

---

### C-02 — Research item carries an "FDA Approved" status badge

- **Page / Route:** Research `/research` (rendered in the full publication list; not among the 3 items on Home)
- **Exact existing wording:**
  - Title: "Targeted Nanoparticle-Exosome Hybrids for Deep Tissue Regeneration"
  - Status: "FDA Approved"
  - Abstract: "Hybrid vesicle platforms combining synthetic liposomes with biological exosomes for deep dermal therapeutic cargo transport."
- **Source:** `src/data/research.ts:80-93` (id `res-6`, `status: 'FDA Approved'` at line 91). The status style is green/emerald in `src/components/cards/ResearchCard.tsx:7`. The type allows `'FDA Approved'` as a research status in `src/types.ts`.
- **Classification:** Potentially Misleading
- **Priority:** Critical
- **Evidence reviewed:** The DOI attached to this item (`10.1002/adma.202509124`) is **not registered** (doi.org handle lookup returned "not found", and Crossref returned 404). No FDA document is in the repository.
- **Why it needs attention:** FDA approves products for specific indications. It does not approve research papers or platforms. Showing "FDA Approved" next to a publication suggests that a hybrid exosome product is approved for "deep tissue regeneration". To the auditor's general knowledge (not re-verified), FDA has publicly cautioned that no exosome products are FDA-approved for these uses. The unrendered `fullDetails` also describes an unusual mechanism claim (see M-10). The status set (`FDA Approved | Clinical Trial | Published | In Development`) mixes regulatory status with publication status.
- **Documentation / verification needed:** The approval document (application number, product name, indication). Otherwise, confirmation of the item's actual status. A valid citation for the underlying paper.
- **Recommended owner review:** Regulatory affairs should confirm. The research team should supply the real citation.

---

### C-03 — "Zero Graft Rejection" / "99.8%" / "zero rejection rates"

- **Page / Route:** Home `/` (Statistics section, "Clinical Milestones")
- **Exact existing wording:**
  - Section title: "Validated by Clinical Excellence"
  - Subtitle: "Proven autologous cell compliance, zero rejection rates, and accelerated wound recovery."
  - Statistic: "99.8" "%". Label: "Zero Graft Rejection". Description: "Immune compliance rate achieved via autologous stem cell harvesting."
- **Source:** `src/pages/Home/StatisticsSection.tsx:15-22` (statistic id `2`), `:80-81` (title and subtitle)
- **Classification:** Potentially Misleading
- **Priority:** Critical
- **Evidence reviewed:** None in the repository. No study, registry, denominator, follow-up period or definition of "immune compliance" is given.
- **Why it needs attention:**
  - The claim contradicts itself. A 99.8% figure means 0.2% did not meet the measure, so the label "Zero" cannot also be true.
  - "Immune compliance rate" is not a standard clinical endpoint. It is unclear what was measured, or how a percentage of compliance relates to rejection.
  - "Proven" and "Validated" signal clinical evidence that is not identified anywhere.
  - Graft failure has causes other than immune rejection (infection, failure to vascularize, mechanical loss). Scaffold materials and culture reagents can trigger immune or foreign-body responses even when the cells are autologous (auditor's general knowledge).
- **Documentation / verification needed:** The source dataset: number of grafts, patient population, follow-up duration, and definitions of rejection, failure and "immune compliance". Whether the data come from a registered trial, a published study or internal records. Independent review of the statistic.
- **Recommended owner review:** Clinical leadership and medical/legal review.

---

### C-04 — Claims that autologous grafts eliminate or bypass rejection

- **Page / Route:** Home `/` (Why Choose Us; FAQ first question, which is open by default); Services `/services` (burn scar service)
- **Exact existing wording:**
  1. "We harvest and expand the patient’s own stem cells to construct personalized tissue grafts, eliminating organ rejection risks and immune suppressants." (card title "Patient-Derived Cellular Autology")
  2. Question: "How does autologous 3D bioprinting prevent graft rejection?" Answer: "Because the bio-ink is formulated using the patient’s own skin fibroblasts and stem cells isolated via punch biopsy, the immune system recognizes the grafted tissue as self-tissue, completely bypassing organ rejection."
  3. Feature: "Minimal immune rejection risk"
- **Source:** (1) `src/pages/Home/WhyChooseUs.tsx:6-11`; (2) `src/pages/Home/FAQSection.tsx:6-11` (`faq-1`; `useState(items[0]?.id)` at line 33 opens it by default); (3) `src/data/mockServices.ts:17` (`srv-1.features`)
- **Classification:** Potentially Misleading
- **Priority:** Critical
- **Evidence reviewed:** None in the repository.
- **Why it needs attention:**
  - "Eliminating" and "completely bypassing" are absolute safety claims. The construct is not made of cells alone. It also contains bio-ink polymers and scaffold materials (GelMA, bio-ceramics and others named elsewhere on the site), and culture-expanded cells may have been exposed to non-autologous reagents. Immune and inflammatory responses to biomaterials are a recognized risk (auditor's general knowledge).
  - "Organ rejection" is the wrong term for skin and soft-tissue grafts.
  - "Stem cells isolated via punch biopsy" needs qualifying. A skin punch biopsy mainly yields fibroblasts and keratinocytes. It is not clear which stem-cell population is meant.
  - The answer leaves out the risks that remain (infection, graft loss, scarring at the biopsy site).
  - Item 3 ("Minimal immune rejection risk") is worded more cautiously and comes closer to defensible, but it still needs evidence.
- **Documentation / verification needed:** The biomaterial composition of the bio-ink and scaffold. Biocompatibility and immunogenicity data (for example, ISO 10993 testing). Clinical follow-up data on graft loss and its causes. The identity of the cell population isolated from the biopsy.
- **Recommended owner review:** Clinical and scientific leads should review the absolute wording and the cell-source description.

---

### C-05 — Case Studies: "100%" outcomes, "Evidence-Based Medicine", Doppler "verification"

- **Page / Route:** Case Studies `/case-studies` (also reachable from the header menu item "Clinical Partners — Our hospital network")
- **Exact existing wording:**
  1. Eyebrow: "Evidence-Based Medicine"
  2. Lead: "Detailed patient histories, therapeutic procedures, and 100% tissue remodeling outcomes verified by Doppler ultrasound."
  3. SEO description: "Review documented clinical case reports showcasing rapid wound closure, neck contracture restoration, and diabetic limb salvage."
  4. Case 1 title: "Complete Healing of Grade 3 Diabetic Foot Ulcer in 35 Days"
  5. Case 1 history and procedure: "A 61-year-old male with a 14-month history of non-healing neuropathic plantar ulcer unresponsive to conventional hyperbaric and debridement therapy." / "Application of vascularized ADSC-hydrogel membrane combined with bi-weekly low-level laser bio-stimulation."
  6. Case 1 outcome: "100% full-thickness skin closure achieved with neo-vascularization verified by Doppler ultrasound."
  7. Case 2 title: "Functional Range of Motion Restoration in Pediatric Neck Burn Contracture" (patient "K.S. (Age 9)")
  8. Case 2 procedure: "Surgical excision of scar tissue followed by immediate grafting of 3D bioprinted autologous skin matrix."
  9. Case 2 outcome: "Restoration of 85-degree cervical extension without graft shrinkage or donor site morbidity."
- **Source:** `src/pages/CaseStudies/CaseStudiesPage.tsx:7-44` (`caseStudies`), `:132-142` (SEO and hero). The menu entry is in `src/components/layout/navData.ts:74-79`.
- **Classification:** Potentially Misleading
- **Priority:** Critical
- **Evidence reviewed:** None. The page shows the caption "Illustrative image · not a patient photograph" (line 67), which is appropriate. No case records, consent forms or publication of these cases are in the repository.
- **Why it needs attention:**
  - Two single-patient cases do not make up "Evidence-Based Medicine", and they cannot support a general "100% ... outcomes" claim.
  - Doppler ultrasound measures blood flow. It does not verify "tissue remodeling" or skin closure, which are judged clinically or histologically.
  - "Grade 3" does not name its grading system (Wagner, University of Texas, etc.), so the severity cannot be interpreted.
  - Case 1 combines several interventions (the ADSC-hydrogel plus low-level laser), so the outcome cannot be attributed to the bio-therapy alone.
  - Case 2 describes grafting a **3D bioprinted autologous skin matrix into a 9-year-old**. That would be an investigational procedure in a pediatric patient. It needs ethics approval (IRB) and regulatory authorization (for example, an IND or expanded access) as well as parental consent and the child's assent.
  - Initials plus age plus condition plus surgeon name can make a patient identifiable. Publication requires documented HIPAA authorization.
  - The Case 1 timeline (14-month history, healed in 5 weeks) closely matches testimonial t-2 ("Robert Martinez", see C-06), but the initials differ ("D.M." vs "R.M."). Either the cases are unrelated or one record is wrong.
- **Documentation / verification needed:** De-identified case records. Written patient (and parental) authorization for publication. IRB approval and the regulatory pathway for each procedure. Measurement methods for outcomes (wound-area measurement, goniometry). The grading system used. Whether cases were selected or consecutive.
- **Recommended owner review:** The medical director, the privacy officer and legal should review. This should be done before any other edits to this page.

---

### C-06 — Patient testimonials presented as "Real testimonials" with clinical outcomes

- **Page / Route:** Home `/` (Patient Recovery Stories)
- **Exact existing wording:**
  1. Eyebrow and subtitle: "Clinical Success" / "Real testimonials from patients whose lives were transformed by living tissue bio-grafts." Each story shows a 5-star rating.
  2. Eleanor Vance (Burn Scar Treatment): "Following my severe burn injury, traditional skin grafts left tight, painful contractures. The 3D bioprinted autologous graft from Tissue Bioengineering restored both mobility and my skin’s natural appearance."
  3. Robert Martinez (Diabetic Foot): "I was facing amputation due to a chronic diabetic ulcer that hadn’t closed in 14 months. Their stem-cell bio-membrane therapy healed the wound completely in just 5 weeks."
  4. Sophia Lin (Facial Palsy): "The bio-engineered nerve conduit procedure restored nerve function and facial muscle control after years of palsy. The care and scientific expertise were world-class."
- **Source:** `src/pages/Home/PatientTestimonials.tsx:6-34` (`testimonials`), `:78-80` (header)
- **Classification:** Potentially Misleading
- **Priority:** Critical
- **Evidence reviewed:** None. No consent, source or date records are in the repository. `docs/image-sources.md` records that earlier stock portraits captioned as real staff were removed as misleading, which suggests other persona content may also need checking.
- **Why it needs attention:**
  - The word "Real" asserts authenticity, and the outcomes are dramatic (amputation avoided, complete healing, restored nerve function). In the US, endorsements must reflect the endorser's genuine experience, and results that are not typical generally need a clear disclosure (FTC Endorsement Guides, 16 CFR Part 255; auditor's general knowledge, not re-verified).
  - Testimonial 4 claims restored function "after years of palsy". Reinnervation after long-standing denervation is generally limited by muscle atrophy (auditor's general knowledge), so this claim needs particularly strong substantiation.
  - Testimonial 1 states that a "3D bioprinted autologous graft" was used clinically. That needs the same regulatory documentation as C-05.
- **Documentation / verification needed:** Signed patient authorization to use each name and quote. Confirmation that each quote is verbatim. The underlying treatment records. A statement of typical results for each therapy.
- **Recommended owner review:** Marketing compliance, legal and the privacy officer.

---

### C-07 — "Systemic Stem Cell & Exosome Therapy": infusions for multi-organ repair

- **Page / Route:** Services `/services` (7th service); Home `/` (Advanced Regenerative Therapies carousel, card 7); Technologies `/technologies` and Home (ExoPure™ applications)
- **Exact existing wording:**
  1. Title: "Systemic Stem Cell & Exosome Therapy"
  2. Short description: "Next-generation mesenchymal stem cell (MSC) and purified exosome infusions for multi-organ cellular repair."
  3. Full description: "Engineered extracellular vesicles carrying bioactive microRNAs and growth factors target systemic inflammation and cellular senescence."
  4. Features: "High-purity umbilical cord MSC exosomes", "Immune-evasive cellular formulations", "Standardized potency assay testing"
  5. Duration / Recovery: "Outpatient Infusion Protocol" / "1 - 2 Days"
  6. *(Not rendered)* Benefits: "Enhances systemic tissue rejuvenation", "Reduces oxidative stress markers", "Promotes organ function recovery"
  7. Home carousel card: "Next-generation regenerative approaches using mesenchymal stem-cell and exosome-based technologies." with "High-purity umbilical cord MSC exosomes" and "Immune-evasive cellular formulations"
  8. ExoPure™ application: "Systemic anti-inflammatory infusions"
- **Source:** `src/data/mockServices.ts:147-168` (`srv-7`); `src/pages/Home/ServicesOverview.tsx:87-97` (`case-7`); `src/data/technologies.ts:31`
- **Classification:** Potentially Misleading
- **Priority:** Critical
- **Evidence reviewed:** None in the repository. The supporting "Research" items cite DOIs that failed verification (C-08).
- **Why it needs attention:**
  - Systemic infusion of umbilical-cord-derived MSCs or exosomes for "multi-organ cellular repair", "cellular senescence" or "organ function recovery" is an investigational use. To the auditor's general knowledge (not re-verified), FDA has issued public safety notices about unapproved stem-cell and exosome products, and has said that products like these generally require an IND/BLA. Umbilical cord MSCs come from a donor (allogeneic). That conflicts with the site-wide emphasis on autologous safety (C-04).
  - "Immune-evasive" is a safety claim that is not substantiated.
  - Presenting this as a routine outpatient service with "1 - 2 Days" recovery suggests an established safety profile.
  - Infusion carries specific risks (for example, infusion reactions and embolic events) that the page does not mention.
- **Documentation / verification needed:** The regulatory status of the product (IND number, trial registration, or BLA). Donor eligibility and screening documentation (21 CFR 1271). Manufacturing and potency assay validation. Clinical safety and efficacy data for each claimed indication.
- **Recommended owner review:** Regulatory affairs, the medical director and legal. This finding has the highest regulatory exposure on the site.

---

### C-08 — Research DOIs do not correspond to the cited papers

- **Page / Route:** Home `/` (Research & Clinical Innovations: the first 3 items, with clickable "DOI" links); Research `/research` (all 8 items, with the DOI shown and linked)
- **Exact existing wording:**
  - Home subtitle: "Pioneering peer-reviewed discoveries across 3D Bioprinting, iPSC Stem Cells, Gene Editing, and Organ-on-Chip technology."
  - Research SEO description: "Peer-reviewed publications, patent portfolios, and breakthrough clinical trials across 3D Bioprinting, Stem Cells, Smart Biomaterials, Gene Editing, Organ-on-Chip, Drug Delivery, Tissue Engineering, and Nanotechnology."
  - 8 DOIs: see the table in Section 7.
- **Source:** `src/data/research.ts` (`doi` fields at lines 14, 29, 44, 59, 74, 89, 104, 119); rendered by `src/pages/Home/ResearchHighlights.tsx:41-50, 68, 72` and `src/components/cards/ResearchCard.tsx:44-54`; SEO at `src/pages/Research/ResearchPage.tsx:30`
- **Classification:** Potentially Misleading (verified mismatch)
- **Priority:** Critical
- **Evidence reviewed:** Each DOI was checked against the doi.org handle registry and Crossref on 2026-11-09, and each title was searched in Crossref (Section 7).
  - 6 of 8 DOIs are **not registered**.
  - 2 of 8 resolve to **unrelated papers** by different authors on different subjects.
  - No title search found a matching publication.
  - Two DOIs use an ACS numbering pattern ("5b", "6b") that appears to correspond to 2015 and 2016 manuscripts, while the site dates them 2025 and 2026.
- **Why it needs attention:** A DOI link signals peer-reviewed evidence. Visitors who click will reach either an error page or an unrelated paper (one is a coronavirus study in *Cell*). Every scientific claim that relies on the Research section therefore currently has no verifiable support. The named authors (for example "Prof. Marcus Vance", "Dr. Olivia Vance", "Dr. Liam Gallagher") could not be connected to these works.
- **Documentation / verification needed:** For each item, the correct full citation (authors, title, journal, year, volume, pages, DOI or PMID), or confirmation that the work is unpublished. The author list should match the published record.
- **Recommended owner review:** The research lead should supply citations. Any item without a verifiable citation should not be presented as "Published" or "peer-reviewed".

---

### C-09 — Bioprinted craniofacial grafts "permanently restore natural craniofacial symmetry"

- **Page / Route:** Home `/` (FAQ fourth question; carousel card 6); Services `/services` (6th service)
- **Exact existing wording:**
  1. Question: "Can 3D bioprinted cartilage restore severe facial asymmetry?" Answer: "Yes, by utilizing high-resolution 3D CT scans, our bio-engineers construct patient-specific osteo-chondral scaffolds that permanently restore natural craniofacial symmetry without donor-site surgical trauma."
  2. Short description: "Custom anatomical 3D bio-printed osteo-chondral constructs tailored for craniofacial contour restoration."
  3. Full description: "Using high-resolution CT scans, patient-specific bio-scaffolding printed with bio-ceramic and osteogenic stem cells seamlessly integrates with host facial bones."
  4. Features: "CT-scan accurate 3D CAD modeling", "Biphasic bone and cartilage bioprinting", "Osseointegrative bio-active coatings"
  5. Duration / Recovery: "Single Surgical Grafting" / "3 - 6 Months"
  6. *(Not rendered)* Benefits: "Perfect anatomical symmetry match", "Long-term structural permanence", "No metal hardware requirement"
  7. Home carousel card 6: "Custom anatomical 3D bio-engineered constructs designed for craniofacial contour and tissue reconstruction." (more cautious wording)
- **Source:** `src/pages/Home/FAQSection.tsx:24-29` (`faq-4`); `src/data/mockServices.ts:126-146` (`srv-6`); `src/pages/Home/ServicesOverview.tsx:76-86` (`case-6`)
- **Classification:** Potentially Misleading
- **Priority:** Critical
- **Evidence reviewed:** None.
- **Why it needs attention:** The FAQ answers a patient's question with an unqualified "Yes" and the word "permanently". The service text says "seamlessly integrates", and the unrendered benefits say "Perfect anatomical symmetry match". These are claims about long-term outcome and anatomical accuracy for a technology that, to the auditor's general knowledge, is largely investigational. "CT-scan accurate" does not state an accuracy tolerance. "Single Surgical Grafting" implies no revision surgery is ever needed. The FAQ question asks about "cartilage", but the answer describes osteo-chondral (bone plus cartilage) scaffolds.
- **Documentation / verification needed:** Clinical outcome data with follow-up duration, symmetry measurement method and revision rates. Regulatory status of the construct. Accuracy validation of the CT-to-print pipeline (for example, dimensional deviation in mm).
- **Recommended owner review:** Craniofacial surgical lead and regulatory affairs.

---

### C-10 — 24/7 "Urgent Burn / Trauma Hotline" (patient-safety reliance)

- **Page / Route:** Contact `/contact`
- **Exact existing wording:** "Urgent Burn / Trauma Hotline". "Emergency transfer team available 24/7 for acute surgical consults:" followed by "+1 (800) 999-REGEN" (a `tel:` link)
- **Source:** `src/pages/Contact/ContactPage.tsx:72-87`; number at `src/lib/site.ts:13`
- **Classification:** Needs Owner Confirmation
- **Priority:** Critical (patient safety)
- **Evidence reviewed:** The number is a vanity string. The `tel:` link is built directly from it (`tel:+1 (800) 999-REGEN`), letters included. Many phone dialers do not convert letters, and "999-REGEN" has more characters than a 7-digit subscriber number, so it is unclear which digits get dialed. The repository does not show whether the line exists or is staffed around the clock.
- **Why it needs attention:** Someone with an acute burn or trauma may rely on this line. If it is not answered 24/7 by qualified staff, that is a direct safety risk. The page does not tell users to call emergency services (for example 911) in a life-threatening situation. (This is an observation, not an edit.)
- **Documentation / verification needed:** Confirmation that the number is live, its exact digits, its staffing model and hours, and the escalation protocol.
- **Recommended owner review:** Clinical operations, urgently.

---

## 4. High-Priority Findings

### H-01 — "2,450+ Successful Bio-Grafts"

- **Page / Route:** Home `/` (Statistics)
- **Exact existing wording:** "2,450" "+". Label: "Successful Bio-Grafts". Description: "Living tissue matrix grafts implanted across burn, trauma, and ulcer cases."
- **Source:** `src/pages/Home/StatisticsSection.tsx:7-14`
- **Classification:** Needs Owner Confirmation
- **Priority:** High
- **Evidence reviewed:** None.
- **Why it needs attention:** This claims a large clinical volume of living tissue graft implantation. It also implies that "living tissue matrix grafts" are routinely implanted in patients, which bears on regulatory status (C-01). "Successful" is not defined.
- **Documentation / verification needed:** A procedure registry or count with dates, sites, graft type and a definition of success.
- **Recommended owner review:** Clinical operations and quality.

### H-02 — "3.5x Clinical Closure Speed"

- **Page / Route:** Home `/` (Statistics)
- **Exact existing wording:** "3.5" "x". Label: "Clinical Closure Speed". Description: "Accelerated microvascular formation compared to conventional dressings."
- **Source:** `src/pages/Home/StatisticsSection.tsx:23-30`
- **Classification:** Potentially Misleading
- **Priority:** High
- **Evidence reviewed:** None.
- **Why it needs attention:** The label (wound *closure* speed) and the description (*microvascular formation*) describe two different endpoints. "Conventional dressings" does not name a comparator, and no study, sample size or wound type is given. The figure also conflicts with other speed claims on the site (H-03).
- **Documentation / verification needed:** The comparative study: design, comparator, endpoint definition, population and statistics.
- **Recommended owner review:** Clinical research lead.

### H-03 — Inconsistent wound-closure acceleration figures ("up to 50%", "45%")

- **Page / Route:** Home `/` (Why Choose Us); data only (service benefits)
- **Exact existing wording:**
  1. "Rapid Angiogenesis & Closure Rates": "Bio-active matrix formulations release pro-angiogenic factors, reducing deep wound closure timelines by up to 50%."
  2. *(Not rendered)* "Faster closure time by 45%"
- **Source:** (1) `src/pages/Home/WhyChooseUs.tsx:24-29`; (2) `src/data/mockServices.ts:74` (`srv-3.benefits`)
- **Classification:** Unverified
- **Priority:** High
- **Evidence reviewed:** None.
- **Why it needs attention:** Three different acceleration figures appear: "up to 50%" shorter, 45% faster, and 3.5x (H-02). A 3.5x speed-up would mean roughly a 71% shorter timeline, which matches neither of the others. Without a source, readers cannot tell which figure (if any) is correct.
- **Documentation / verification needed:** The source study for each figure, or one reconciled, sourced figure.
- **Recommended owner review:** Clinical research lead.

### H-04 — Diabetic ulcer recovery timeline in FAQ

- **Page / Route:** Home `/` (FAQ second question)
- **Exact existing wording:** Question: "What is the recovery timeframe for diabetic ulcer tissue grafting?" Answer: "Most chronic non-healing diabetic foot ulcers achieve significant re-vascularization within 14 days and complete full-thickness wound closure within 3 to 5 weeks."
- **Source:** `src/pages/Home/FAQSection.tsx:12-17` (`faq-2`)
- **Classification:** Unverified
- **Priority:** High
- **Evidence reviewed:** None.
- **Why it needs attention:** "Most" implies a measured majority in a defined population. The timeline also differs from the Services page ("2 - 4 Weeks" treatment, "1 - 2 Months" recovery, `src/data/mockServices.ts:52-53`) and from the article's "92%" closure claim (H-05). Patients with chronic diabetic foot ulcers may base treatment decisions on this.
- **Documentation / verification needed:** Outcome data (proportion healed by week 5, population, ulcer grade, comparator).
- **Recommended owner review:** Clinical research lead.

### H-05 — Article: "clinical trial closure rates hit 92%"

- **Page / Route:** Articles `/articles` and Home (card summary); article detail `/articles/diabetic-wound-care-breakthroughs-2026` (body)
- **Exact existing wording:**
  1. Title: "Conquering Non-Healing Diabetic Foot Ulcers with Pro-Angiogenic Scaffolds"
  2. Summary: "Integrating vascular endothelial growth factor (VEGF) releasing matrices into outpatient ulcer treatment protocols."
  3. Body: "Diabetic micro-vascular insufficiency leads to limb-threatening foot ulcers. By restoring capillary blood flow through VEGF functionalized scaffolding, clinical trial closure rates hit 92%..."
- **Source:** `src/data/articles.ts:42-60` (`art-3`); the body is rendered by `src/pages/Articles/ArticleDetailPage.tsx:80-84`
- **Classification:** Unverified
- **Priority:** High
- **Evidence reviewed:** None. No trial is named, and no registry ID or reference is given.
- **Why it needs attention:** It cites a specific trial result with no identifiable trial. "Conquering" overstates the outcome. The body is a teaser fragment ending in "...", so the 92% figure appears with no context such as follow-up period, comparator or sample size (see L-04). The article is attributed to "Dr. Michael Chen, Director of Clinical Research", whose title differs on the About page (L-03).
- **Documentation / verification needed:** The trial registration (for example an NCT number), the publication, and the endpoint definition.
- **Recommended owner review:** The article author and the clinical research lead.

### H-06 — Burn scar and bioprinted skin: "eliminates donor-site morbidity" and restoration claims

- **Page / Route:** Home `/` (Core Services timeline row 01; carousel card 8); About `/about`; Services `/services` (1st service)
- **Exact existing wording:**
  1. Home timeline: "Advanced autologous skin tissue engineering and cellular matrix deposition for complex burn scar reconstruction. Our approach eliminates donor-site morbidity by creating full-thickness skin grafts in 3D bioprinted matrices."
  2. About: "Traditional reconstructive techniques rely on harvesting donor skin from uninjured body parts, leaving painful donor sites and disfiguring scars. Our tissue bioengineering approach eliminates donor-site morbidity by creating full-thickness skin grafts in 3D bioprinted matrices seeded with autologous stem cells."
  3. Short description: "Autologous skin tissue engineering and cellular matrix deposition for third-degree burn scar replacement."
  4. Full description: "Our burn scar therapy uses patient-derived dermal fibroblasts and keratinocytes cultured on biodegradable scaffolds to restore elasticity, pigmentation, and tactile sensation."
  5. Feature: "Restoration of skin elasticity and microvascular network"
  6. *(Not rendered)* Benefits: "Reduces contracture formation", "Improves cosmetic appearance", "Accelerates re-epithelialization"
  7. Home carousel card 8: "3D Bioprinted Skin Reconstruction": "Advanced 3D bioprinting approaches for engineering skin-equivalent tissue structures for complex tissue reconstruction."
- **Source:** `src/pages/Home/CoreServicesTimeline.tsx:20-29`; `src/pages/About/AboutPage.tsx:83-88`; `src/data/mockServices.ts:4-30` (`srv-1`); `src/pages/Home/ServicesOverview.tsx:98-108` (`case-8`)
- **Classification:** Potentially Misleading
- **Priority:** High
- **Evidence reviewed:** None. The site's own process contradicts the claim: the Treatment Process section begins with "a 2mm skin punch biopsy" (`src/pages/Home/TreatmentProcess.tsx:11`), which is itself a small donor site.
- **Why it needs attention:**
  - "Eliminates donor-site morbidity" is absolute, and the site's own process description contradicts it. "Minimizes" or "reduces" would be what a punch biopsy supports, if evidence exists.
  - Restoring "pigmentation, and tactile sensation" (sensory reinnervation) in third-degree burn scars is a strong functional claim.
  - The item says "Autologous stem cells" while the service text says "dermal fibroblasts and keratinocytes". These differ, and the cell source should be stated consistently.
- **Documentation / verification needed:** Clinical data on donor-site outcomes, pigmentation and sensation recovery (with measurement methods). The regulatory status of the bioprinted skin product.
- **Recommended owner review:** Burn and reconstructive lead, and regulatory affairs.

### H-07 — Diabetic foot service claims

- **Page / Route:** Services `/services` (2nd service); Home `/` (timeline row 02; carousel card 2)
- **Exact existing wording:**
  1. Title: "Diabetic Foot Ulcer Tissue Grafting"
  2. Short description: "Vascularized stem-cell hydrogels designed to jumpstart healing in chronic non-healing diabetic lower-limb ulcers."
  3. Full description: "Using pro-angiogenic factors combined with adipose-derived stem cells (ADSCs), our diabetic foot therapy stimulates rapid capillary sprouting and tissue regeneration in ischemic wound beds."
  4. Features: "Pro-angiogenic growth factor release", "ADSC cell matrix infusion", "Anti-microbial peptide coating", "Non-invasive topical bio-membrane application"
  5. *(Not rendered)* Benefits: "Prevents amputation risks", "Promotes micro-vascular formation", "Significantly lowers infection recurrence"
  6. Home timeline row 02 (more cautious): "Advanced tissue-engineering approaches designed to support healing in chronic, non-healing diabetic lower-limb ulcers using pro-angiogenic growth factor release."
- **Source:** `src/data/mockServices.ts:31-57` (`srv-2`); `src/pages/Home/CoreServicesTimeline.tsx:30-39`; `src/pages/Home/ServicesOverview.tsx:32-42`
- **Classification:** Unverified
- **Priority:** High
- **Evidence reviewed:** None.
- **Why it needs attention:** "Stimulates rapid capillary sprouting ... in ischemic wound beds" is an efficacy claim for a high-risk population. The unrendered "Prevents amputation risks" would be a Critical claim if it were ever rendered. The title says "Tissue Grafting", but the feature says "Non-invasive topical bio-membrane application", which is inconsistent. ADSCs combined with growth factors in a hydrogel would generally be a regulated combination biologic product (auditor's general knowledge).
- **Documentation / verification needed:** Clinical efficacy data, the composition of the "anti-microbial peptide coating", the regulatory status, and data on amputation and infection outcomes before any such benefit is published.
- **Recommended owner review:** Wound-care clinical lead and regulatory affairs.

### H-08 — Keloid and hypertrophic scar therapy: gene silencing and enzymatic dissolution

- **Page / Route:** Services `/services` (4th service); Home `/` (timeline row 04; carousel card 4)
- **Exact existing wording:**
  1. Short description: "Targeted gene-silencing and micro-needle cell delivery to regress fibrotic scar tissue."
  2. Full description: "Combines miRNA targeted therapy with extracellular matrix-degrading enzymes to dissolve excess collagen deposits in keloids and hypertrophic scars."
  3. Features: "Targeted TGF-beta pathway inhibition", "Enzymatic collagen degradation", "Precision micro-needle delivery system"
  4. Home timeline row 04: "Advanced regenerative approaches targeting abnormal scar tissue remodeling and fibrotic tissue formation through targeted TGF-beta pathway inhibition."
  5. Recovery: "Minimal downtime"
  6. *(Not rendered)* Benefits: "Smooths elevated scar tissue", "Restores natural skin tone", "Relieves itching and tightness"
- **Source:** `src/data/mockServices.ts:84-104` (`srv-4`); `src/pages/Home/CoreServicesTimeline.tsx:50-59`; `src/pages/Home/ServicesOverview.tsx:54-64`
- **Classification:** Unverified
- **Priority:** High
- **Evidence reviewed:** None. The related research item (`res-4`, CRISPR prime editing in keloids) has a DOI that resolves to an unrelated paper (C-08), and its status is "In Development".
- **Why it needs attention:** miRNA-targeted gene-silencing therapy is presented as an available clinical service. To the auditor's general knowledge, miRNA therapeutics for keloids are investigational, and gene-silencing products would require IND/BLA oversight. "Minimal downtime" is an unqualified safety and recovery claim. "Cell delivery" in the short description is not explained by the full description.
- **Documentation / verification needed:** The identity of the miRNA product and enzyme, regulatory status, and clinical data.
- **Recommended owner review:** Dermatology and scar-management lead, and regulatory affairs.

### H-09 — "ISO 13485 & GMP Certified Cleanrooms" and related certification wording

- **Page / Route:** Home `/` (Why Choose Us; Technologies specs; Treatment Process); every page (footer badge); About `/about`; Technologies `/technologies`
- **Exact existing wording:**
  1. Title: "GMP & ISO 13485 Certified Cleanrooms"
  2. Description: "All bio-ink compounding and cellular scaffold processing occurs within ISO Class 5 sterile medical cleanrooms adhering to FDA standards."
  3. Footer badge: "ISO 13485 & GMP Certified Cleanrooms"
  4. About fact: "ISO Class 5" / "Sterile Cleanrooms"
  5. BioMatrix-3D™ spec: "Sterilization Rating": "ISO Class 5 Cleanroom"
  6. ExoPure™ spec: "Validation": "GMP Compliant"
  7. ExoPure™ badge: "GMP Certified"
  8. Treatment step 2: "Culturing patient fibroblasts and endothelial cells inside ISO cleanroom bioreactors for bio-ink compounding."
  9. ExoPure™ tagline: "Tangential flow filtration bioreactor for clinical-grade exosome harvesting"
- **Source:** (1–2) `src/pages/Home/WhyChooseUs.tsx:18-23`; (3) `src/components/layout/Footer.tsx:47-50`; (4) `src/pages/About/AboutPage.tsx:17`; (5) `src/data/technologies.ts:14`; (6) `:29`; (7) `:33`; (8) `src/pages/Home/TreatmentProcess.tsx:17-20`; (9) `src/data/technologies.ts:23`
- **Classification:** Potentially Misleading
- **Priority:** High
- **Evidence reviewed:** No certificate, certifying body, scope statement or cleanroom classification report is in the repository. Certification-body registers were not queried.
- **Why it needs attention:** These notes on terminology come from the auditor's general knowledge and were not re-verified.
  - **ISO 13485** certifies an *organization's* quality management system for medical devices, for a defined scope and sites. It does not certify a cleanroom.
  - **"ISO Class 5"** is an airborne-particle cleanliness class under ISO 14644-1. It is not a sterility or "sterilization rating", and a classified cleanroom is not a "sterile" room.
  - **GMP**: in the US, FDA inspects facilities for compliance with cGMP regulations (for example 21 CFR 210/211, 1271 and 820) but does not issue "GMP certificates". Some other jurisdictions do issue GMP certificates. The site says "GMP Compliant" in the spec table and "GMP Certified" in the badge for the same product, which is inconsistent.
  - **"Adhering to FDA standards"** does not identify which regulation or standard.
  - **"Clinical-grade"** implies release specifications for clinical use.
- **Documentation / verification needed:** The ISO 13485 certificate (certifying body, certificate number, scope, sites, validity). ISO 14644-1 cleanroom classification reports. Any GMP certificate (issuing authority) or FDA inspection outcome. The release specifications behind "clinical-grade".
- **Recommended owner review:** The quality/regulatory manager should confirm what is certified, by whom, and for what scope.

### H-10 — HIPAA compliance claims on the medical intake form

- **Page / Route:** Consultation `/consultation`; every page (footer legal links)
- **Exact existing wording:**
  1. "HIPAA Compliant:" "Encrypted medical record transmission & patient confidentiality."
  2. Consent checkbox: "I consent to Tissue Bioengineering processing my medical intake details confidentially under HIPAA guidelines."
  3. "Physician Referrals": "Referring plastic surgeons, endocrinologists, and trauma centers can submit patient charts directly via secure portal or phone."
  4. Success message shown after submitting: "Consultation request submitted successfully. Our clinical team will reach out within 24 hours."
  5. Footer: "Privacy Policy", "Terms of Clinical Care" and "Ethics & Compliance" link to `#`
- **Source:** (1) `src/pages/Consultation/ConsultationPage.tsx:18-22`; (2) `src/pages/Consultation/ConsultationForm.tsx:192-195`; (3) `src/pages/Consultation/ConsultationPage.tsx:70-75`; (4) `src/lib/api.ts:42-55`; (5) `src/components/layout/Footer.tsx:118-122`
- **Classification:** Needs Owner Confirmation
- **Priority:** High
- **Evidence reviewed:** Code only.
  - `src/lib/api.ts:42-55` resolves with `success: true` and the message above **even when the request fails** (the code comment notes this is known). A patient's medical intake can therefore be lost while the patient is told it was received and that the team "will reach out within 24 hours".
  - No "secure portal" exists on the site.
  - No privacy policy or Notice of Privacy Practices is linked (the links point to `#`).
  - No Business Associate Agreement, security assessment or hosting documentation is in the repository.
- **Why it needs attention:** "HIPAA Compliant" is a legal-compliance claim about how protected health information is handled. A false confirmation of receipt for a medical request is a patient-safety and trust problem: someone may wait for a call that never comes. (This is noted as a content issue. The audit did not change behavior.)
- **Documentation / verification needed:** A HIPAA risk assessment, BAAs with the hosting and API providers, encryption-in-transit and at-rest details for `api.tissuebioengineering.com`, the Notice of Privacy Practices, and the actual referral portal.
- **Recommended owner review:** Privacy/compliance officer, plus engineering for the failure-message behavior.

### H-11 — Clinician identities, credentials and reputation claims

- **Page / Route:** About `/about`; Case Studies `/case-studies`; Articles; Research; Consultation
- **Exact existing wording:**
  1. "Founded by world-renowned reconstructive surgeons and stem cell bioengineers, Tissue Bioengineering bridges fundamental cellular biology with clinical plastic surgery."
  2. "Dr. Aris Thorne, MD, PhD", "Chief Scientific Officer & Co-Founder": "Pioneer in 3D bioprinting micro-vascular networks with over 20 years in plastic surgery innovation."
  3. "Dr. Elena Rostova, PhD", "Head of Regenerative Therapeutics": "Specialist in umbilical mesenchymal stem cell paracrine factors and purified exosome delivery."
  4. "Dr. Michael Chen, MD", "Director of Clinical Surgery": "Leading reconstructive surgeon focused on diabetic lower limb salvage and complex burn care."
  5. "World-Class Bioengineers & Surgeons" / "Our multidisciplinary board combines plastic surgery pioneers, microfluidics experts, and stem cell scientists."
  6. Case studies "Attending Surgeon:" "Dr. Michael Chen, MD" and "Dr. Aris Thorne, MD, PhD"
  7. Consultation: "45-Minute Review:" "Comprehensive evaluation with a senior plastic reconstructive surgeon."
- **Source:** `src/pages/About/AboutPage.tsx:22-38, 60, 119-121`; `src/pages/CaseStudies/CaseStudiesPage.tsx:23, 42`; `src/pages/Consultation/ConsultationPage.tsx:8-12`
- **Classification:** Needs Owner Confirmation
- **Priority:** High
- **Evidence reviewed:** No CVs, licensure, board certification or publication records. `docs/image-sources.md` records that stock photos captioned as these people were removed because they "showed people who are not on the team". That confirms the photos were not of these people, but it does not establish whether the people are real.
- **Why it needs attention:** Medical degrees (MD), surgical roles and "attending surgeon" attributions are claims about professional licensure that patients rely on. "World-renowned", "Pioneer" and "Leading" are reputational claims. The research author lists (for example "Prof. Marcus Vance", "Dr. Sarah Jenkins", "Dr. Liam Gallagher") are tied to DOIs that failed verification (C-08).
- **Documentation / verification needed:** For each named person: confirmation of employment and role, degrees, medical licensure (state and number), board certification, and a publication record supporting "pioneer" or "specialist" claims.
- **Recommended owner review:** HR and the medical staff office.

### H-12 — "The 4-Step Bio-Grafting Process" (clinical workflow and timeline)

- **Page / Route:** Home `/` (Clinical Journey)
- **Exact existing wording:**
  1. Subtitle: "From initial cellular harvest to 3D bio-printing and vascularized tissue integration."
  2. Step 1, "3D Scan & Cell Biopsy" (Day 1): "High-resolution laser 3D scanning of the defect site paired with a 2mm skin punch biopsy to isolate autologous stem cells."
  3. Step 2, "Cell Expansion & Bio-Ink Formulation" (Days 2 - 10): "Culturing patient fibroblasts and endothelial cells inside ISO cleanroom bioreactors for bio-ink compounding."
  4. Step 3, "3D Bioprinting Scaffolding" (Day 11): "Stereolithographic 3D printing of custom vascularized living tissue grafts matched precisely to CT anatomy."
  5. Step 4, "Clinical Graft Placement & Remodeling" (Weeks 2 - 6): "Minimally invasive graft placement by surgical specialists, followed by rapid microvascular integration."
- **Source:** `src/pages/Home/TreatmentProcess.tsx:6-39, 55`
- **Classification:** Unverified
- **Priority:** High
- **Evidence reviewed:** None.
- **Why it needs attention:**
  - This presents bioprinted *vascularized* living tissue grafts as a routine clinical pipeline with a fixed 11-day timeline. To the auditor's general knowledge, vascularization of thick bioprinted tissue remains a major unsolved research challenge. The site's own research item res-1 calls perfusion "a fundamental bottleneck".
  - Whether a 2 mm biopsy can be expanded to graft-scale cell numbers in about 9 days needs process data.
  - Step 1 says "laser 3D scanning", while Step 3 says the graft is matched to "CT anatomy". These are different imaging modalities.
  - "Endothelial cells" appear in Step 2, but a skin punch biopsy is not described as a source of them.
  - "Rapid microvascular integration" is an efficacy claim.
- **Documentation / verification needed:** Validated manufacturing process records (cell yield, expansion time, release criteria), the imaging protocol, clinical integration data, and regulatory status.
- **Recommended owner review:** Manufacturing/process development and clinical leads.

### H-13 — SmartScaff-Gel: "Zero Cytotoxicity", filler and joint applications

- **Page / Route:** Technologies `/technologies`; Home `/` (Engineered Hardware & Biomaterials)
- **Exact existing wording:**
  1. Tagline: "pH & Temperature responsive extracellular hydrogel scaffold"
  2. Description: "Injectable bioactive matrix that polymerizes in situ upon reaching core body temperature, releasing bioactive signals for 30 days."
  3. Gelation: "Instant at 37°C"
  4. Degradation: "Tunable 2 to 12 weeks"
  5. Biocompatibility: "Zero Cytotoxicity"
  6–8. Applications: "Deep wound beds", "Facial asymmetry filler", "Joint cartilage seeding"
- **Source:** `src/data/technologies.ts:35-49` (`tech-3`)
- **Classification:** Potentially Misleading
- **Priority:** High
- **Evidence reviewed:** None.
- **Why it needs attention:**
  - "Zero Cytotoxicity" is not a recognized result. Cytotoxicity testing (for example ISO 10993-5) reports whether a material passes against a threshold (such as ≥70% viability). It does not report "zero" (auditor's general knowledge).
  - "Instant" gelation is not quantified.
  - "Releasing bioactive signals for 30 days" does not say which signals were released, or how the release was measured.
  - An injectable "Facial asymmetry filler" and intra-articular "Joint cartilage seeding" are clinical uses that are generally regulated as high-risk devices or combination products in the US (dermal fillers are Class III devices; auditor's general knowledge). Listing them as applications implies the product is available for those uses.
  - The badge "Patented Bio-ink" is applied to a hydrogel scaffold (see M-04).
- **Documentation / verification needed:** ISO 10993 biocompatibility test reports, gelation kinetics data, release-profile data, degradation data, and the regulatory status for each listed application.
- **Recommended owner review:** Biomaterials R&D and regulatory affairs.

### H-14 — BioMatrix-3D™: 98% cell survival, contradictory resolution claims

- **Page / Route:** Technologies `/technologies`; Home `/` (Engineered Hardware & Biomaterials; Why Choose Us)
- **Exact existing wording:**
  1. Tagline: "Sub-micron stereolithographic bio-printer with live cell viability control"
  2. Description: "State-of-the-art multi-material bioprinter capable of printing up to four bio-ink formulations simultaneously with 98% cell survival rate."
  3. Resolution: "5 Microns"
  4. Bio-ink Channels: "4 Independent Nozzles"
  5–7. Applications: "Full-thickness skin grafts", "Vascularized bone scaffolds", "Nerve guidance channels"
  8. Why Choose Us: "5-Micron 3D Bio-Printing Precision": "Our proprietary stereolithographic bioprinters reproduce microscopic vascular capillary networks essential for tissue survival."
- **Source:** `src/data/technologies.ts:4-19` (`tech-1`); `src/pages/Home/WhyChooseUs.tsx:12-17`
- **Classification:** Potentially Misleading
- **Priority:** High
- **Evidence reviewed:** None.
- **Why it needs attention:**
  - The tagline says "Sub-micron" (below 1 µm), but the spec table says "5 Microns". These contradict each other.
  - Stereolithography is a vat photopolymerization method that does not use nozzles, yet the spec lists "4 Independent Nozzles" (extrusion or inkjet hardware). The technical description is internally inconsistent (auditor's general knowledge).
  - "98% cell survival rate" does not state the cell type, the assay, or the time point.
  - Saying the printers "reproduce microscopic vascular capillary networks essential for tissue survival" claims a functional result that is not substantiated.
  - The unrendered research details claim "10-micron channel resolutions" (`src/data/research.ts:12`), which is a third resolution figure.
- **Documentation / verification needed:** The device datasheet, resolution test method, viability assay data (cell type, assay, time point), and evidence of functional vascular networks.
- **Recommended owner review:** Engineering and R&D.

### H-15 — Research status labels: "Clinical Trial" and "In Development"

- **Page / Route:** Home `/` (res-2 is among the first three items); Research `/research`
- **Exact existing wording:**
  1. "Autologous iPSC-Derived Chondrocytes for Articular Surface Renewal", status "Clinical Trial"
  2. "Nanostructured Silver-Graphene Bio-Active Dressings for Antimicrobial Wound Regeneration", status "Clinical Trial"
  3. "CRISPR-Prime Editing Knockdown of Fibrotic Collagen Genes in Keloids", status "In Development", shown with a DOI link implying publication in *Cell*
- **Source:** `src/data/research.ts:19-33` (`res-2`), `:109-123` (`res-8`), `:49-63` (`res-4`)
- **Classification:** Needs Owner Confirmation
- **Priority:** High
- **Evidence reviewed:** No trial registry IDs. The res-2 DOI is not registered. The res-4 DOI resolves to an unrelated SARS-CoV-2 paper. The res-8 DOI is not registered.
- **Why it needs attention:**
  - An iPSC-derived cell therapy in a "Clinical Trial" would require regulatory authorization (for example an IND) and trial registration. The unrendered `fullDetails` for res-2 describe only "animal models", which conflicts with a clinical-trial status.
  - "In Development" alongside a DOI link to *Cell* (res-4) is contradictory.
- **Documentation / verification needed:** Trial registration numbers (for example NCT IDs), IND numbers, and sponsor. Otherwise, correct statuses.
- **Recommended owner review:** Research lead and clinical trials office.

### H-16 — Vitiligo: stem-cell and exosome therapy "to restore pigmentation"

- **Page / Route:** Home `/` (Core Services timeline row 06; the "Learn More" link goes to the systemic stem-cell service)
- **Exact existing wording:** Title "Vitiligo": "Next-generation regenerative approaches using mesenchymal stem-cell and exosome-based technologies to restore pigmentation and cellular balance."
- **Source:** `src/pages/Home/CoreServicesTimeline.tsx:70-79`
- **Classification:** Unverified
- **Priority:** High
- **Evidence reviewed:** None. Vitiligo is not among the site's therapy categories (`src/lib/site.ts:23-31`), and no service, research item or article covers it.
- **Why it needs attention:** This is an efficacy claim ("restore pigmentation") for MSC and exosome therapy in an autoimmune pigmentary disorder, with no supporting content anywhere on the site. "Cellular balance" is not a defined clinical concept. The link sends readers to the systemic infusion service (C-07).
- **Documentation / verification needed:** Clinical evidence for this indication, and its regulatory status.
- **Recommended owner review:** Dermatology lead and regulatory affairs.

---

## 5. Medium-Priority Findings

### M-01 — ExoPure™ performance specifications

- **Page / Route:** Technologies `/technologies`; Home `/`
- **Exact existing wording:**
  1. Description: "Automated closed-loop isolation platform that purifies high-potency extracellular vesicles from stem cell conditioned media without shear damage."
  2. Purity: ">99.2% intact exosomes"
  3. Throughput: "10 Liters / Batch"
  4. Application: "Targeted cosmetic hydrogels"
  5. Tagline wording "high-potency" (part of item 1, counted separately)
- **Source:** `src/data/technologies.ts:20-34` (`tech-2`)
- **Classification:** Needs Owner Confirmation
- **Priority:** Medium
- **Evidence reviewed:** None.
- **Why it needs attention:** The purity figure has no characterization method attached. EV purity is usually reported with specific methods (for example particle-to-protein ratio, NTA, marker panels), and "intact exosomes" is not a standard purity metric. "Without shear damage" and "high-potency" are performance claims without data. Cosmetic exosome products have their own regulatory considerations.
- **Documentation / verification needed:** Characterization data (methods and results), the potency assay, and validation reports.
- **Recommended owner review:** Bioprocess R&D.

### M-02 — Smart wound matrix: mechanism and benefit claims

- **Page / Route:** Services `/services` (3rd service); Home `/` (timeline row 03; carousel card 3)
- **Exact existing wording:**
  1. Short description: "Bio-interactive collagen-nanofiber hydrogels engineered for accelerated acute and trauma wound remodeling."
  2. Full description: "Smart biomaterials respond dynamically to wound bed micro-environments (pH and ROS levels), releasing localized therapeutic agents to optimize natural healing cascades."
  3–5. Features: "pH-responsive drug release", "Electrospun nanofiber scaffolding", "Sustained anti-inflammatory signaling"
  6. Timeline row 03: "Bio-interactive biomaterial systems engineered to support accelerated acute and trauma wound remodeling with pH-responsive drug release and electrospun nanofiber scaffolding."
  7. Carousel card 3: "Bio-interactive biomaterial systems engineered to support accelerated acute and trauma wound remodeling."
  8–9. *(Not rendered)* Benefits: "Reduced keloid and hypertrophic scar formation", "Pain mitigation properties"
- **Source:** `src/data/mockServices.ts:58-83` (`srv-3`); `src/pages/Home/CoreServicesTimeline.tsx:40-49`; `src/pages/Home/ServicesOverview.tsx:43-53`
- **Classification:** Unverified
- **Priority:** Medium
- **Evidence reviewed:** None.
- **Why it needs attention:** "Accelerated" is an efficacy claim. "Releasing localized therapeutic agents" does not name the agent, which matters for drug/device classification. The rendered wording is mostly mechanistic and partly hedged ("engineered to support"), so the risk is lower than H-07 or H-08. The unrendered benefits would be outcome claims.
- **Documentation / verification needed:** The identity of the therapeutic agent, release data, and clinical wound-healing data.
- **Recommended owner review:** Biomaterials R&D.

### M-03 — Facial nerve regeneration: conduit claims

- **Page / Route:** Services `/services` (5th service); Home `/` (timeline row 05; carousel card 5)
- **Exact existing wording:**
  1. Short description: "Conductive nerve guidance conduits infused with neurotrophic stem cells for re-innervating facial muscles."
  2. Full description: "Bio-synthetic nerve conduits provide structural alignment and electrical guidance cues to promote rapid axonal sprouting across damaged facial nerve gaps."
  3–5. Features: "Piezoelectric conductive polymers", "Schwann cell supportive matrix", "Custom 3D printed conduit geometry"
  6. Duration / Recovery: "Surgical Placement + 6 Months Therapy" / "6 - 12 Months"
  7–9. *(Not rendered)* Benefits: "Restores facial expression symmetry", "Speeds up nerve regeneration rates", "Minimizes graft donor-site morbidity"
  10. Timeline row 05: "Advanced nerve-guidance and regenerative strategies designed to support facial nerve reconstruction and muscle re-innervation using conductive nerve guidance conduits."
  11. Carousel card 5: "Advanced nerve-guidance and regenerative strategies designed to support facial nerve reconstruction and muscle re-innervation."
- **Source:** `src/data/mockServices.ts:105-125` (`srv-5`); `src/pages/Home/CoreServicesTimeline.tsx:60-69`; `src/pages/Home/ServicesOverview.tsx:65-75`
- **Classification:** Unverified
- **Priority:** Medium
- **Evidence reviewed:** None.
- **Why it needs attention:** "Neurotrophic stem cells" does not identify the cell type. "Rapid axonal sprouting" is an efficacy claim. The recovery estimate is presented without outcome data. Testimonial t-3 (C-06) makes the outcome claim this service text avoids.
- **Documentation / verification needed:** The cell type and source, the conduit material and its regulatory status, and clinical outcome data (for example House-Brackmann scores).
- **Recommended owner review:** Facial reanimation lead.

### M-04 — Patent and trademark claims

- **Page / Route:** Home `/` (Statistics); About `/about`; Technologies `/technologies`; Home (Technologies section)
- **Exact existing wording:**
  1. "18". Label: "Patented Bio-Inks". Description: "Proprietary extracellular formulations protected under international patents."
  2. About: "18+ Patents" / "Bio-ink Innovations"
  3. Technologies page title: "Patented Bio-Engineering Platforms"
  4. Badge: "Patented Bio-ink" (SmartScaff-Gel)
  5–6. Trademark symbols: "BioMatrix-3D™", "ExoPure™"
- **Source:** `src/pages/Home/StatisticsSection.tsx:31-38`; `src/pages/About/AboutPage.tsx:18`; `src/pages/Technologies/TechnologiesPage.tsx:20`; `src/data/technologies.ts:6, 22, 48`
- **Classification:** Needs Owner Confirmation
- **Priority:** Medium
- **Evidence reviewed:** None. Patent registries were not queried.
- **Why it needs attention:**
  - "18" and "18+" differ.
  - There is no such thing as an "international patent". Patents are granted nationally or regionally, and a PCT filing is an international *application* (auditor's general knowledge).
  - "Patented ... Platforms" implies that all three platforms are patented.
  - "Patented" (granted) and "patent pending" are distinct, and a misstatement can raise false-marking concerns.
- **Documentation / verification needed:** The list of granted patent numbers by jurisdiction, mapped to each product, and any trademark registrations.
- **Recommended owner review:** IP counsel.

### M-05 — Superiority and leadership claims

- **Page / Route:** Site-wide (SEO default and footer), Home, Contact, header menu
- **Exact existing wording:**
  1. "Leading biotechnology institution specializing in Advanced Tissue Engineering, Regenerative Medicine, Stem Cell Research, and Bio-printed Graft Solutions." (footer and default meta description)
  2. Home SEO: "Home | Pioneer in Bio-Grafting & 3D Bioprinting" / "Leading Tissue Bioengineering and Regenerative Medicine institution specializing in Burn Scar Treatment, Diabetic Foot Ulcers, Facial Palsy, and 3D Bioprinted Skin Matrices."
  3. "Why Tissue Bioengineering Leads" / "Combining advanced microfluidics, stem cell engineering, and custom bio-printing to set new global standards in plastic & regenerative surgery."
  4. "World-class tissue bioengineering services, cutting-edge research, and clinical excellence — all under one roof."
  5. "Pioneering regenerative treatments across the spectrum of complex tissue reconstruction and aesthetic restoration."
  6. Contact: "Global Headquarters" / "global medical outreach team"
  7. Header menu: "Clinical Partners" / "Our hospital network" (links to `/case-studies`, which names no partner)
- **Source:** `src/lib/site.ts:7-8`; `src/pages/Home/HomePage.tsx:22-23`; `src/pages/Home/WhyChooseUs.tsx:51-52`; `src/pages/Home/ExploreBioCards.tsx:149`; `src/pages/Home/CoreServicesTimeline.tsx:192`; `src/pages/Contact/ContactPage.tsx:30, 35`; `src/components/layout/navData.ts:74-79`
- **Classification:** Unverified
- **Priority:** Medium
- **Evidence reviewed:** None. No partner institution is named anywhere on the site.
- **Why it needs attention:** These are comparative and superiority claims ("Leading", "set new global standards", "World-class"). "Our hospital network" implies institutional partnerships that are not identified. The site describes itself as an "institution", which may suggest academic or hospital status.
- **Documentation / verification needed:** A basis for each comparative claim, the list of partner hospitals with signed agreements, and the organization's legal entity type.
- **Recommended owner review:** Marketing compliance and business development.

### M-06 — Article summaries and bodies (articles 1 and 2)

- **Page / Route:** Articles `/articles`; Home (Featured Biotech Publications); article detail pages
- **Exact existing wording:**
  1. Article 1 summary: "How patient-specific bio-inks and stereolithographic bioprinters are replacing synthetic implants with live living tissue grafts."
  2. Article 1 body: "Reconstructive surgery is undergoing a paradigm shift. Synthetic silicone and titanium implants are being phased out in favor of patient-matched tissue engineered living matrices..."
  3. Article 2 summary: "Exosomes derived from umbilical cord mesenchymal stem cells represent a breakthrough in paracrine signaling for wound closure."
  4. Article 2 body: "Cell-free therapies reduce immune rejection risks while delivering concentrated microRNA and growth factor payloads directly into damaged dermis tissue..."
- **Source:** `src/data/articles.ts:4-41` (`art-1`, `art-2`)
- **Classification:** Unverified
- **Priority:** Medium
- **Evidence reviewed:** None. No references are given in any article.
- **Why it needs attention:**
  - Saying synthetic silicone and titanium implants are "being phased out" and "replaced" overstates the state of the field. To the auditor's general knowledge, they remain standard of care.
  - "Represent a breakthrough" presents investigational exosome therapy as established.
  - The wording "live living" is redundant.
  - Article 2 supports the systemic exosome service (C-07).
- **Documentation / verification needed:** References for each factual statement.
- **Recommended owner review:** The article authors.

### M-07 — Research abstracts (rendered)

- **Page / Route:** Home `/` (res-1 to res-3); Research `/research` (all)
- **Exact existing wording:**
  1. res-1: "Demonstrating high-precision laser-assisted bioprinting of capillary-scale endothelial channels embedded within gelatin-methacryloyl (GelMA) hydrogels for thick tissue survival."
  2. res-2: "Reprogramming adult dermal fibroblasts into iPSCs to generate immunologically silent hyaline cartilage matrix grafts."
  3. res-3: "Reversible host-guest chemistry hydrogels that transition from fluid under shear pressure during injection to robust solid matrix post-implantation."
  4. res-4: "Precise single-nucleotide editing of COL1A1 promoter regions prevents hyper-fibrotic scarring in skin explants."
  5. res-5: "Emulating human dermis-epidermis-vasculature crosstalk in microfluidic bio-chips to replace animal testing in wound drug validation."
  6. res-6: "Hybrid vesicle platforms combining synthetic liposomes with biological exosomes for deep dermal therapeutic cargo transport."
  7. res-7: "Perfusion decellularization protocols preserving native extracellular matrix micro-architecture for functional recellularization."
  8. res-8: "Electro-active nanostructured membranes providing sustained ion release and localized micro-current stimulation."
- **Source:** `src/data/research.ts` (`abstract` fields at lines 10, 25, 40, 55, 70, 85, 100, 115)
- **Classification:** Unverified
- **Priority:** Medium
- **Evidence reviewed:** DOIs failed verification (C-08). There is no other source.
- **Why it needs attention:** The abstracts are written as established findings ("Demonstrating", "prevents"). Specific concerns:
  - "Immunologically silent" (res-2) is a strong immunological claim.
  - "Prevents hyper-fibrotic scarring in skin explants" (res-4) generalizes an ex vivo model to a clinical outcome.
  - "Replace animal testing" (res-5) is a regulatory-acceptance claim.
  - Without a verifiable source, none of the eight can be attributed to the organization.
- **Documentation / verification needed:** The underlying publications (see C-08).
- **Recommended owner review:** Research lead.

### M-08 — Treatment duration and recovery figures presented as standard

- **Page / Route:** Services `/services`; Home (carousel "Duration:")
- **Exact existing wording:**
  1. Burn scar: "3 - 6 Weeks" / "2 - 4 Months"
  2. Diabetic foot: "2 - 4 Weeks" / "1 - 2 Months"
  3. Wound matrix: "1 - 3 Weeks" / "3 - 6 Weeks"
- **Source:** `src/data/mockServices.ts:25-26, 52-53, 78-79`; `src/pages/Home/ServicesOverview.tsx:28, 39, 50`
- **Classification:** Unverified
- **Priority:** Medium
- **Evidence reviewed:** None. The figures conflict with the FAQ (H-04: closure in "3 to 5 weeks") and with the unrendered `clinicalApplications.ts` values.
- **Why it needs attention:** Patients may plan around these ranges. They are stated without qualification ("typical", "varies by patient") and without a source. Durations for the other services are covered in C-07, C-09, H-08 and M-03.
- **Documentation / verification needed:** Protocol documents or outcome data that support each range.
- **Recommended owner review:** Clinical leads.

### M-09 — Consultation process and CTA claims

- **Page / Route:** Consultation `/consultation`; every page (consultation CTA)
- **Exact existing wording:**
  1. "Our clinical board evaluates patient records, 3D imaging, and wound histories to recommend custom bio-graft protocols."
  2. "3D Bio-Print Suitability:" "Assessment of patient autologous cell availability & scaffold design."
  3. CTA: "Schedule a confidential virtual consultation with our tissue bioengineers and plastic reconstructive surgeons to review your clinical case."
- **Source:** `src/pages/Consultation/ConsultationPage.tsx:13-17, 38`; `src/components/common/CTASection.tsx:23-26`
- **Classification:** Needs Owner Confirmation
- **Priority:** Medium
- **Evidence reviewed:** None.
- **Why it needs attention:** These statements describe a clinical service: a "clinical board", virtual (telehealth) consultations and treatment recommendations. Virtual consultations across jurisdictions raise licensure questions, and the existence of a "clinical board" needs confirmation.
- **Documentation / verification needed:** The consultation protocol, board composition, telehealth licensure coverage, and the jurisdictions served.
- **Recommended owner review:** Medical director and compliance.

### M-10 — Unrendered research `fullDetails` with specific quantitative claims *(not rendered; downgraded one level)*

- **Page / Route:** None currently (data only)
- **Exact existing wording:**
  1. res-1: "...This study introduces a dual-laser stereolithography technique that achieves 10-micron channel resolutions, enabling physiological nutrient perfusion and cardiac muscle tissue survival over 90 days."
  2. res-2: "We demonstrate successful 12-month joint cartilage repair in animal models using non-viral episomal reprogrammed iPSCs differentiated into COL2A1-rich chondrogenic pellets."
  3. res-3: "Injectable supramolecular hydrogels formulated with cyclodextrin-adamantane inclusion complexes provide immediate mechanical support while continuously releasing osteogenic signals."
  4. res-4: "...Our lipid nanoparticle delivery system selectively transfects wound fibroblasts, reducing fibrotic markers by 82%."
  5. res-5: "Integrating micro-sensors into dynamic microfluidic channels allows real-time measurement of Transepithelial Electrical Resistance (TEER) and inflammatory cytokine profiles under fluidic stress."
  6. res-6: "Engineered hybrid vesicles display skin-homing peptides on their surface, enabling deep penetration across thick burn eschars to deliver micro-RNA 21 directly to basal stem cells."
  7. res-7: "By removing donor cells while maintaining intact collagen type IV and elastin frameworks, decellularized tissues provide structural cues for patient-specific cell seeding."
  8. res-8: "Nanotechnology-enabled dressings combine antimicrobial silver nanoparticles with conductive graphene ribbons to accelerate cell migration via electrical field guiding."
- **Source:** `src/data/research.ts` (`fullDetails` at lines 12, 27, 42, 57, 72, 87, 102, 117)
- **Classification:** Unverified
- **Priority:** Medium (would be High if rendered)
- **Evidence reviewed:** DOIs failed verification (C-08).
- **Why it needs attention:** These include specific numbers (90 days, 12 months, 82%, 10-micron) and a mechanism for the "FDA Approved" item (res-6). res-1 introduces a third resolution figure (H-14). res-2 says "animal models" while its status is "Clinical Trial" (H-15). Any future research detail page would publish this text.
- **Documentation / verification needed:** The source publications.
- **Recommended owner review:** Research lead, before any research detail view is built.

---

## 6. Low-Priority Findings

### L-01 — Duplicated term in research title

- **Page / Route:** Home `/`; Research `/research`
- **Exact existing wording:** "Laser-Assisted Laser-Guided 3D Bioprinting of Microvascular Networks"
- **Source:** `src/data/research.ts:7`
- **Classification:** Needs Owner Confirmation (which wording was intended)
- **Priority:** Low
- **Evidence reviewed:** A Crossref title search found no paper with this title.
- **Why it needs attention:** It looks like an editing error in the title of a cited publication.
- **Documentation / verification needed:** The exact published title.
- **Recommended owner review:** Research lead.

### L-02 — "Prime Editing Knockdown" terminology

- **Page / Route:** Research `/research`
- **Exact existing wording:** "CRISPR-Prime Editing Knockdown of Fibrotic Collagen Genes in Keloids"
- **Source:** `src/data/research.ts:52`
- **Classification:** Potentially Misleading
- **Priority:** Low
- **Evidence reviewed:** None.
- **Why it needs attention:** "Knockdown" usually means reducing gene expression (for example with RNAi). Prime editing makes precise DNA sequence changes. Calling it a "knockdown" mixes up two techniques (auditor's general knowledge).
- **Documentation / verification needed:** The published title or methods.
- **Recommended owner review:** Research lead.

### L-03 — Inconsistent role for Dr. Michael Chen

- **Page / Route:** Articles (author rail); About
- **Exact existing wording:** "Director of Clinical Research" (article author) vs "Director of Clinical Surgery" (About)
- **Source:** `src/data/articles.ts:53`; `src/pages/About/AboutPage.tsx:35`
- **Classification:** Needs Owner Confirmation
- **Priority:** Low
- **Evidence reviewed:** Repository only.
- **Why it needs attention:** The two pages give different professional roles for the same named clinician.
- **Documentation / verification needed:** The correct title.
- **Recommended owner review:** HR.

### L-04 — Article bodies are teaser fragments ending in "..."

- **Page / Route:** All three article detail pages `/articles/:slug`
- **Exact existing wording:** For example, "...clinical trial closure rates hit 92%..." (art-3). Each `content` field is a single sentence or two ending in "...".
- **Source:** `src/data/articles.ts:12, 31, 50`; rendered by `src/pages/Articles/ArticleDetailPage.tsx:80-84`. The page also shows "6 min read", "8 min read" and "5 min read".
- **Classification:** Potentially Misleading
- **Priority:** Low
- **Evidence reviewed:** Repository only.
- **Why it needs attention:** The detail pages present a fragment as the full article, with a reading time that implies a long piece. Claims cut off mid-sentence (for example the 92% figure) lose any qualifying context.
- **Documentation / verification needed:** The full article texts with references.
- **Recommended owner review:** Content owner.

### L-05 — Main phone number and campus address

- **Page / Route:** Contact; footer; CTA
- **Exact existing wording:** "+1 (800) 555-BIO-TISSUE"; "Medical Biotech Campus, Innovation Way, Cambridge, MA 02142"
- **Source:** `src/lib/site.ts:10-13`
- **Classification:** Needs Owner Confirmation
- **Priority:** Low
- **Evidence reviewed:** The `tel:` link includes letters (`tel:+1 (800) 555-BIO-TISSUE`), and "BIO-TISSUE" has more characters than a 7-digit subscriber number.
- **Why it needs attention:** The CTA labels this number "Call Hotline:". If it does not connect, patients cannot reach the clinic. The address should be confirmed as a real clinical site.
- **Documentation / verification needed:** The confirmed numeric phone number and address.
- **Recommended owner review:** Operations.

### L-06 — "Dermatological and Anti-Aging Specialists."

- **Page / Route:** Home `/` (Discover What We Offer, "About Tissue Bioengineering" card)
- **Exact existing wording:** "Dermatological and Anti-Aging Specialists."
- **Source:** `src/pages/Home/ExploreBioCards.tsx:31-37`
- **Classification:** Needs Owner Confirmation
- **Priority:** Low
- **Evidence reviewed:** No anti-aging service is described anywhere on the site. The leadership listed is surgical and scientific, with no dermatologist.
- **Why it needs attention:** This professional-specialty claim does not match the rest of the site. "Specialist" can carry credentialing meaning.
- **Documentation / verification needed:** Confirmation of the intended positioning and of any dermatology credentials.
- **Recommended owner review:** Marketing.

### L-07 — Unrendered `clinicalApplications.ts` labels items "CLINICAL CASE STUDY" *(not rendered)*

- **Page / Route:** None (the file is not imported anywhere)
- **Exact existing wording:** `label: 'CLINICAL CASE STUDY'` on the burn-scar, diabetic-foot, facial-palsy and facial-asymmetry entries
- **Source:** `src/data/clinicalApplications.ts:18, 30, 66, 78`
- **Classification:** Potentially Misleading
- **Priority:** Low (would be Medium if rendered)
- **Evidence reviewed:** These entries contain descriptions only, with no case data. The descriptions themselves are carefully hedged ("designed to support"). See Section 12.3.
- **Why it needs attention:** If rendered, they would label descriptive service text as case studies. The `href` values (`/blog/...`) and `.png` image paths do not exist.
- **Documentation / verification needed:** None beyond deciding how the file will be used.
- **Recommended owner review:** Content owner.

### L-08 — "Advanced Facial Tissue Regeneration" advertised without a matching service

- **Page / Route:** Home `/` (carousel card 9)
- **Exact existing wording:** "Precision tissue-engineering strategies designed for complex facial tissue defects, asymmetry, and regenerative reconstruction." Duration: "Custom Treatment Protocol"
- **Source:** `src/pages/Home/ServicesOverview.tsx:109-119` (`case-9`)
- **Classification:** Unverified
- **Priority:** Low
- **Evidence reviewed:** No matching entry exists in `mockServices.ts`. The card links to `/services#facial-tissue-regeneration`, which matches no service row. Card 8 (`bioprinted-skin-reconstruction`) has the same problem.
- **Why it needs attention:** The card advertises a clinical offering that is described nowhere else. The wording is hedged, so the risk is low.
- **Documentation / verification needed:** Confirmation that the service is offered.
- **Recommended owner review:** Content owner.

---

## 7. Research and DOI Verification

All checks were run on **2026-11-09**:

- **Registration:** `https://doi.org/api/handles/{doi}`. `responseCode 1` means registered. `100` means handle not found.
- **Metadata:** `https://api.crossref.org/works/{doi}`.
- **Title search:** `https://api.crossref.org/works?query.bibliographic={title}`. The top two results were examined.

PubMed, journal websites and author profiles were **not** checked.

| ID | Site title (as shown) | Site date / status | DOI on site | Journal implied by prefix | doi.org registration | Crossref record | Title search | Result |
|---|---|---|---|---|---|---|---|---|
| res-1 | Laser-Assisted Laser-Guided 3D Bioprinting of Microvascular Networks | 2026-03-15 / Published | `10.1038/s41587-026-00412-x` | *Nature Biotechnology* | Not found (100) | 404 | No match | **Not registered** |
| res-2 | Autologous iPSC-Derived Chondrocytes for Articular Surface Renewal | 2026-01-20 / Clinical Trial | `10.1016/j.stem.2025.11.004` | *Cell Stem Cell* | Not found (100) | 404 | No match | **Not registered** |
| res-3 | Shear-Thinning Self-Healing Supramolecular Hydrogels for Injectable Tissue Repair | 2025-11-10 / Published | `10.1021/acs.biomac.5b01290` | *Biomacromolecules* | Not found (100) | 404 | No match | **Not registered.** The "5b" segment appears to follow ACS's 2015 manuscript numbering (recent ACS DOIs seen in the same search use "5c"), which does not fit a 2025 date. |
| res-4 | CRISPR-Prime Editing Knockdown of Fibrotic Collagen Genes in Keloids | 2026-05-04 / In Development | `10.1016/j.cell.2026.04.019` | *Cell* | Registered (1) | "Virological characteristics of SARS-CoV-2-related coronaviruses dynamically circulating in Southeast Asia", *Cell*, 2026; Wacharapluesadee et al. (45 authors) | No match | **Resolves to an unrelated paper.** Neither the subject nor the authors match. |
| res-5 | Multi-Layer Microfluidic Skin-on-Chip Platform for High-Throughput Drug Screening | 2025-09-18 / Published | `10.1039/d5lc00481f` | *Lab on a Chip* (RSC) | Not found (100) | 404 | No match | **Not registered** |
| res-6 | Targeted Nanoparticle-Exosome Hybrids for Deep Tissue Regeneration | 2026-02-14 / **FDA Approved** | `10.1002/adma.202509124` | *Advanced Materials* | Not found (100) | 404 | No match | **Not registered** |
| res-7 | Decellularized Whole-Organ Tissue Engineering Scaffolds for Complex Reconstruction | 2025-12-01 / Published | `10.1002/term.3218` | *J. Tissue Eng. Regen. Med.* | Registered (1) | "The regenerative effect of different growth factors and platelet lysate on meniscus cells and mesenchymal stromal cells and proof of concept with a functionalized meniscus implant", *JTERM*, 2021-05-21; Hagmeijer, Korpershoek, Crispim, et al. | No match | **Resolves to an unrelated 2021 paper.** The title, date and authors do not match. |
| res-8 | Nanostructured Silver-Graphene Bio-Active Dressings for Antimicrobial Wound Regeneration | 2026-04-12 / Clinical Trial | `10.1021/acsnano.6b01429` | *ACS Nano* | Not found (100) | 404 | No match | **Not registered.** The "6b" segment appears to follow ACS's 2016 numbering, which does not fit a 2026 date. |

**Summary:** 0 of 8 DOIs verified. 6 are not registered, and 2 resolve to unrelated papers. No title search found a matching publication.

**Caveats:**
- A DOI that is unregistered today might be registered later, but every publication date shown on the site is in the past.
- A title search can miss papers whose titles changed between submission and publication.
- None of this establishes intent. It establishes that the citations as displayed cannot be verified.

**Named institutions, laboratories and research partners:** The site names none, beyond its own "Medical Biotech Campus" address and the unspecified "hospital network" (M-05). There was nothing to verify.

**Named researchers:** Dr. Aris Thorne, Dr. Elena Rostova, Prof. Marcus Vance, Dr. Sarah Jenkins, Dr. Hiroshi Tanaka, Dr. Michael Chen, Dr. Olivia Vance, Dr. Clara Dupont, Dr. Liam Gallagher, Dr. Maya Patel and Dr. Sofia Ramirez. None could be linked to the cited works (H-11).

---

## 8. Regulatory and Certification Claims

| Claim (exact) | Where | Type | Status in this audit | Finding |
|---|---|---|---|---|
| "Many of our FDA-approved autologous therapies are covered under major health insurance plans" | Home FAQ | FDA **approval** (product) | No product or application identified. Not verified. | C-01 |
| "FDA Approved" (research status) | `/research` (res-6) | FDA **approval** shown on a research item | Wrong kind of status for a publication. The DOI is not registered. | C-02 |
| "sponsored through IRB clinical trial grants" | Home FAQ | Ethics oversight / trial funding | Misuses "IRB" (IRBs do not fund trials) | C-01 |
| "Clinical Trial" (res-2, res-8) | Home, `/research` | Trial authorization | No registry ID | H-15 |
| "GMP & ISO 13485 Certified Cleanrooms" | Home | **Organization** QMS certification (ISO 13485) and GMP, applied to **rooms** | No certificate. The scope is described inaccurately. | H-09 |
| "ISO 13485 & GMP Certified Cleanrooms" | Footer, all pages | Same | Same | H-09 |
| "ISO Class 5 sterile medical cleanrooms adhering to FDA standards" | Home | ISO 14644-1 air cleanliness, "sterile", "FDA standards" | No classification report. "Sterile" and "FDA standards" are imprecise. | H-09 |
| "ISO Class 5" / "Sterile Cleanrooms" | About | ISO 14644-1 | No report | H-09 |
| "Sterilization Rating": "ISO Class 5 Cleanroom" | BioMatrix-3D™ specs | Cleanliness class presented as sterilization rating | Wrong term | H-09 |
| "Validation": "GMP Compliant" vs badge "GMP Certified" | ExoPure™ | Product-level GMP | Contradictory wording. No document. | H-09 |
| "clinical-grade exosome harvesting" | ExoPure™ tagline | Implied release specifications for clinical use | No document | H-09 |
| "HIPAA Compliant" / "under HIPAA guidelines" | `/consultation` | Privacy law compliance (organization) | No documentation. The form shows success on failure. | H-10 |
| "Biocompatibility": "Zero Cytotoxicity" | SmartScaff-Gel | Implies ISO 10993-5 testing | Not a valid result format. No report. | H-13 |
| "Facial asymmetry filler", "Joint cartilage seeding" | SmartScaff-Gel | Uses that would generally need regulatory authorization | No regulatory status given | H-13 |
| Systemic MSC/exosome infusions | `/services` | Biologic product regulation | No IND/BLA identified | C-07 |
| "Patented", "18 Patented Bio-Inks", "international patents", "™" | Multiple | IP | No patent numbers | M-04 |

**Distinctions applied** (auditor's general knowledge, to be confirmed by regulatory counsel):

- **FDA:** *approval* (NDA/BLA/PMA) ≠ *clearance* (510(k)) ≠ *De Novo grant* ≠ *establishment registration* ≠ *device or HCT/P listing*. Registration and listing do not mean FDA has reviewed or endorsed a product.
- **ISO 13485:** certifies an *organization's* quality management system for a defined scope. It does not certify a product, a device or a room.
- **ISO 14644-1 "Class 5":** a measured airborne-particle class for a space. It is not "sterile" and not a sterilization rating.
- **GMP:** FDA inspects for cGMP compliance and does not issue certificates. Some non-US authorities issue GMP certificates to sites.

The site does not separate organization-level claims (the cleanrooms, HIPAA) from product-level claims (ExoPure™ "GMP Certified", "FDA Approved" research). Both need separate substantiation.

---

## 9. Claims Requiring Internal Documentation

These claims can only be confirmed with internal company records. The audit could not obtain or check those records.

| Documentation | Claims depending on it | Findings |
|---|---|---|
| FDA approval/clearance letters, IND/IDE numbers, HCT/P registration | "FDA-approved autologous therapies"; "FDA Approved"; systemic infusions; bioprinted grafts in patients (including a pediatric case); miRNA therapy; craniofacial grafts; filler and joint uses | C-01, C-02, C-05, C-07, C-09, H-06, H-07, H-08, H-13 |
| Clinical outcome datasets and statistical analyses | 2,450+ grafts; 99.8% / zero rejection; 3.5x; up to 50%; 45%; 92%; "Most ... within 3 to 5 weeks"; durations and recovery periods | C-03, H-01–H-05, M-08 |
| Patient consent / HIPAA authorizations; case records; IRB approvals | Two case reports (including a 9-year-old); three named testimonials | C-05, C-06 |
| ISO 13485 certificate, ISO 14644-1 reports, GMP certificate or inspection records | Cleanroom and GMP claims | H-09 |
| HIPAA risk assessment, BAAs, privacy notice, referral portal | HIPAA claims; "secure portal" | H-10 |
| Staff CVs, medical licenses, board certifications | Named physicians and surgeons, "world-renowned", "attending surgeon" | H-11 |
| Manufacturing and process validation records | 4-step, 11-day process; "clinical-grade"; ExoPure™ purity and throughput | H-12, M-01 |
| Device/material test reports (viability, resolution, ISO 10993, gelation, release, degradation) | 98% survival; 5 µm vs sub-micron; zero cytotoxicity; 30-day release | H-13, H-14 |
| Patent grants and trademark registrations | 18 / 18+ patents; "Patented"; ™ marks | M-04 |
| Partner agreements | "Our hospital network" | M-05 |
| Emergency line operations records | 24/7 Urgent Burn / Trauma Hotline | C-10 |
| Publication records | All 8 research items and author lists | C-08, H-15, M-07, M-10 |

---

## 10. Evidence and Documentation Needed

A checklist for the content owner, grouped by evidence type.

**Regulatory**
- [ ] For each therapy: regulatory pathway, application number and approved or cleared indication. Otherwise, an IND/IDE number and the trial registration ID.
- [ ] Whether any product has FDA approval at all (C-01, C-02).
- [ ] HCT/P establishment registration and donor-eligibility records for umbilical-cord-derived material (C-07).
- [ ] Regulatory status of the hydrogel for filler and joint uses (H-13).

**Clinical evidence**
- [ ] The source study or dataset for every number on the Statistics section, Why Choose Us, the FAQ and article 3.
- [ ] Endpoint definitions: "successful graft", "rejection", "immune compliance", "closure".
- [ ] Comparator definitions for every "faster" claim.
- [ ] Follow-up duration and revision rates for the craniofacial grafts.

**Patient-facing content**
- [ ] Signed authorizations for case studies and testimonials, including parental consent and child assent for the pediatric case.
- [ ] IRB approval for each case's procedure.
- [ ] A typical-results statement for each testimonial.

**Quality and certification**
- [ ] ISO 13485 certificate (body, number, scope, sites, expiry).
- [ ] ISO 14644-1 classification reports.
- [ ] GMP certificate (issuing authority) or FDA inspection outcomes.

**Privacy**
- [ ] HIPAA risk analysis, BAAs, Notice of Privacy Practices, privacy policy URL, and the secure referral portal.

**Publications**
- [ ] A correct, verifiable citation for each of the 8 research items, or confirmation that the work is unpublished.

**People**
- [ ] Confirmation of employment, degrees, licensure and board certification for each named clinician and author.

**Intellectual property**
- [ ] Patent numbers and jurisdictions mapped to products, and trademark registrations.

**Operations**
- [ ] A working numeric phone number for the main line and the emergency line, with staffing hours.

---

## 11. Recommended Review Order

1. **C-10 Emergency hotline.** This is a patient-safety question that can be answered quickly: confirm the number works and is staffed 24/7.
2. **C-01, C-02 FDA approval claims.** These carry the highest regulatory exposure, and the answer determines how much of the rest of the site must change.
3. **C-07, H-16 Systemic stem-cell and exosome infusions, and vitiligo.** These are investigational biologic uses presented as outpatient services.
4. **C-08 Research DOIs.** Every "evidence" link currently fails, so other claims cannot cite the Research section until this is resolved.
5. **C-05, C-06 Case studies and testimonials.** These need consent, privacy and pediatric-ethics checks.
6. **C-03, C-04 "Zero rejection" and "completely bypassing" rejection.** These are absolute safety claims shown on the Home page, and one sits in the FAQ that opens by default.
7. **C-09 "Permanently restore ... symmetry".** This is a direct "Yes" to a patient question.
8. **H-09, H-10 ISO/GMP and HIPAA.** These are certification and legal-compliance wording, plus the false submission-success message.
9. **H-11 Clinician credentials.** This underpins the case-study and article attributions.
10. **H-01 to H-08, H-12 to H-15.** The remaining efficacy statistics, service claims, process and technology specs.
11. **M-01 to M-10.** Qualify or source the mechanistic, superiority, patent and duration claims.
12. **L-01 to L-08.** Terminology, consistency and editorial items.

Because the unrendered data (service `benefits`, research `fullDetails`, `clinicalApplications.ts`) is ranked lower, it should be reviewed **before** any change that would render it.

---

## 12. Complete Findings Summary

### 12.1 All findings

| ID | Short title | Route(s) | Classification | Priority | Claim statements |
|---|---|---|---|---|---|
| C-01 | "FDA-approved autologous therapies" + insurance + "IRB ... grants" | `/` | Potentially Misleading | Critical | 2 |
| C-02 | "FDA Approved" research status | `/research` | Potentially Misleading | Critical | 1 |
| C-03 | "Zero Graft Rejection" 99.8% / "zero rejection rates" | `/` | Potentially Misleading | Critical | 3 |
| C-04 | Autologous grafts eliminate or bypass rejection | `/`, `/services` | Potentially Misleading | Critical | 3 |
| C-05 | Case studies: 100% outcomes, Doppler, pediatric bioprinted graft | `/case-studies` | Potentially Misleading | Critical | 9 |
| C-06 | "Real testimonials" with clinical outcomes | `/` | Potentially Misleading | Critical | 5 |
| C-07 | Systemic MSC/exosome infusions, "multi-organ cellular repair" | `/services`, `/`, `/technologies` | Potentially Misleading | Critical | 11 |
| C-08 | All 8 research DOIs fail verification | `/`, `/research` | Potentially Misleading | Critical | 10 |
| C-09 | "Permanently restore natural craniofacial symmetry" | `/`, `/services` | Potentially Misleading | Critical | 11 |
| C-10 | 24/7 Urgent Burn / Trauma Hotline | `/contact` | Needs Owner Confirmation | Critical | 1 |
| H-01 | "2,450+ Successful Bio-Grafts" | `/` | Needs Owner Confirmation | High | 1 |
| H-02 | "3.5x Clinical Closure Speed" | `/` | Potentially Misleading | High | 1 |
| H-03 | "Up to 50%" / "45%" closure figures | `/` (+ data) | Unverified | High | 2 |
| H-04 | FAQ diabetic ulcer timeline | `/` | Unverified | High | 1 |
| H-05 | Article: "closure rates hit 92%" | `/articles/...` | Unverified | High | 3 |
| H-06 | "Eliminates donor-site morbidity"; burn and skin restoration | `/`, `/about`, `/services` | Potentially Misleading | High | 9 |
| H-07 | Diabetic foot service claims | `/services`, `/` | Unverified | High | 10 |
| H-08 | Keloid gene-silencing / enzymatic therapy | `/services`, `/` | Unverified | High | 10 |
| H-09 | ISO 13485 / GMP / ISO Class 5 wording | all pages | Potentially Misleading | High | 9 |
| H-10 | HIPAA claims; success shown on failure | `/consultation`, footer | Needs Owner Confirmation | High | 5 |
| H-11 | Clinician identities and credentials | `/about`, `/case-studies`, `/consultation` | Needs Owner Confirmation | High | 7 |
| H-12 | 4-step, 11-day bio-grafting process | `/` | Unverified | High | 5 |
| H-13 | SmartScaff-Gel "Zero Cytotoxicity", filler/joint uses | `/technologies`, `/` | Potentially Misleading | High | 8 |
| H-14 | BioMatrix-3D™ 98% viability; sub-micron vs 5 µm | `/technologies`, `/` | Potentially Misleading | High | 8 |
| H-15 | "Clinical Trial" / "In Development" statuses | `/`, `/research` | Needs Owner Confirmation | High | 3 |
| H-16 | Vitiligo "restore pigmentation" | `/` | Unverified | High | 1 |
| M-01 | ExoPure™ purity, throughput, cosmetic use | `/technologies`, `/` | Needs Owner Confirmation | Medium | 5 |
| M-02 | Smart wound matrix claims | `/services`, `/` | Unverified | Medium | 9 |
| M-03 | Facial nerve conduit claims | `/services`, `/` | Unverified | Medium | 11 |
| M-04 | Patent and trademark claims | `/`, `/about`, `/technologies` | Needs Owner Confirmation | Medium | 6 |
| M-05 | Superiority, leadership, "hospital network" | site-wide | Unverified | Medium | 7 |
| M-06 | Articles 1 and 2 claims | `/articles` | Unverified | Medium | 4 |
| M-07 | Research abstracts | `/`, `/research` | Unverified | Medium | 8 |
| M-08 | Durations and recovery periods | `/services`, `/` | Unverified | Medium | 3 |
| M-09 | Consultation process, virtual consults | `/consultation`, CTA | Needs Owner Confirmation | Medium | 3 |
| M-10 | Unrendered research `fullDetails` numbers | data only | Unverified | Medium | 8 |
| L-01 | "Laser-Assisted Laser-Guided" | `/`, `/research` | Needs Owner Confirmation | Low | 1 |
| L-02 | "Prime Editing Knockdown" | `/research` | Potentially Misleading | Low | 1 |
| L-03 | Dr. Chen's role differs between pages | `/articles`, `/about` | Needs Owner Confirmation | Low | 1 |
| L-04 | Article bodies are "..." fragments | `/articles/:slug` | Potentially Misleading | Low | 1 |
| L-05 | Main phone number and address | site-wide | Needs Owner Confirmation | Low | 2 |
| L-06 | "Dermatological and Anti-Aging Specialists." | `/` | Needs Owner Confirmation | Low | 1 |
| L-07 | Unrendered "CLINICAL CASE STUDY" labels | data only | Potentially Misleading | Low | 1 |
| L-08 | Facial regeneration card with no service | `/` | Unverified | Low | 1 |

### 12.2 Counts

**Claims reviewed:** 225 claim statements. That is 212 statements grouped into the 44 findings above, plus 13 statements reviewed that raised no material concern (12.3). A "claim statement" is one distinct piece of displayed or data-source wording that asserts a scientific, clinical, regulatory, performance or credential fact. Repeated identical wording is counted where it appears in a distinct context.

**By classification**

| Classification | Findings | Claim statements |
|---|---|---|
| Verified | 0 | 0 |
| Partially Supported | 0 | 0 |
| Unverified | 15 | 83 |
| Potentially Misleading | 17 | 93 |
| Needs Owner Confirmation | 12 | 36 |
| **Total in findings** | **44** | **212** |
| Reviewed, no material concern | n/a | 13 |
| **Total reviewed** | | **225** |

No claim met the bar for Verified or Partially Supported. The repository contains no evidence, and the only external evidence checked (the DOIs) failed. This is a finding about the documentation available. It is not a finding that the claims are false.

**By priority**

| Priority | Findings | Claim statements |
|---|---|---|
| Critical | 10 | 56 |
| High | 16 | 83 |
| Medium | 10 | 64 |
| Low | 8 | 9 |
| **Total** | **44** | **212** |

### 12.3 Statements reviewed with no material concern (13)

These were reviewed and are worded as aims or areas of work, not as outcome claims, or are otherwise appropriately qualified:

1. Hero lead: "Advancing regenerative medicine through tissue engineering, biomaterials, stem cell technologies, and personalized regenerative therapies." (`src/pages/Home/Hero.tsx:66-67`)
2. Hero "Areas of focus" ticker (14 topic labels, reviewed as a group) (`src/pages/Home/Hero.tsx:4-19`)
3. Case-study image caption: "Illustrative image · not a patient photograph" (`src/pages/CaseStudies/CaseStudiesPage.tsx:67`). This is an appropriate disclosure.
4. BioMatrix-3D™ "Temperature Control": "4°C to 42°C active" (`src/data/technologies.ts:13`). This is a plausible equipment spec, though still unverified.
5–13. The nine `description` strings in the unrendered `src/data/clinicalApplications.ts` (lines 20, 32, 44, 56, 68, 80, 92, 104, 116). They consistently use hedged language ("designed to support", "investigating", "engineered to provide a supportive microenvironment"). The content owner may find them a useful model for qualifying the rendered service text.

---

*End of report. This audit changed nothing on the website. It documents findings only.*
