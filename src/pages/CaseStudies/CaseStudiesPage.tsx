import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { CheckCircle2, User, Clock, Stethoscope } from 'lucide-react';
import { CaseStudy } from '@/types';

const caseStudies: CaseStudy[] = [
  {
    id: 'cs-1',
    slug: 'case-diabetic-ulcer-reconstruction',
    title: 'Complete Healing of Grade 3 Diabetic Foot Ulcer in 35 Days',
    patientInitials: 'D.M. (Age 61)',
    condition: 'Diabetic Foot',
    duration: '5 Weeks',
    summary:
      'A 61-year-old male with a 14-month history of non-healing neuropathic plantar ulcer unresponsive to conventional hyperbaric and debridement therapy.',
    procedure:
      'Application of vascularized ADSC-hydrogel membrane combined with bi-weekly low-level laser bio-stimulation.',
    outcome:
      '100% full-thickness skin closure achieved with neo-vascularization verified by Doppler ultrasound.',
    beforeAfterImage: '/images/stem-cell-culture-flasks.webp',
    beforeAfterImageAlt: 'Scientist handling cell culture flasks inside a biosafety cabinet',
    attendingSurgeon: 'Dr. Michael Chen, MD',
  },
  {
    id: 'cs-2',
    slug: 'case-pediatric-burn-contracture',
    title: 'Functional Range of Motion Restoration in Pediatric Neck Burn Contracture',
    patientInitials: 'K.S. (Age 9)',
    condition: 'Burn Scar Treatment',
    duration: '8 Weeks',
    summary:
      'Severe post-burn hypertrophic neck contracture limiting cervical extension to less than 15 degrees.',
    procedure:
      'Surgical excision of scar tissue followed by immediate grafting of 3D bioprinted autologous skin matrix.',
    outcome:
      'Restoration of 85-degree cervical extension without graft shrinkage or donor site morbidity.',
    beforeAfterImage:
      '/images/surgical-team-operating-room.webp',
    beforeAfterImageAlt:
      'Surgical team viewed from the operating table during a reconstructive procedure',
    attendingSurgeon: 'Dr. Aris Thorne, MD, PhD',
  },
];

/** One case as a structured clinical report: image and case facts left, the report right. */
const CaseReport: React.FC<{ cs: CaseStudy; index: number }> = ({ cs, index }) => (
  <article
    aria-labelledby={`${cs.slug}-title`}
    className="grid gap-10 border-t border-cf-line py-14 first:border-t-0 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:py-24"
  >
    {/* Image + case facts */}
    <div className="lg:col-span-5">
      <div className="lg:sticky lg:top-[120px]">
        <figure>
          <div className="overflow-hidden rounded-xl border border-cf-line bg-cf-panel">
            <img
              src={cs.beforeAfterImage}
              alt={cs.beforeAfterImageAlt ?? cs.title}
              width={1200}
              height={900}
              loading={index === 0 ? undefined : 'lazy'}
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <figcaption className="cf-mono mt-3">Illustrative image · not a patient photograph</figcaption>
        </figure>

        <ul className="mt-8 border-t border-cf-line text-sm text-cf-text-2">
          <li className="flex items-center gap-3 border-b border-cf-line py-3.5">
            <span className="rounded-md bg-cf-active px-2.5 py-1 text-xs font-medium text-cf-accent">
              {cs.condition}
            </span>
          </li>
          <li className="flex items-center gap-3 border-b border-cf-line py-3.5">
            <User className="h-4 w-4 shrink-0 text-cf-accent" aria-hidden="true" />
            {cs.patientInitials}
          </li>
          <li className="flex items-center gap-3 border-b border-cf-line py-3.5">
            <Clock className="h-4 w-4 shrink-0 text-cf-accent" aria-hidden="true" />
            Treatment: <span className="text-[13px] text-cf-text">{cs.duration}</span>
          </li>
          <li className="flex items-start gap-3 border-b border-cf-line py-3.5">
            <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-cf-accent" aria-hidden="true" />
            <span>
              Attending Surgeon:{' '}
              <span className="font-medium text-cf-text">{cs.attendingSurgeon}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>

    {/* Report */}
    <div className="min-w-0 lg:col-span-7">
      <span className="cf-mono" aria-hidden="true">
        {String(index + 1).padStart(2, '0')} / {String(caseStudies.length).padStart(2, '0')}
      </span>
      <h2
        id={`${cs.slug}-title`}
        className="mt-5 text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] text-cf-text sm:text-[40px]"
      >
        {cs.title}
      </h2>

      <dl className="mt-10 border-t border-cf-line">
        <div className="grid gap-2 border-b border-cf-line py-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-8">
          <dt className="text-sm font-medium text-cf-text">Patient History:</dt>
          <dd className="text-[15px] leading-relaxed text-cf-text-2 sm:text-base">{cs.summary}</dd>
        </div>
        <div className="grid gap-2 border-b border-cf-line py-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-8">
          <dt className="text-sm font-medium text-cf-text">Bio-Therapeutic Procedure:</dt>
          <dd className="text-[15px] leading-relaxed text-cf-text-2 sm:text-base">{cs.procedure}</dd>
        </div>
        <div className="mt-6 grid gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.05] p-5 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-8 sm:p-6">
          <dt className="flex items-start gap-2 text-sm font-medium text-emerald-200">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
            Clinical Outcome:
          </dt>
          <dd className="text-[15px] leading-relaxed text-cf-text sm:text-base">{cs.outcome}</dd>
        </div>
      </dl>
    </div>
  </article>
);

export const CaseStudiesPage: React.FC = () => {
  return (
    <PageShell
      seo={{
        title: 'Clinical Case Studies',
        description:
          'Review documented clinical case reports showcasing rapid wound closure, neck contracture restoration, and diabetic limb salvage.',
      }}
      cta
    >
      <PageHero
        breadcrumb={[{ label: 'Case Studies' }]}
        eyebrow="Evidence-Based Medicine"
        title="Documented Clinical Case Reports"
        lead="Detailed patient histories, therapeutic procedures, and 100% tissue remodeling outcomes verified by Doppler ultrasound."
      />

      <div className="cf-container pb-14 sm:pb-24 lg:pb-32">
        {caseStudies.map((cs, index) => (
          <CaseReport key={cs.id} cs={cs} index={index} />
        ))}
      </div>
    </PageShell>
  );
};
