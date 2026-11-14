import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { useArticles } from '@/data/useLocalizedData';
import { useMessages } from '@/i18n/context';
import { articlesMessages } from './messages';

export const ArticlesPage: React.FC = () => {
  const t = useMessages(articlesMessages);
  const [lead, ...rest] = useArticles();

  return (
    <PageShell seo={t.seo} cta>
      <PageHero
        breadcrumb={[{ label: t.breadcrumb }]}
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        cells
      />

      <section className="cf-section pt-12 sm:pt-16 lg:pt-20" aria-label={t.sectionLabel}>
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
