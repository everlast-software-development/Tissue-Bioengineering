import React, { useState } from 'react';
import { PageShell } from '@/components/common/PageShell';
import { FilterBar } from '@/components/common/FilterBar';
import { ResearchCard } from '@/components/cards/ResearchCard';
import { researchItems } from '@/data/research';
import { RESEARCH_CATEGORIES } from '@/lib/site';

export const ResearchPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered =
    activeCategory === 'All'
      ? researchItems
      : researchItems.filter((r) => r.category === activeCategory);

  return (
    <PageShell
      seo={{
        title: 'Research & Innovation',
        description:
          'Peer-reviewed publications, patent portfolios, and breakthrough clinical trials across 3D Bioprinting, Stem Cells, Smart Biomaterials, Gene Editing, Organ-on-Chip, Drug Delivery, Tissue Engineering, and Nanotechnology.',
      }}
      breadcrumb="Research & Innovation"
      header={{
        badge: '8 Core Research Pillars',
        title: 'Scientific Research & Discovery',
        subtitle:
          'Advancing the boundaries of regenerative medicine through bio-printing, organ-on-chip models, and precision nanomedicine.',
      }}
      cta
    >
      <FilterBar
        options={RESEARCH_CATEGORIES}
        value={activeCategory}
        onChange={setActiveCategory}
        allLabel={<>All Research ({researchItems.length})</>}
        pillClassName="px-3.5"
      />

      {/* Research Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
        {filtered.map((item) => (
          <ResearchCard key={item.id} item={item} />
        ))}
      </div>
    </PageShell>
  );
};
