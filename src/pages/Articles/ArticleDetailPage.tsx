import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { ArticleCard, ArticleTags } from '@/components/cards/ArticleCard';
import { useArticles } from '@/data/useLocalizedData';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';
import { textLangProps } from '@/i18n/config';
import { readingMinutes } from '@/lib/utils';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';
import type { ArticleBlock } from '@/types';

/** Body text with its `**bold**` emphasis as <strong>. */
const inline = (text: string) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-cf-text">
        {part}
      </strong>
    ) : (
      part
    )
  );

/** One body block. Images keep their own aspect ratio and are never upscaled or cropped. */
const BodyBlock: React.FC<{ block: ArticleBlock }> = ({ block }) => {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="pt-6 text-2xl font-semibold leading-tight tracking-[-0.025em] text-cf-text sm:text-[28px]">
          {block.text}
        </h2>
      );
    case 'note':
      return <p className="text-base italic text-cf-muted">{inline(block.text)}</p>;
    case 'paragraph':
      return <p>{inline(block.text)}</p>;
    case 'list':
      return (
        <ul className="list-disc space-y-2 ps-6 marker:text-cf-accent">
          {block.items.map((item, i) => (
            <li key={i} className="ps-1">
              {inline(item)}
            </li>
          ))}
        </ul>
      );
    case 'image':
      return (
        <figure className="py-2">
          <img
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading="lazy"
            decoding="async"
            style={{ maxWidth: block.width }}
            className="h-auto w-full rounded-xl border border-cf-line"
          />
        </figure>
      );
    case 'faq':
      return (
        <div className="divide-y divide-cf-line border-y border-cf-line">
          {block.items.map((item, i) => (
            <div key={i} className="py-6">
              <h3 className="text-lg font-semibold leading-snug tracking-[-0.015em] text-cf-text">
                {item.question}
              </h3>
              <p className="mt-2">{inline(item.answer)}</p>
            </div>
          ))}
        </div>
      );
  }
};

/** Single article: header, cover, reading column with a metadata rail, then other articles. */
export const ArticleDetailPage: React.FC = () => {
  const { t, locale } = useI18n();
  const { slug } = useParams();
  const articles = useArticles();
  const article = articles.find((a) => a.slug === slug);

  if (!article) return <NotFoundPage />;

  const others = articles.filter((a) => a.id !== article.id);
  // An untranslated article keeps its English text; mark it so it reads left to right.
  const textLang = textLangProps(article.lang, locale);

  return (
    <PageShell seo={{ title: article.title, description: article.summary }} cta>
      <PageHero
        breadcrumb={[
          { label: t.articles.backToArticles, path: '/articles' },
          { label: article.title },
        ]}
        eyebrow={<span {...textLang}>{article.category}</span>}
        title={<span {...textLang}>{article.title}</span>}
        titleClassName="max-w-[22ch] [font-size:clamp(2.25rem,1.3rem+3.2vw,4rem)]"
        lead={<span {...textLang}>{article.summary}</span>}
        layout="stack"
      >
        {/* The cover at its own aspect ratio (no crop): full width up to its pixel width, and
            no taller than most of the viewport on wide screens. */}
        <figure className="mt-12 w-fit max-w-full overflow-hidden rounded-xl border border-cf-line bg-cf-panel sm:mt-16">
          <img
            src={article.coverImage}
            alt={article.coverImageAlt ?? article.title}
            width={article.coverImageWidth}
            height={article.coverImageHeight}
            fetchPriority="high"
            decoding="async"
            className="block h-auto max-h-[min(70vh,640px)] w-auto max-w-full"
          />
        </figure>
      </PageHero>

      <div className="cf-section pt-12 sm:pt-16 lg:pt-20">
        <div className="cf-container grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
          {/* Metadata rail */}
          <aside
            className="lg:sticky lg:top-[calc(var(--site-header-offset)+2rem)] lg:self-start"
            aria-label={t.articles.articleDetails}
          >
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-cf-line py-6 sm:grid-cols-4 lg:grid-cols-1">
              {article.author && (
                <div className="col-span-2 sm:col-span-2 lg:col-span-1">
                  <dt className="cf-mono">{t.articles.author}</dt>
                  <dd className="mt-1.5 text-[15px] font-medium text-cf-text">
                    {article.author.name}
                    <span className="mt-0.5 block text-sm font-normal text-cf-muted">
                      {article.author.role}
                    </span>
                  </dd>
                </div>
              )}
              {article.publishedAt && (
                <div>
                  <dt className="cf-mono">{t.articles.published}</dt>
                  <dd className="mt-1.5 text-[15px] text-cf-text-2">{article.publishedAt}</dd>
                </div>
              )}
              <div>
                <dt className="cf-mono">{t.articles.readingTime}</dt>
                <dd className="mt-1.5 text-[15px] text-cf-text-2">
                  {t.articles.minRead(readingMinutes(article.body))}
                </dd>
              </div>
            </dl>
            <ArticleTags article={article} className="mt-6" />
          </aside>

          {/* Reading column */}
          <div className="min-w-0 max-w-[68ch]">
            <div className="cf-prose space-y-6" {...textLang}>
              {article.body.map((block, i) => (
                <BodyBlock key={i} block={block} />
              ))}
            </div>

            <div className="mt-14 border-t border-cf-line pt-6">
              <Link to="/articles" className="cf-link min-h-11 text-sm">
                <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                {t.articles.backToArticles}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <section className="cf-section relative isolate" aria-labelledby="more-articles-heading">
          <div className="cf-container">
            <h2
              id="more-articles-heading"
              className="mb-10 text-2xl font-semibold tracking-[-0.03em] text-cf-text sm:mb-14 sm:text-3xl"
            >
              {t.articles.more}
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
