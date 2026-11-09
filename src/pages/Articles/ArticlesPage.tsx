import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { articles } from '@/data/articles';

export const ArticlesPage: React.FC = () => {
  const [lead, ...rest] = articles;

  return (
    <PageShell
      seo={{
        title: 'Articles & Biotech Insights',
        description:
          'Latest clinical updates, whitepapers, and scientific articles on tissue engineering, wound care, and stem cell advancements.',
      }}
      cta
    >
      <PageHero
        breadcrumb={[{ label: 'Articles & Blog' }]}
        eyebrow="Biotech Knowledge Hub"
        title="Scientific Articles & Clinical Notes"
        lead="In-depth analysis of 3D bioprinting trends, stem cell exosome therapies, and wound closure innovations."
      />

      <section className="cf-section pt-12 sm:pt-16 lg:pt-20" aria-label="Articles">
        <div className="cf-container">
          {/* Lead story */}
          {lead && <ArticleCard article={lead} variant="feature" />}

          {/* Remaining articles */}
          {rest.length > 0 && (
            <div className="mt-14 grid gap-x-10 gap-y-14 border-t border-cf-line pt-14 sm:mt-20 sm:pt-20 md:grid-cols-2 lg:gap-x-14">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
};
