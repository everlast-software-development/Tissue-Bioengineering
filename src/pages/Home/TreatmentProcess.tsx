import React from 'react';
import { UserCheck, Dna, Printer, HeartPulse } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useMessages } from '@/i18n/context';
import { homeMessages } from './messages';

/** Icon per step, in order; the step text is in ./messages.ts (`process.steps`). */
const STEP_ICONS: React.ElementType[] = [UserCheck, Dna, Printer, HeartPulse];

/* Fluorescence channel colors encode the sequence: blue → light blue → cyan → magenta. */
const NODE_COLORS = ['#6E8BFF', '#5BB3F2', '#4FD6E8', '#E25A9E'];

export const TreatmentProcess: React.FC = () => {
  const t = useMessages(homeMessages).process;
  const steps = t.steps.map((step, i) => ({ ...step, stepNumber: i + 1, icon: STEP_ICONS[i] }));
  return (
    <section
      className="cf-section relative border-y border-cf-line bg-cf-raised"
      aria-labelledby="process-heading"
    >
      <div className="cf-container">
        <SectionHeader
          id="process-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />

        <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
          {/* The pipeline line from lg (the gradient encodes the order of the stages, so it runs
              in the reading direction) */}
          <span
            aria-hidden="true"
            className="absolute start-3 end-0 top-[11px] hidden h-px bg-gradient-to-r from-cf-blue via-cf-accent to-cf-magenta rtl:bg-gradient-to-l lg:block"
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            const color = NODE_COLORS[i];
            return (
              <li key={step.stepNumber} className="relative ps-12 lg:pe-4 lg:ps-0">
                {/* Below lg: a vertical connector from this node to the next one */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-12 start-[11px] top-[23px] w-px lg:hidden"
                    style={{ backgroundImage: `linear-gradient(${color}, ${NODE_COLORS[i + 1]})` }}
                  />
                )}

                {/* Node: 23px ring + 9px filled dot */}
                <span
                  aria-hidden="true"
                  className="absolute start-0 top-0 flex h-[23px] w-[23px] items-center justify-center rounded-full border-2 bg-cf-raised lg:relative"
                  style={{ borderColor: color }}
                >
                  <span className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: color }} />
                </span>

                <div className="flex items-center gap-3 lg:mt-8">
                  <span className="text-xs text-cf-muted">
                    {String(step.stepNumber).padStart(2, '0')}
                  </span>
                  <span className="h-3 w-px bg-cf-line-strong" aria-hidden="true" />
                  <span className="text-xs text-cf-text-2">{step.duration}</span>
                  <Icon className="ms-auto h-4 w-4 text-cf-muted" aria-hidden="true" />
                </div>

                <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.015em] text-cf-text">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-cf-muted">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
