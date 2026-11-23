import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Clock,
  List,
  Minus,
  Plus,
  Quote,
  UserRound,
} from 'lucide-react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { ArticleCard, ArticleTags } from '@/components/cards/ArticleCard';
import { useArticles } from '@/data/useLocalizedData';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';
import { textLangProps } from '@/i18n/config';
import { cn, readingMinutes } from '@/lib/utils';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';
import type { ArticleBlock } from '@/types';

/** Inset panel for notes and lists: a shade lighter than the article panel, hairline border. */
const INSET = 'rounded-xl border border-cf-line bg-white/[0.025]';

/** Fewer headings than this and the article has no table of contents (one centred column). */
const MIN_TOC_HEADINGS = 3;

/** Hero metadata pill (reading time, author, date). */
const META_PILL =
  'inline-flex items-center gap-2 rounded-full border border-cf-line-strong px-3 py-1.5 text-xs text-cf-text-2';

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

/** A heading and the blocks under it. The intro (blocks before the first heading) has none. */
interface Section {
  id?: string;
  heading?: string;
  blocks: ArticleBlock[];
}

/**
 * Splits the body at its headings. Ids (for aria-labelledby, the table of contents and #links)
 * come from the heading text, made unique.
 */
function toSections(body: ArticleBlock[]): Section[] {
  const sections: Section[] = [{ blocks: [] }];
  const used = new Set<string>();
  for (const block of body) {
    if (block.type === 'heading') {
      const slug =
        block.text
          .toLowerCase()
          .replace(/[^\p{L}\p{N}]+/gu, '-')
          .replace(/^-+|-+$/g, '') || `section-${sections.length}`;
      let id = slug;
      for (let n = 2; used.has(id); n++) id = `${slug}-${n}`;
      used.add(id);
      sections.push({ id, heading: block.text, blocks: [] });
    } else {
      sections[sections.length - 1].blocks.push(block);
    }
  }
  return sections.filter((s) => s.heading || s.blocks.length > 0);
}

/**
 * One body block; every type renders only what the article supplies. Figures keep their own
 * aspect ratio and are never upscaled or cropped. `figure` numbers a captioned image.
 */
const BodyBlock: React.FC<{ block: ArticleBlock; figure?: number }> = ({ block, figure }) => {
  const { t, locale } = useI18n();
  switch (block.type) {
    case 'heading':
      return null; // rendered by the section
    case 'note':
      return (
        <div
          className={`${INSET} flex gap-3 px-4 py-3.5 text-[15px] leading-relaxed text-cf-muted sm:px-5 sm:py-4`}
        >
          <Quote className="mt-1 h-4 w-4 shrink-0 text-cf-accent" aria-hidden="true" />
          <p>{inline(block.text)}</p>
        </div>
      );
    case 'paragraph':
      return <p>{inline(block.text)}</p>;
    case 'list':
      return (
        <ul className={`${INSET} space-y-3 px-5 py-5 sm:px-6`}>
          {block.items.map((item, i) => (
            <li
              key={i}
              className="relative ps-6 before:absolute before:start-0.5 before:top-[calc(0.875em-3px)] before:h-1.5 before:w-1.5 before:rounded-full before:bg-cf-accent"
            >
              {inline(item)}
            </li>
          ))}
        </ul>
      );
    case 'image':
      return (
        // Edge to edge inside the panel on phones (the diagrams' labels stay legible), framed from sm.
        <figure className="-mx-4 py-2 sm:mx-0 sm:py-3">
          <div className="overflow-hidden border-y border-cf-line bg-white sm:rounded-xl sm:border sm:p-4">
            <img
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              loading="lazy"
              decoding="async"
              className="mx-auto block h-auto w-full"
              style={{ maxWidth: block.width }}
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 flex items-baseline gap-3 px-4 text-sm leading-snug text-cf-muted sm:px-0">
              {figure !== undefined && (
                <span
                  className="shrink-0 rounded-md bg-cf-accent/10 px-2 py-0.5 text-xs font-medium text-cf-accent"
                  lang={locale}
                >
                  {t.articles.figure(figure)}
                </span>
              )}
              <span>{block.caption}</span>
            </figcaption>
          )}
        </figure>
      );
    case 'faq':
      return (
        <div className="overflow-hidden rounded-xl border border-cf-line">
          {block.items.map((item, i) => (
            <details
              key={i}
              className="group border-b border-cf-line transition-colors last:border-b-0 open:bg-white/[0.025]"
            >
              <summary className="cf-focus flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 focus-visible:outline-offset-[-2px] sm:px-5 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-medium leading-snug text-cf-text transition-colors group-hover:text-cf-accent">
                  {item.question}
                </h3>
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-cf-accent/40 text-cf-accent"
                  aria-hidden="true"
                >
                  <Plus className="h-3.5 w-3.5 group-open:hidden" />
                  <Minus className="hidden h-3.5 w-3.5 group-open:block" />
                </span>
              </summary>
              <p className="px-4 pb-5 text-base leading-relaxed sm:px-5 sm:pe-16">
                {inline(item.answer)}
              </p>
            </details>
          ))}
        </div>
      );
  }
};

