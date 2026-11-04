import React from 'react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { TechnologyCard } from '@/components/cards/TechnologyCard';
import { technologies } from '@/data/technologies';

export const TechnologiesSection: React.FC = () => {
  return (
    <section className="py-20 relative bg-[#EEF4FA] border-t border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Proprietary Tech"
          title="Engineered Hardware & Biomaterials"
          subtitle="Next-generation bioprinters, exosome bioreactors, and shear-thinning hydrogel platforms."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {technologies.map((tech) => (
            <TechnologyCard key={tech.id} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  );
};
