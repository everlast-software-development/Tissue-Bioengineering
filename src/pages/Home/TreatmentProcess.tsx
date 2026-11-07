import React from 'react';
import { TimelineStep } from '@/types';
import { UserCheck, Dna, Printer, HeartPulse } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const steps: (TimelineStep & { icon: React.ElementType })[] = [
  {
    stepNumber: 1,
    title: '3D Scan & Cell Biopsy',
    description:
      'High-resolution laser 3D scanning of the defect site paired with a 2mm skin punch biopsy to isolate autologous stem cells.',
    duration: 'Day 1',
    icon: UserCheck,
  },
  {
    stepNumber: 2,
    title: 'Cell Expansion & Bio-Ink Formulation',
    description:
      'Culturing patient fibroblasts and endothelial cells inside ISO cleanroom bioreactors for bio-ink compounding.',
    duration: 'Days 2 - 10',
    icon: Dna,
  },
  {
    stepNumber: 3,
    title: '3D Bioprinting Scaffolding',
    description:
      'Stereolithographic 3D printing of custom vascularized living tissue grafts matched precisely to CT anatomy.',
    duration: 'Day 11',
    icon: Printer,
  },
  {
    stepNumber: 4,
    title: 'Clinical Graft Placement & Remodeling',
    description:
      'Minimally invasive graft placement by surgical specialists, followed by rapid microvascular integration.',
    duration: 'Weeks 2 - 6',
    icon: HeartPulse,
  },
];

/* Fluorescence channel colors encode the sequence: blue → light blue → cyan → magenta. */
const NODE_COLORS = ['#6E8BFF', '#5BB3F2', '#4FD6E8', '#E25A9E'];

export const TreatmentProcess: React.FC = () => {
  return (
    <section
      className="cf-section relative border-y border-cf-line bg-cf-raised"
      aria-labelledby="process-heading"
    >
      <div className="cf-container">
        <SectionHeader
          id="process-heading"
          eyebrow="Clinical Journey"
          title="The 4-Step Bio-Grafting Process"
          subtitle="From initial cellular harvest to 3D bio-printing and vascularized tissue integration."
        />

        <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
          {/* The pipeline line from lg (the gradient encodes the order of the stages) */}
          <span
            aria-hidden="true"
            className="absolute left-3 right-0 top-[11px] hidden h-px bg-gradient-to-r from-cf-blue via-cf-accent to-cf-magenta lg:block"
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            const color = NODE_COLORS[i];
            return (
              <li key={step.stepNumber} className="relative pl-12 lg:pl-0 lg:pr-4">
                {/* Below lg: a vertical connector from this node to the next one */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-12 left-[11px] top-[23px] w-px lg:hidden"
                    style={{ backgroundImage: `linear-gradient(${color}, ${NODE_COLORS[i + 1]})` }}
                  />
                )}

                {/* Node: 23px ring + 9px filled dot */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 flex h-[23px] w-[23px] items-center justify-center rounded-full border-2 bg-cf-raised lg:relative"
                  style={{ borderColor: color }}
                >
                  <span className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: color }} />
                </span>

                <div className="flex items-center gap-3 lg:mt-8">
                  <span className="font-geist-mono text-xs text-cf-muted">
                    {String(step.stepNumber).padStart(2, '0')}
                  </span>
                  <span className="h-3 w-px bg-cf-line-strong" aria-hidden="true" />
                  <span className="font-geist-mono text-xs text-cf-text-2">{step.duration}</span>
                  <Icon className="ml-auto h-4 w-4 text-cf-muted" aria-hidden="true" />
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
