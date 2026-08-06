import React from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { mockArticles } from '@/data/mockArticles';
import { CTASection } from '@/components/sections/CTASection';

export const ArticlesPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Articles & Biotech Insights"
        description="Latest clinical updates, whitepapers, and scientific articles on tissue engineering, wound care, and stem cell advancements."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Articles & Blog' }]} />

        <div className="py-8 text-center max-w-3xl mx-auto">
          <SectionTitle
            badge="Biotech Knowledge Hub"
            title="Scientific Articles & Clinical Notes"
            subtitle="In-depth analysis of 3D bioprinting trends, stem cell exosome therapies, and wound closure innovations."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
          {mockArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>

      <CTASection />
    </>
  );
};
