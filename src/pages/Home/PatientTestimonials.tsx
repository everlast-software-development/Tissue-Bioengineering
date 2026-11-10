import React, { useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';

const testimonials: Testimonial[] = [
  {
    id: 't-1',
    patientName: 'Eleanor Vance',
    treatment: 'Burn Scar Treatment',
    quote:
      'Following my severe burn injury, traditional skin grafts left tight, painful contractures. The 3D bioprinted autologous graft from Tissue Bioengineering restored both mobility and my skin’s natural appearance.',
    rating: 5,
    date: 'June 2026',
  },
  {
    id: 't-2',
    patientName: 'Robert Martinez',
    treatment: 'Diabetic Foot',
    quote:
      'I was facing amputation due to a chronic diabetic ulcer that hadn’t closed in 14 months. Their stem-cell bio-membrane therapy healed the wound completely in just 5 weeks.',
    rating: 5,
    date: 'May 2026',
  },
  {
    id: 't-3',
    patientName: 'Sophia Lin',
    treatment: 'Facial Palsy',
    quote:
      'The bio-engineered nerve conduit procedure restored nerve function and facial muscle control after years of palsy. The care and scientific expertise were world-class.',
    rating: 5,
    date: 'April 2026',
  },
];

const Rating: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex gap-1 text-cf-accent" role="img" aria-label={`Rated ${value} out of 5`}>
    {[...Array(value)].map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
    ))}
  </div>
);

/**
 * Story selector (tabs) + the selected quote. Every story is in the DOM (inactive panels are
 * `hidden`), so all three remain available to search engines and assistive technology.
 */
export const PatientTestimonials: React.FC = () => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = testimonials.length - 1;
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? index === last ? 0 : index + 1
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
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
          eyebrow="Clinical Success"
          title="Patient Recovery Stories"
          subtitle="Real testimonials from patients whose lives were transformed by living tissue bio-grafts."
        />

        <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-20">
          <div
            role="tablist"
            aria-label="Patient stories"
            aria-orientation="vertical"
            className="cf-no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:flex-col lg:overflow-visible"
          >
            {testimonials.map((t, i) => {
              const selected = i === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`story-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`story-panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`cf-focus flex min-h-[72px] shrink-0 items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors duration-200 motion-reduce:transition-none lg:w-full ${
                    selected
                      ? 'border-cf-accent/70 bg-cf-active'
                      : 'border-cf-line hover:border-cf-line-strong hover:bg-cf-panel'
                  }`}
                >
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
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
                      {t.patientName[0]}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span
                      className={`block whitespace-nowrap text-[15px] font-semibold ${
                        selected ? 'text-cf-text' : 'text-cf-text-2'
                      }`}
                    >
                      {t.patientName}
                    </span>
                    <span
                      className={`block whitespace-nowrap text-[13px] ${
                        selected ? 'text-cf-accent' : 'text-cf-muted'
                      }`}
                    >
                      {t.treatment}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {testimonials.map((t, i) => (
            <figure
              key={t.id}
              role="tabpanel"
              id={`story-panel-${t.id}`}
              aria-labelledby={`story-tab-${t.id}`}
              hidden={i !== active}
              className={i === active ? 'cf-fade' : undefined}
            >
              <blockquote className="font-light leading-[1.3] tracking-[-0.02em] text-cf-text [font-size:clamp(1.5rem,1.05rem+1.6vw,2.375rem)] [text-wrap:pretty]">
                <span className="text-cf-accent">“</span>
                {t.quote}
                <span className="text-cf-accent">”</span>
              </blockquote>
              <figcaption className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-cf-line pt-6">
                <Rating value={t.rating} />
                <span className="text-[15px] text-cf-text-2">
                  <span className="font-semibold text-cf-text">{t.patientName}</span>, {t.treatment}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
