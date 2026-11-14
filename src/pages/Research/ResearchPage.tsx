import React, { useState } from 'react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { FilterBar } from '@/components/common/FilterBar';
import { ResearchCard } from '@/components/cards/ResearchCard';
import { researchItems } from '@/data/research';
import { useResearchItems } from '@/data/useLocalizedData';
import { RESEARCH_CATEGORIES } from '@/lib/site';
import type { ResearchCategory } from '@/types';
import { useI18n, useMessages } from '@/i18n/context';
import { researchMessages } from './messages';

/** Number of publications per domain, shown in the filter. */
const COUNTS: Record<string, number> = Object.fromEntries(
  RESEARCH_CATEGORIES.map((cat) => [cat, researchItems.filter((r) => r.category === cat).length])
);

export const ResearchPage: React.FC = () => {
  const { t: common } = useI18n();
  const t = useMessages(researchMessages);
  const items = useResearchItems();
  /** 'All' or an English category name (the filter value); its label is translated. */
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categoryLabel = (cat: string) => common.categories.research[cat as ResearchCategory];

  const filtered =
    activeCategory === 'All' ? items : items.filter((r) => r.category === activeCategory);

  return (
    <PageShell seo={t.seo} cta>
      <PageHero
        breadcrumb={[{ label: t.breadcrumb }]}
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        cells
      />

      <section className="cf-section pt-10 sm:pt-14 lg:pt-20" aria-label={t.sectionLabel}>
        <div className="cf-container grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-20">
          {/* Domain rail (lg) / scrolling strip (below lg) */}
          <div className="min-w-0 lg:sticky lg:top-[120px] lg:self-start">
            <FilterBar
              label={t.filterLabel}
              layout="rail"
              options={RESEARCH_CATEGORIES}
              getLabel={categoryLabel}
              value={activeCategory}
              onChange={setActiveCategory}
              allLabel={t.allLabel(items.length)}
              counts={COUNTS}
              className="lg:border-y lg:border-cf-line"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-4 border-b border-cf-line pb-4">
              <p className="text-sm font-medium text-cf-text">
                {activeCategory === 'All' ? t.allHeading : categoryLabel(activeCategory)}
              </p>
              <p className="cf-mono" aria-live="polite">
                {String(filtered.length).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
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
