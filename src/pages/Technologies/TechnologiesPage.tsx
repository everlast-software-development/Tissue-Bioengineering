import React from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SectionTitle } from '@/components/common/SectionTitle';
import { TechnologyCard } from '@/components/cards/TechnologyCard';
import { mockTechnologies } from '@/data/mockArticles';
import { CTASection } from '@/components/sections/CTASection';

export const TechnologiesPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Biotech Hardware & Bio-Inks"
        description="Discover our proprietary 3D Bioprinter hardware systems, tangential flow exosome bioreactors, and smart hydrogels."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Technologies' }]} />

        <div className="py-8 text-center max-w-3xl mx-auto">
          <SectionTitle
            badge="Hardware & Bio-Ink Platforms"
            title="Patented Bio-Engineering Platforms"
            subtitle="Engineered systems enabling micron-level tissue bioprinting and clinical-grade exosome harvesting."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
          {mockTechnologies.map((tech) => (
            <TechnologyCard key={tech.id} tech={tech} />
          ))}
        </div>
      </div>

      <CTASection />
    </>
  );
};
