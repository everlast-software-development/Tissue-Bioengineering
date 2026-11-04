import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { articles } from '@/data/articles';

export const ArticlesPage: React.FC = () => {
  return (
    <PageShell
      seo={{
        title: 'Articles & Biotech Insights',
        description:
          'Latest clinical updates, whitepapers, and scientific articles on tissue engineering, wound care, and stem cell advancements.',
      }}
      breadcrumb="Articles & Blog"
      header={{
        badge: 'Biotech Knowledge Hub',
        title: 'Scientific Articles & Clinical Notes',
        subtitle:
          'In-depth analysis of 3D bioprinting trends, stem cell exosome therapies, and wound closure innovations.',
      }}
      cta
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </PageShell>
  );
};
