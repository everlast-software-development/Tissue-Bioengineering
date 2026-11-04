import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { TechnologyCard } from '@/components/cards/TechnologyCard';
import { technologies } from '@/data/technologies';

export const TechnologiesPage: React.FC = () => {
  return (
    <PageShell
      seo={{
        title: 'Biotech Hardware & Bio-Inks',
        description:
          'Discover our proprietary 3D Bioprinter hardware systems, tangential flow exosome bioreactors, and smart hydrogels.',
      }}
      breadcrumb="Technologies"
      header={{
        badge: 'Hardware & Bio-Ink Platforms',
        title: 'Patented Bio-Engineering Platforms',
        subtitle:
          'Engineered systems enabling micron-level tissue bioprinting and clinical-grade exosome harvesting.',
      }}
      cta
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
        {technologies.map((tech) => (
          <TechnologyCard key={tech.id} tech={tech} />
        ))}
      </div>
    </PageShell>
  );
};
