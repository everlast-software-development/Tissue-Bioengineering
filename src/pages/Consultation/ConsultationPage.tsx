import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { HeroBackdrop, PageHero } from '@/components/common/PageHero';
import { useMessages } from '@/i18n/context';
import { ConsultationForm } from './ConsultationForm';
import { consultationMessages } from './messages';
import { ShieldCheck, Lock, Clock } from 'lucide-react';

const EXPECTATIONS = [
  { key: 'review', icon: Clock },
  { key: 'suitability', icon: ShieldCheck },
  { key: 'privacy', icon: Lock },
] as const;

export const ConsultationPage: React.FC = () => {
  const t = useMessages(consultationMessages);
  return (
    <PageShell seo={t.seo}>
      {/* The hero's cellular backdrop spans the hero and the form section, so it reads as one
          continuous hero instead of a strip that ends at the hero's bottom edge. It dissolves into
          the page background toward the bottom. No overflow clipping on this wrapper: it would
          stop the "What to Expect" column from sticking. */}
      <div className="relative isolate">
        <HeroBackdrop className="cf-hero-backdrop-fade overflow-hidden" />

        <PageHero
          breadcrumb={[{ label: t.breadcrumb }]}
          eyebrow={t.eyebrow}
          title={t.title}
          lead={t.lead}
          className="border-b-0"
        />

        <section className="pb-14 sm:pb-24 lg:pb-32" aria-label={t.sectionLabel}>
          <div className="cf-container grid items-start gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
            {/* Form (first on small screens, right column from lg) */}
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <ConsultationForm />
            </div>

            {/* What to expect + referrals */}
            <aside className="lg:sticky lg:top-[120px] lg:col-span-5 lg:col-start-1 lg:row-start-1">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-cf-text">
                {t.expectTitle}
              </h2>
              <ol className="mt-6 border-t border-cf-line">
                {EXPECTATIONS.map(({ key, icon: Icon }, i) => (
                  <li key={key} className="flex gap-5 border-b border-cf-line py-6">
                    <span className="cf-mono pt-0.5" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-[15px] font-semibold text-cf-text">
                        <Icon className="h-4 w-4 shrink-0 text-cf-accent" aria-hidden="true" />
                        {t.expectations[key].title}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-cf-muted">
                        {t.expectations[key].text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-xl border border-cf-line-strong bg-cf-raised p-6">
                <h3 className="mb-2 text-base font-semibold text-cf-text">{t.referralsTitle}</h3>
                <p className="text-[15px] leading-relaxed text-cf-muted">{t.referralsBody}</p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </PageShell>
  );
};
