import React from 'react';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';
import { Article } from '@/types';
import { Clock, User } from 'lucide-react';
import { textLangProps } from '@/i18n/config';
import { cn, coverFitClass, readingMinutes } from '@/lib/utils';

/** Author (when known) and reading time (article cards and the Home page's featured articles). */
export const ArticleMeta: React.FC<{ article: Article; className?: string }> = ({
  article,
  className,
}) => {
  const { t } = useI18n();
  return (
    <div
      className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cf-muted', className)}
    >
      {article.author && (
        <>
          <span className="flex items-center">
            <User className="me-1 h-3.5 w-3.5" aria-hidden="true" />
            {article.author.name}
          </span>
          <span aria-hidden="true">•</span>
        </>
      )}
      <span className="flex items-center">
        <Clock className="me-1 h-3.5 w-3.5" aria-hidden="true" />
        {t.articles.minRead(readingMinutes(article.body))}
      </span>
    </div>
  );
};

/** Article tags as outlined chips (lead card, article page); nothing when there are none. */
export const ArticleTags: React.FC<{ article: Article; className?: string }> = ({
  article,
  className,
}) => {
  const { t, locale } = useI18n();
  if (article.tags.length === 0) return null;
  return (
    <ul
      className={cn('flex flex-wrap gap-1.5', className)}
      aria-label={t.common.tags}
      {...textLangProps(article.lang, locale)}
    >
      {article.tags.map((tag) => (
        <li
          key={tag}
          className="rounded-md border border-cf-line-strong px-2.5 py-1 text-xs text-cf-text-2"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
};

interface ArticleCardProps {
  article: Article;
  /** `feature`: large image beside the text from lg (lead story). `default`: image above. */
  variant?: 'default' | 'feature';
  /** Heading level for the title (h2 on the listing, h3 under a section heading). */
  as?: 'h2' | 'h3';
}

/** Article preview in the "Confocal" style: open layout, hairline footer, no card chrome. */
export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'default',
  as: Heading = 'h2',
}) => {
  const { t, locale } = useI18n();
  const textLang = textLangProps(article.lang, locale);
  const feature = variant === 'feature';
  const href = `/articles/${article.slug}`;
  // Without a cover the card is its text alone (the feature variant then spans the full width).
  const split = feature && Boolean(article.coverImage);

  return (
    <article
      className={cn('group grid gap-6', split && 'lg:grid-cols-12 lg:items-center lg:gap-14')}
    >
      {article.coverImage && (
        <Link
          to={href}
          tabIndex={-1}
          aria-hidden="true"
          className={cn(
            'relative block overflow-hidden rounded-xl border border-cf-line bg-cf-panel',
            feature ? 'aspect-[3/2] lg:col-span-7' : 'aspect-[16/10]'
          )}
        >
          <img
            src={article.coverImage}
            alt={article.coverImageAlt ?? article.title}
            width={article.coverImageWidth}
            height={article.coverImageHeight}
            loading={feature ? undefined : 'lazy'}
            decoding="async"
            className={cn(
              'h-full w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none',
              coverFitClass(article)
            )}
          />
        </Link>
      )}

      <div className={cn('flex min-w-0 flex-col', split && 'lg:col-span-5')}>
        <span className="mb-3 text-[13px] font-medium text-cf-accent" {...textLang}>
          {article.category}
        </span>
        <ArticleMeta article={article} />
        <Heading
          {...textLang}
          className={cn(
            'mt-3 font-semibold text-cf-text',
            feature
              ? 'text-[28px] leading-[1.08] tracking-[-0.035em] sm:text-[40px]'
              : 'text-[22px] leading-snug tracking-[-0.02em]'
          )}
        >
          <Link to={href} className="cf-focus rounded-sm transition-colors hover:text-cf-accent">
            {article.title}
          </Link>
        </Heading>
        <p
          {...textLang}
          className={cn(
            'mt-3 leading-relaxed text-cf-muted',
            feature ? 'text-base sm:text-[17px]' : 'text-[15px]'
          )}
        >
          {article.summary}
        </p>

        {feature && <ArticleTags article={article} className="mt-6" />}

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-cf-line pt-4">
          {article.publishedAt && <span className="cf-mono">{article.publishedAt}</span>}
          <Link to={href} className="cf-link min-h-11 text-sm">
            {t.common.readArticle}
            <span className="sr-only">: {article.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
};
