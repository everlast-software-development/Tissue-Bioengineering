import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { Link } from '@/i18n/Link';
import { useI18n, useMessages } from '@/i18n/context';
import { homeMessages } from './messages';

type CaseId = keyof (typeof homeMessages)['en']['clinical']['cases'];

/** Card structure; title, category, description, technologies, duration and alt are in ./messages.ts. */
interface ClinicalCase {
  id: CaseId;
  slug: string;
  image: string;
}

const CLINICAL_CASES: ClinicalCase[] = [
  { id: 'case-1', slug: 'burn-scar-bio-reconstruction', image: '/images/bioprinted-tissue-well-plate.webp' },
  { id: 'case-2', slug: 'diabetic-foot-ulcer-grafting', image: '/images/diabetic-foot-examination.webp' },
  { id: 'case-3', slug: 'smart-biomaterial-wound-matrix', image: '/images/nanofiber-scaffold-sem.webp' },
  { id: 'case-4', slug: 'keloid-scar-remodeling', image: '/images/keloid-histopathology.webp' },
  { id: 'case-5', slug: 'facial-nerve-regeneration', image: '/images/peripheral-nerve-fibers.webp' },
  { id: 'case-6', slug: 'craniofacial-osteo-grafts', image: '/images/craniofacial-skull-model.webp' },
  { id: 'case-7', slug: 'stem-cell-exosome-therapy', image: '/images/stem-cell-culture-flasks.webp' },
  { id: 'case-8', slug: 'bioprinted-skin-reconstruction', image: '/images/bioprinting-laboratory.webp' },
  { id: 'case-9', slug: 'facial-tissue-regeneration', image: '/images/scaffold-bg.webp' },
];

export const ServicesOverview: React.FC = () => {
  const { t: common, dir } = useI18n();
  const t = useMessages(homeMessages).clinical;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return (
    <section
      id="clinical-applications"
      className="cf-section relative overflow-hidden bg-cf-bg"
      aria-labelledby="clinical-applications-heading"
    >
      <div className="cf-container">
        <SectionHeader
          id="clinical-applications-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />
      </div>

      {/* Infinite Horizontal Carousel Strip */}
      <div className="cf-edge-fade w-full relative z-10 pointer-events-auto">
        <InfiniteSlider
          gap={20}
          duration={prefersReducedMotion ? 999999 : 38}
          durationOnHover={prefersReducedMotion ? 999999 : 500}
          rtl={dir === 'rtl'}
          className="py-4"
        >
          {CLINICAL_CASES.map((item) => {
            const text = t.cases[item.id];
            return (
              <motion.div
                key={item.id}
                className="bg-cf-panel border border-cf-line rounded-xl p-5 sm:p-6 hover:border-cf-line-strong transition-colors duration-500 flex flex-col w-[min(340px,calc(100vw-2.5rem))] sm:w-[380px] md:w-[400px] lg:w-[420px] xl:w-[440px] 2xl:w-[460px] shrink-0 select-none group"
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <div className="grow">
                  {/* Clinical Image */}
                  <div className="relative overflow-hidden rounded-lg mb-5 h-48 bg-cf-raised border border-cf-line">
                    <img
                      src={item.image}
                      alt={text.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cf-bg/50 via-transparent to-transparent" />
                  </div>

                  {/* Category Label */}
                  <span className="text-xs font-medium text-cf-accent bg-cf-active px-2.5 py-1 rounded-md inline-block mb-3">
                    {text.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.015em] text-cf-text line-clamp-2">
                    {text.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-cf-muted mt-2 line-clamp-3 leading-relaxed">
                    {text.description}
                  </p>

                  {/* Key Technologies */}
                  <ul className="mt-4 pt-4 border-t border-cf-line space-y-2">
                    {text.technologies.map((tech, idx) => (
                      <li key={idx} className="flex items-center text-[13px] text-cf-text-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cf-accent me-2.5 shrink-0" aria-hidden="true" />
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer with Duration & CTA */}
                <div className="mt-6 pt-4 border-t border-cf-line flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <div className="flex min-h-8 min-w-0 flex-1 items-center gap-1.5 text-xs text-cf-muted">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-cf-muted" aria-hidden="true" />
                    <span>
                      {common.common.duration} <strong className="font-medium text-cf-text">{text.duration}</strong>
                    </span>
                  </div>
                  <Link
                    to={`/services#${item.slug}`}
                    className="cf-link shrink-0 whitespace-nowrap text-[13px] font-semibold min-h-8"
                  >
                    {t.explore}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </InfiniteSlider>
      </div>
    </section>
  );
};