type TocEntry = { id: string; heading: string };

/** Scrolls a section heading under the fixed header (its scroll-margin) and moves focus to it. */
function goToSection(id: string) {
  const heading = document.getElementById(id);
  if (!heading) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // `instant`, not `auto`: <html> is scroll-smooth.
  heading.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
  heading.focus({ preventScroll: true });
  history.replaceState(history.state, '', `#${id}`);
}

/** The id of the section being read: the last heading that has reached its scroll position. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(' ');
  useEffect(() => {
    if (!key) return;
    const headings = key
      .split(' ')
      .map((id) => document.getElementById(id))
      .filter((h): h is HTMLElement => h !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const h of headings) {
        const line = parseFloat(getComputedStyle(h).scrollMarginTop) + 8;
        if (h.getBoundingClientRect().top <= line) current = h.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [key]);
  return active;
}

/** The section links, shared by the desktop sidebar and the collapsible panel below xl. */
const TocList: React.FC<{
  entries: TocEntry[];
  active: string | null;
  onNavigate: (id: string) => void;
  className?: string;
  lang?: React.HTMLAttributes<HTMLElement>;
}> = ({ entries, active, onNavigate, className, lang }) => (
  <ol className={cn('border-s border-cf-line', className)} {...lang}>
    {entries.map(({ id, heading }) => (
      <li key={id}>
        <a
          href={`#${id}`}
          aria-current={active === id ? 'location' : undefined}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(id);
          }}
          className={cn(
            'cf-focus -ms-px block border-s-2 py-1.5 ps-4 leading-snug transition-colors',
            active === id
              ? 'border-cf-accent text-cf-accent'
              : 'border-transparent text-cf-muted hover:text-cf-text'
          )}
        >
          {heading}
        </a>
      </li>
    ))}
  </ol>
);

/**
 * Single article. Hero: breadcrumb, then category, title, intro and metadata beside the cover
 * (stacked below lg). Body: one bordered panel in the shared container, with a centred reading
 * column holding the sections, figures, FAQ and the link back to the listing. With enough headings
 * the panel also has a table of contents: a sticky sidebar from xl, a collapsible panel above the
 * body below it. Every part is drawn from the article's data, so short and long articles use the
 * same template.
 */
