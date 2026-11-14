import React, { useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useI18n, useMessages } from '@/i18n/context';
import { homeMessages } from './messages';

type TestimonialId = keyof (typeof homeMessages)['en']['testimonials']['items'];

/** Story metadata; each patient's name and quote are in ./messages.ts (`testimonials.items`). */
const testimonials: (Omit<Testimonial, 'patientName' | 'quote'> & { id: TestimonialId })[] = [
  { id: 't-1', treatment: 'Burn Scar Treatment', rating: 5, date: 'June 2026' },
  { id: 't-2', treatment: 'Diabetic Foot', rating: 5, date: 'May 2026' },
  { id: 't-3', treatment: 'Facial Palsy', rating: 5, date: 'April 2026' },
];

const Rating: React.FC<{ value: number }> = ({ value }) => {
  const t = useMessages(homeMessages).testimonials;
  return (
    <div className="flex gap-1 text-cf-accent" role="img" aria-label={t.rated(value)}>
      {[...Array(value)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
      ))}
    </div>
  );
};

/**
 * Story selector (tabs) + the selected quote. Every story is in the DOM (inactive panels are
 * `hidden`), so all three remain available to search engines and assistive technology.
 */
export const PatientTestimonials: React.FC = () => {
  const { t: common, dir } = useI18n();
  const t = useMessages(homeMessages).testimonials;
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // The tabs run horizontally below lg, so Left/Right follow the reading direction.
  const forwardKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const backKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = testimonials.length - 1;
    const next =
      e.key === 'ArrowDown' || e.key === forwardKey
        ? index === last ? 0 : index + 1
        : e.key === 'ArrowUp' || e.key === backKey
          ? index === 0 ? last : index - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      className="cf-section relative border-y border-cf-line bg-cf-raised"
      aria-labelledby="stories-heading"
    >
      <div className="cf-container">
        <SectionHeader
          id="stories-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />

        <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-20">
          <div
            role="tablist"
            aria-label={t.tablistLabel}
            aria-orientation="vertical"
            className="cf-no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:flex-col lg:overflow-visible"
          >
            {testimonials.map((story, i) => {
              const selected = i === active;
              const text = t.items[story.id];
              return (
                <button
                  key={story.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`story-tab-${story.id}`}
                  aria-selected={selected}
                  aria-controls={`story-panel-${story.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`cf-focus flex min-h-[72px] shrink-0 items-center gap-3 rounded-lg border px-4 py-3 text-start transition-colors duration-200 motion-reduce:transition-none lg:w-full ${
                    selected
                      ? 'border-cf-accent/70 bg-cf-active'
                      : 'border-cf-line hover:border-cf-line-strong hover:bg-cf-panel'
                  }`}
                >
                  {story.avatarUrl ? (
                    <img
                      src={story.avatarUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full border border-cf-line-strong object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        selected ? 'bg-cf-accent text-cf-ink' : 'bg-cf-panel text-cf-text-2'
                      }`}
                    >
                      {/* Latin monogram in every language (a lone Arabic letter reads poorly). */}
                      {homeMessages.en.testimonials.items[story.id].patientName[0]}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span
                      className={`block whitespace-nowrap text-[15px] font-semibold ${
                        selected ? 'text-cf-text' : 'text-cf-text-2'
                      }`}
                    >
                      {text.patientName}
                    </span>
                    <span
                      className={`block whitespace-nowrap text-[13px] ${
                        selected ? 'text-cf-accent' : 'text-cf-muted'
                      }`}
                    >
                      {common.categories.service[story.treatment]}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {testimonials.map((story, i) => (
            <figure
              key={story.id}
              role="tabpanel"
              id={`story-panel-${story.id}`}
              aria-labelledby={`story-tab-${story.id}`}
              hidden={i !== active}
              className={i === active ? 'cf-fade' : undefined}
            >
              <blockquote className="font-light leading-[1.3] tracking-[-0.02em] text-cf-text [font-size:clamp(1.5rem,1.05rem+1.6vw,2.375rem)] [text-wrap:pretty]">
                <span className="text-cf-accent">{t.openQuote}</span>
                {t.items[story.id].quote}
                <span className="text-cf-accent">{t.closeQuote}</span>
              </blockquote>
              <figcaption className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-cf-line pt-6">
                <Rating value={story.rating} />
                <span className="text-[15px] text-cf-text-2">
                  <span className="font-semibold text-cf-text">{t.items[story.id].patientName}</span>
                  {common.common.listSeparator}
                  {common.categories.service[story.treatment]}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
