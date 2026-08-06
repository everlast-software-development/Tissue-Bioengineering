import React, { useState } from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ResearchCard } from '@/components/cards/ResearchCard';
import { mockResearch } from '@/data/mockResearch';
import { RESEARCH_CATEGORIES } from '@/constants';
import { CTASection } from '@/components/sections/CTASection';

export const ResearchPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered =
    activeCategory === 'All'
      ? mockResearch
      : mockResearch.filter((r) => r.category === activeCategory);

  return (
    <>
      <SEOHead
        title="Research & Innovation"
        description="Peer-reviewed publications, patent portfolios, and breakthrough clinical trials across 3D Bioprinting, Stem Cells, Smart Biomaterials, Gene Editing, Organ-on-Chip, Drug Delivery, Tissue Engineering, and Nanotechnology."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Research & Innovation' }]} />

        <div className="py-8 text-center max-w-3xl mx-auto">
          <SectionTitle
            badge="8 Core Research Pillars"
            title="Scientific Research & Discovery"
            subtitle="Advancing the boundaries of regenerative medicine through bio-printing, organ-on-chip models, and precision nanomedicine."
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeCategory === 'All'
                ? 'bg-navy text-white shadow-soft'
                : 'bg-white border border-border-light text-navy hover:border-navy'
            }`}
          >
            All Research ({mockResearch.length})
          </button>
          {RESEARCH_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-navy text-white shadow-soft'
                  : 'bg-white border border-border-light text-navy hover:border-navy'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {filtered.map((item) => (
            <ResearchCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <CTASection />
    </>
  );
};
