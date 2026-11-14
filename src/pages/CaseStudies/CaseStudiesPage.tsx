import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { CheckCircle2, User, Clock, Stethoscope } from 'lucide-react';
import { CaseStudy } from '@/types';
import { useI18n, useMessages } from '@/i18n/context';
import { caseStudiesMessages } from './messages';

/** Case structure; the text (title, history, outcome, …) is in ./messages.ts, by id. */
const caseStudies: Pick<CaseStudy, 'id' | 'slug' | 'condition' | 'beforeAfterImage'>[] = [
  {
    id: 'cs-1',
    slug: 'case-diabetic-ulcer-reconstruction',
    condition: 'Diabetic Foot',
    beforeAfterImage: '/images/stem-cell-culture-flasks.webp',
  },
  {
    id: 'cs-2',
    slug: 'case-pediatric-burn-contracture',
    condition: 'Burn Scar Treatment',
    beforeAfterImage: '/images/surgical-team-operating-room.webp',
  },
];

type CaseId = keyof (typeof caseStudiesMessages)['en']['cases'];

/** One case as a structured clinical report: image and case facts left, the report right. */
const CaseReport: React.FC<{ cs: (typeof caseStudies)[number]; index: number }> = ({
  cs,
  index,
}) => {
  const { t: common } = useI18n();
  const t = useMessages(caseStudiesMessages);
  const text = t.cases[cs.id as CaseId];

  return (
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
                alt={text.beforeAfterImageAlt ?? text.title}
                width={1200}
                height={900}
                loading={index === 0 ? undefined : 'lazy'}
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <figcaption className="cf-mono mt-3">{t.illustrative}</figcaption>
          </figure>

          <ul className="mt-8 border-t border-cf-line text-sm text-cf-text-2">
            <li className="flex items-center gap-3 border-b border-cf-line py-3.5">
              <span className="rounded-md bg-cf-active px-2.5 py-1 text-xs font-medium text-cf-accent">
                {common.categories.service[cs.condition]}
              </span>
            </li>
            <li className="flex items-center gap-3 border-b border-cf-line py-3.5">
              <User className="h-4 w-4 shrink-0 text-cf-accent" aria-hidden="true" />
              {text.patientInitials}
            </li>
            <li className="flex items-center gap-3 border-b border-cf-line py-3.5">
              <Clock className="h-4 w-4 shrink-0 text-cf-accent" aria-hidden="true" />
              {t.treatment} <span className="text-[13px] text-cf-text">{text.duration}</span>
            </li>
            <li className="flex items-start gap-3 border-b border-cf-line py-3.5">
              <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-cf-accent" aria-hidden="true" />
              <span>
                {t.surgeon}{' '}
                <span className="font-medium text-cf-text">{text.attendingSurgeon}</span>
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
          {text.title}
        </h2>

        <dl className="mt-10 border-t border-cf-line">
          <div className="grid gap-2 border-b border-cf-line py-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-8">
            <dt className="text-sm font-medium text-cf-text">{t.history}</dt>
            <dd className="text-[15px] leading-relaxed text-cf-text-2 sm:text-base">{text.summary}</dd>
          </div>
          <div className="grid gap-2 border-b border-cf-line py-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-8">
            <dt className="text-sm font-medium text-cf-text">{t.procedure}</dt>
            <dd className="text-[15px] leading-relaxed text-cf-text-2 sm:text-base">{text.procedure}</dd>
          </div>
          <div className="mt-6 grid gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.05] p-5 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-8 sm:p-6">
            <dt className="flex items-start gap-2 text-sm font-medium text-emerald-200">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
              {t.outcome}
            </dt>
            <dd className="text-[15px] leading-relaxed text-cf-text sm:text-base">{text.outcome}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
};

export const CaseStudiesPage: React.FC = () => {
  const t = useMessages(caseStudiesMessages);
  return (
    <PageShell seo={t.seo} cta>
      <PageHero
        breadcrumb={[{ label: t.breadcrumb }]}
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        cells
      />

      <div className="cf-container pb-14 sm:pb-24 lg:pb-32">
        {caseStudies.map((cs, index) => (
          <CaseReport key={cs.id} cs={cs} index={index} />
        ))}
      </div>
    </PageShell>
  );
};
