import React from 'react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Cpu, ShieldCheck, Microscope, HeartPulse } from 'lucide-react';

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

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Scientific Excellence"
          title="Why Tissue Bioengineering Leads"
          subtitle="Combining advanced microfluidics, stem cell engineering, and custom bio-printing to set new global standards in plastic & regenerative surgery."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card-navy card-navy-hover p-6 flex flex-col justify-between group bg-white"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky border border-steel/20 flex items-center justify-center text-navy mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-steel transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
