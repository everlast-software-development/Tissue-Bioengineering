import React from 'react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { articles } from '@/data/articles';

export const FeaturedArticles: React.FC = () => {
  return (
    <section className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Scientific Insights"
          title="Featured Biotech Publications"
          subtitle="Articles, whitepapers, and clinical updates authored by our leading tissue bioengineers."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};
