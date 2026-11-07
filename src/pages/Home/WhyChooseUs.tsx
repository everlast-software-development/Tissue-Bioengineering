import React from 'react';
import { Cpu, ShieldCheck, Microscope, HeartPulse } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const reasons = [
  {
    icon: Microscope,
    title: 'Patient-Derived Cellular Autology',
    description:
      'We harvest and expand the patient’s own stem cells to construct personalized tissue grafts, eliminating organ rejection risks and immune suppressants.',
  },
  {
    icon: Cpu,
    title: '5-Micron 3D Bio-Printing Precision',
    description:
      'Our proprietary stereolithographic bioprinters reproduce microscopic vascular capillary networks essential for tissue survival.',
  },
  {
    icon: ShieldCheck,
    title: 'GMP & ISO 13485 Certified Cleanrooms',
    description:
      'All bio-ink compounding and cellular scaffold processing occurs within ISO Class 5 sterile medical cleanrooms adhering to FDA standards.',
  },
  {
    icon: HeartPulse,
    title: 'Rapid Angiogenesis & Closure Rates',
    description:
      'Bio-active matrix formulations release pro-angiogenic factors, reducing deep wound closure timelines by up to 50%.',
  },
];

/* Inner rules only: a cross between the four cells from sm, a divider between rows below sm. */
const CELL_RULES = [
  'border-b sm:border-r',
  'border-b',
  'border-b sm:border-b-0 sm:border-r',
  '',
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section
      className="cf-section relative border-y border-cf-line bg-cf-raised"
      aria-labelledby="why-heading"
    >
      <div className="cf-container grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <SectionHeader
          id="why-heading"
          layout="stack"
          eyebrow="Scientific Excellence"
          title="Why Tissue Bioengineering Leads"
          subtitle="Combining advanced microfluidics, stem cell engineering, and custom bio-printing to set new global standards in plastic & regenerative surgery."
          className="mb-0 sm:mb-0 lg:sticky lg:top-32 lg:self-start"
        />

        <ul className="grid grid-cols-1 sm:grid-cols-2">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className={`border-cf-line py-8 sm:p-8 lg:p-10 ${CELL_RULES[idx]} ${
                  idx % 2 === 0 ? 'sm:pl-0 lg:pl-0' : 'sm:pr-0 lg:pr-0'
                }`}
              >
                <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-cf-accent/40 text-cf-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold leading-snug tracking-[-0.015em] text-cf-text">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-cf-muted">{item.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
