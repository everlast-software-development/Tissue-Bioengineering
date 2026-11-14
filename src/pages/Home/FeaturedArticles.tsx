import React from 'react';
import { useArticles } from '@/data/useLocalizedData';
import { Article } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ArticleMeta } from '@/components/cards/ArticleCard';
import { Link } from '@/i18n/Link';
import { useI18n, useMessages } from '@/i18n/context';
import { homeMessages } from './messages';

const Footer: React.FC<{ article: Article }> = ({ article }) => {
  const { t } = useI18n();
  return (
    <div className="mt-5 flex items-center justify-between gap-4 border-t border-cf-line pt-4">
      <span className="text-xs text-cf-muted">{article.publishedAt}</span>
      <Link to={`/articles/${article.slug}`} className="cf-link min-h-11 text-sm">
        {t.common.readArticle}
      </Link>
    </div>
  );
};

/** First article: large image above the text. */
const LeadArticle: React.FC<{ article: Article }> = ({ article }) => (
  <article className="group flex flex-col">
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-cf-line bg-cf-panel">
      <img
        src={article.coverImage}
        alt={article.coverImageAlt ?? article.title}
        width={1200}
        height={800}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
      />
    </div>
    <div className="mt-6 flex flex-1 flex-col">
      <span className="mb-3 text-[13px] font-medium text-cf-accent">{article.category}</span>
      <ArticleMeta article={article} />
      <h3 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.03em] text-cf-text sm:text-[30px]">
        {article.title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-cf-muted">{article.summary}</p>
      <div className="mt-auto">
        <Footer article={article} />
      </div>
    </div>
  </article>
);

/** Remaining articles: compact horizontal rows. */
const ArticleRow: React.FC<{ article: Article }> = ({ article }) => (
  <article className="group grid gap-5 border-t border-cf-line py-8 first:border-t-0 first:pt-0 sm:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[180px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)]">
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-cf-line bg-cf-panel sm:aspect-[180/132]">
      <img
        src={article.coverImage}
        alt={article.coverImageAlt ?? article.title}
        width={1200}
        height={600}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
      />
    </div>
    <div className="flex min-w-0 flex-col">
      <span className="mb-2 text-[13px] font-medium text-cf-accent">{article.category}</span>
      <ArticleMeta article={article} />
      <h3 className="mt-2 text-lg font-semibold leading-snug tracking-[-0.015em] text-cf-text">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-cf-muted">{article.summary}</p>
      <Footer article={article} />
    </div>
  </article>
);

export const FeaturedArticles: React.FC = () => {
  const t = useMessages(homeMessages).articles;
  const [lead, ...rest] = useArticles();

  return (
    <section
      className="cf-section relative border-t border-cf-line bg-cf-bg"
      aria-labelledby="articles-heading"
    >
      <div className="cf-container">
        <SectionHeader
          id="articles-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          {lead && <LeadArticle article={lead} />}
          <div>
            {rest.map((article) => (
              <ArticleRow key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
