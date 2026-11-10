import React, { useState } from 'react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { FilterBar } from '@/components/common/FilterBar';
import { ResearchCard } from '@/components/cards/ResearchCard';
import { researchItems } from '@/data/research';
import { RESEARCH_CATEGORIES } from '@/lib/site';

/** Number of publications per domain, shown in the filter. */
const COUNTS: Record<string, number> = Object.fromEntries(
  RESEARCH_CATEGORIES.map((cat) => [cat, researchItems.filter((r) => r.category === cat).length])
);

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
      cta
    >
      <PageHero
        breadcrumb={[{ label: 'Research & Innovation' }]}
        eyebrow="8 Core Research Pillars"
        title="Scientific Research & Discovery"
        lead="Advancing the boundaries of regenerative medicine through bio-printing, organ-on-chip models, and precision nanomedicine."
      />

      <section className="cf-section pt-10 sm:pt-14 lg:pt-20" aria-label="Publications">
        <div className="cf-container grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-20">
          {/* Domain rail (lg) / scrolling strip (below lg) */}
          <div className="min-w-0 lg:sticky lg:top-[120px] lg:self-start">
            <FilterBar
              label="Filter research by domain"
              layout="rail"
              options={RESEARCH_CATEGORIES}
              value={activeCategory}
              onChange={setActiveCategory}
              allLabel={<>All Research ({researchItems.length})</>}
              counts={COUNTS}
              className="lg:border-y lg:border-cf-line"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-4 border-b border-cf-line pb-4">
              <p className="text-sm font-medium text-cf-text">
                {activeCategory === 'All' ? 'All Research' : activeCategory}
              </p>
              <p className="cf-mono" aria-live="polite">
                {String(filtered.length).padStart(2, '0')} / {String(researchItems.length).padStart(2, '0')}
              </p>
            </div>
            {filtered.map((item) => (
              <ResearchCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
};
