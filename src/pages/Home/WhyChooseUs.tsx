import React from 'react';
import { Cpu, ShieldCheck, Microscope, HeartPulse } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useMessages } from '@/i18n/context';
import { homeMessages } from './messages';

/** Icons per reason; titles and descriptions are in ./messages.ts (`why.reasons`). */
const reasons = [
  { key: 'autology', icon: Microscope },
  { key: 'precision', icon: Cpu },
  { key: 'cleanrooms', icon: ShieldCheck },
  { key: 'angiogenesis', icon: HeartPulse },
] as const;

/* Inner rules only: a cross between the four cells from sm, a divider between rows below sm. */
const CELL_RULES = [
  'border-b sm:border-e',
  'border-b',
  'border-b sm:border-b-0 sm:border-e',
  '',
];

export const WhyChooseUs: React.FC = () => {
  const t = useMessages(homeMessages).why;
  return (
    <section
      className="cf-section relative border-y border-cf-line bg-cf-raised"
      aria-labelledby="why-heading"
    >
      <div className="cf-container grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <SectionHeader
          id="why-heading"
          layout="stack"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
          className="mb-0 sm:mb-0 lg:sticky lg:top-32 lg:self-start"
        />

        <ul className="grid grid-cols-1 sm:grid-cols-2">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            const text = t.reasons[item.key];
            return (
              <li
                key={item.key}
                className={`border-cf-line py-8 sm:p-8 lg:p-10 ${CELL_RULES[idx]} ${
                  idx % 2 === 0 ? 'sm:ps-0 lg:ps-0' : 'sm:pe-0 lg:pe-0'
                }`}
              >
                <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-cf-accent/40 text-cf-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold leading-snug tracking-[-0.015em] text-cf-text">
                  {text.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-cf-muted">{text.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
