import React from 'react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { TimelineStep } from '@/types';
import { UserCheck, Dna, Printer, HeartPulse } from 'lucide-react';

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

export const TreatmentProcess: React.FC = () => {
  return (
    <section className="py-20 relative bg-[#F8FBFF] border-t border-b border-blue-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Clinical Journey"
          title="The 4-Step Bio-Grafting Process"
          subtitle="From initial cellular harvest to 3D bio-printing and vascularized tissue integration."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.stepNumber} className="card-navy card-navy-hover p-6 relative flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-navy text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                      {step.stepNumber}
                    </span>
                    <span className="text-[11px] font-bold text-navy px-2.5 py-1 rounded bg-sky border border-steel/20">
                      {step.duration}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-sky border border-steel/20 flex items-center justify-center text-navy mb-3">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-navy mb-2">{step.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
