import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { articles } from '@/data/articles';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';

/** Single article: header, cover, reading column with a metadata rail, then other articles. */
export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) return <NotFoundPage />;

  const others = articles.filter((a) => a.id !== article.id);
  const paragraphs = article.content.split(/\n{2,}/);

  return (
    <PageShell seo={{ title: article.title, description: article.summary }} cta>
      <PageHero
        breadcrumb={[{ label: 'Articles', path: '/articles' }, { label: article.title }]}
        eyebrow={article.category}
        title={article.title}
        titleClassName="max-w-[22ch] [font-size:clamp(2.25rem,1.3rem+3.2vw,4rem)]"
        lead={article.summary}
        layout="stack"
      >
        <figure className="mt-12 overflow-hidden rounded-xl border border-cf-line bg-cf-panel sm:mt-16">
          <img
            src={article.coverImage}
            alt={article.coverImageAlt ?? article.title}
            width={1200}
            height={800}
            fetchPriority="high"
            decoding="async"
            className="aspect-[3/2] w-full object-cover sm:aspect-[2/1] lg:aspect-[21/9]"
          />
        </figure>
      </PageHero>

      <div className="cf-section pt-12 sm:pt-16 lg:pt-20">
        <div className="cf-container grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
          {/* Metadata rail */}
          <aside className="lg:sticky lg:top-[120px] lg:self-start" aria-label="Article details">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-cf-line py-6 sm:grid-cols-4 lg:grid-cols-1">
              <div className="col-span-2 sm:col-span-2 lg:col-span-1">
                <dt className="cf-mono">Author</dt>
                <dd className="mt-1.5 text-[15px] font-medium text-cf-text">
                  {article.author.name}
                  <span className="mt-0.5 block text-sm font-normal text-cf-muted">
                    {article.author.role}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="cf-mono">Published</dt>
                <dd className="mt-1.5 text-[15px] text-cf-text-2">{article.publishedAt}</dd>
              </div>
              <div>
                <dt className="cf-mono">Reading time</dt>
                <dd className="mt-1.5 text-[15px] text-cf-text-2">{article.readTime}</dd>
              </div>
            </dl>
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tags">
              {article.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md border border-cf-line-strong px-2.5 py-1 text-xs text-cf-text-2"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </aside>

          {/* Reading column */}
          <div className="min-w-0 max-w-[68ch]">
            <div className="cf-prose space-y-6">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-14 border-t border-cf-line pt-6">
              <Link to="/articles" className="cf-link min-h-11 text-sm">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Articles
              </Link>
            </div>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <section
          className="cf-section border-t border-cf-line"
          aria-labelledby="more-articles-heading"
        >
          <div className="cf-container">
            <h2
              id="more-articles-heading"
              className="mb-10 text-2xl font-semibold tracking-[-0.03em] text-cf-text sm:mb-14 sm:text-3xl"
            >
              More Articles
            </h2>
            <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:gap-x-14">
              {others.map((a) => (
                <ArticleCard key={a.id} article={a} as="h3" />
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
};