export const ArticleDetailPage: React.FC = () => {
  const { t, locale } = useI18n();
  const { slug } = useParams();
  const articles = useArticles();
  const article = articles.find((a) => a.slug === slug);

  const sections = useMemo(() => (article ? toSections(article.body) : []), [article]);
  // Captioned images numbered in reading order.
  const figures = useMemo(() => {
    const numbers = new Map<ArticleBlock, number>();
    for (const block of article?.body ?? [])
      if (block.type === 'image' && block.caption) numbers.set(block, numbers.size + 1);
    return numbers;
  }, [article]);

  // Table of contents: the article's own headings, only when there are enough of them.
  const toc = useMemo<TocEntry[]>(() => {
    const entries = sections.flatMap((s) =>
      s.id && s.heading ? [{ id: s.id, heading: s.heading }] : []
    );
    return entries.length >= MIN_TOC_HEADINGS ? entries : [];
  }, [sections]);
  const active = useActiveSection(useMemo(() => toc.map((e) => e.id), [toc]));
  const tocPanel = useRef<HTMLDetailsElement>(null);
  const navigate = (id: string) => {
    // Close the panel first, so the scroll target is measured in the final layout.
    if (tocPanel.current) tocPanel.current.open = false;
    goToSection(id);
  };

  // A #section link opened directly: the page renders after the browser's own jump, so redo it.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !toc.some((e) => e.id === id)) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    );
    return () => cancelAnimationFrame(frame);
  }, [toc]);

  if (!article) return <NotFoundPage />;

  const others = articles.filter((a) => a.id !== article.id);
  // An untranslated article keeps its English text; mark it so it reads left to right.
  const textLang = textLangProps(article.lang, locale);
  const blocks = (list: ArticleBlock[]) =>
    list.map((block, j) => <BodyBlock key={j} block={block} figure={figures.get(block)} />);

  return (
    <PageShell seo={{ title: article.title, description: article.summary }} cta>
      <PageHero
        breadcrumb={[
          { label: t.articles.backToArticles, path: '/articles' },
          { label: article.title },
        ]}
        // Block-level, so an untranslated (left-to-right) category and title also align left.
        eyebrow={
          <span className="flex" {...textLang}>
            <span className="inline-flex items-center gap-2 rounded-full border border-cf-accent/30 bg-cf-accent/10 px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-cf-accent" aria-hidden="true" />
              {article.category}
            </span>
          </span>
        }
        title={
          <span className="block" {...textLang}>
            {article.title}
          </span>
        }
        titleClassName="max-w-none [font-size:clamp(2.125rem,1.2rem+2.2vw,3rem)] leading-[1.06]"
        // Two columns from lg: title (row 1) and intro (row 2) on one side, the cover spanning both
        // on the other. `lg:gap-6` replaces the split layout's gap before the column gap is set.
        gridClassName="mt-8 gap-6 sm:mt-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-6 lg:gap-x-14 xl:gap-x-20"
        // The intro and the cover become grid items of their own.
        leadClassName="contents"
        aside={
          <>
            <div className="cf-fade lg:col-start-1 lg:row-start-2">
              <p className="cf-lead" {...textLang}>
                {article.summary}
              </p>
              <dl
                className="mt-6 flex flex-wrap items-center gap-2"
                aria-label={t.articles.articleDetails}
              >
                {article.author && (
                  <div className={META_PILL}>
                    <dt className="sr-only">{t.articles.author}</dt>
                    <UserRound className="h-3.5 w-3.5 text-cf-accent" aria-hidden="true" />
                    <dd>
                      <span className="text-cf-text">{article.author.name}</span>
                      <span className="text-cf-muted"> · {article.author.role}</span>
                    </dd>
                  </div>
                )}
                {article.publishedAt && (
                  <div className={META_PILL}>
                    <dt className="sr-only">{t.articles.published}</dt>
                    <CalendarDays className="h-3.5 w-3.5 text-cf-accent" aria-hidden="true" />
                    <dd>{article.publishedAt}</dd>
                  </div>
                )}
                <div className={META_PILL}>
                  <dt className="sr-only">{t.articles.readingTime}</dt>
                  <Clock className="h-3.5 w-3.5 text-cf-accent" aria-hidden="true" />
                  <dd>{t.articles.minRead(readingMinutes(article.body))}</dd>
                </div>
              </dl>
            </div>

            {/* The cover at its own aspect ratio (never cropped), never wider than its pixels. */}
            <figure
              className="cf-fade w-full overflow-hidden rounded-xl border border-cf-line bg-cf-panel lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:rounded-2xl"
              style={{ maxWidth: article.coverImageWidth }}
            >
              <img
                src={article.coverImage}
                alt={article.coverImageAlt ?? article.title}
                width={article.coverImageWidth}
                height={article.coverImageHeight}
                fetchPriority="high"
                decoding="async"
                className="block h-auto w-full"
              />
            </figure>
          </>
        }
      />

      {/* No divider: the panel continues the hero, pulled up into the hero's bottom padding. */}
      <div className="cf-section cf-no-rule -mt-4 pt-0 sm:-mt-8 lg:-mt-10">
        {/* The site's shared container: the same edges as every other page. */}
        <div className="cf-container">
          <div
            className={cn(
              'rounded-xl border border-cf-line bg-cf-panel/70 px-4 py-10 sm:px-8 sm:py-12 md:px-12 lg:rounded-2xl lg:px-16 lg:py-16',
              // From xl: contents sidebar (about a fifth of the panel), divider, reading column.
              toc.length > 0 && 'xl:grid xl:grid-cols-[21%_minmax(0,1fr)]'
            )}
          >
            {toc.length > 0 && (
              <nav
                className="hidden border-e border-cf-line pe-8 xl:block"
                aria-labelledby="toc-heading"
              >
                <div className="sticky top-[calc(var(--site-header-h)+2rem)] max-h-[calc(100svh-var(--site-header-h)-4rem)] overflow-y-auto">
                  <p id="toc-heading" className="mb-4 text-xs font-medium text-cf-muted">
                    {t.articles.contents}
                  </p>
                  <TocList
                    entries={toc}
                    active={active}
                    onNavigate={navigate}
                    className="text-[13px]"
                    lang={textLang}
                  />
                </div>
              </nav>
            )}

            {/* Beside the sidebar the column keeps its full measure, centred in the remaining space. */}
            <div className={cn(toc.length > 0 && 'xl:ps-12 2xl:ps-16')}>
              <div className="mx-auto w-full max-w-[48rem]">
                {toc.length > 0 && (
                  <details ref={tocPanel} className={`${INSET} group/toc mb-10 xl:hidden`}>
                    <summary className="cf-focus flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 text-sm font-medium text-cf-text focus-visible:outline-offset-[-2px] [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center gap-2.5">
                        <List className="h-4 w-4 text-cf-accent" aria-hidden="true" />
                        {t.articles.contents}
                      </span>
                      <ChevronDown
                        className="h-4 w-4 text-cf-muted transition-transform group-open/toc:rotate-180 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </summary>
                    <nav
                      className="border-t border-cf-line px-4 pb-4 pt-3"
                      aria-label={t.articles.contents}
                    >
                      <TocList
                        entries={toc}
                        active={active}
                        onNavigate={navigate}
                        className="text-sm"
                        lang={textLang}
                      />
                    </nav>
                  </details>
                )}

                <article className="cf-prose" aria-labelledby="page-title" {...textLang}>
                  {sections.map((section, i) =>
                    section.id ? (
                      <section
                        key={section.id}
                        aria-labelledby={section.id}
                        className="pt-12 first:pt-0 sm:pt-14"
                      >
                        <span
                          className="mb-4 block h-0.5 w-8 rounded-full bg-cf-accent"
                          aria-hidden="true"
                        />
                        <h2
                          id={section.id}
                          // Focus target of the contents links; lands under the header and its rule.
                          tabIndex={-1}
                          className="scroll-mt-[calc(var(--site-header-h)+3.5rem)] text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-cf-text focus:outline-none sm:text-[1.75rem]"
                        >
                          {section.heading}
                        </h2>
                        <div className="mt-5 space-y-5">{blocks(section.blocks)}</div>
                      </section>
                    ) : (
                      <div key={`intro-${i}`} className="space-y-5">
                        {blocks(section.blocks)}
                      </div>
                    )
                  )}
                </article>

                <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-cf-line pt-6 sm:mt-14">
                  <Link
                    to="/articles"
                    className="cf-btn cf-btn-outline-accent min-h-11 px-5 text-sm"
                  >
                    <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                    {t.articles.backToList}
                  </Link>
                  <ArticleTags article={article} />
                </div>
              </div>
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
