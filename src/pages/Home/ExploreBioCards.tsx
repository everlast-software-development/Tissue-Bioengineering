import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, FlaskConical, Microscope, BookOpen, Building2 } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Link } from '@/i18n/Link';
import { useMessages } from '@/i18n/context';
import { homeMessages } from './messages';

/* ─── Card Data (text in ./messages.ts, `explore.cards`) ──────── */
const CARDS = [
  { key: 'services', path: '/services', icon: FlaskConical },
  { key: 'research', path: '/research', icon: Microscope },
  { key: 'articles', path: '/articles', icon: BookOpen },
  { key: 'about', path: '/about', icon: Building2 },
] as const;

/* ─── Animation Variants ─────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Component ───────────────────────────────────────────── */
export const ExploreBioCards: React.FC = () => {
  const t = useMessages(homeMessages).explore;
  // Reduced motion: render the heading and cards in place, without the entrance.
  const still = useReducedMotion() ?? false;

  return (
    <section
      className="cf-amb cf-amb--explore w-full select-none overflow-hidden bg-cf-bg"
      aria-label={t.sectionLabel}
    >
      {/* ── Content ─────────────────────────────────────────── */}
      <div className="cf-container cf-section relative z-10">
        <motion.div
          initial={still ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            eyebrow={t.eyebrow}
            title={t.title}
            subtitle={t.subtitle}
          />
        </motion.div>

        {/* Ruled index: the hairlines are each cell's 1px ring filling the 1px gaps (the outer ring
            is clipped by the rounded border). Cells are slightly translucent so the ambient
            light behind reads through them; hover/focus turns a cell opaque. */}
        <motion.ul
          variants={containerVariants}
          initial={still ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-cf-line sm:grid-cols-2 xl:grid-cols-4"
        >
          {CARDS.map((card) => {
            const IconComponent = card.icon;
            const text = t.cards[card.key];
            return (
              <li key={card.key} className="bg-cf-bg/[0.7] shadow-[0_0_0_1px_theme(colors.cf.line)]">
                <motion.div variants={cardVariants} className="h-full">
                  <Link
                    to={card.path}
                    className="group flex h-full min-h-[240px] flex-col p-7 transition-colors duration-300 hover:bg-cf-active focus:outline-none focus-visible:bg-cf-active focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cf-accent sm:min-h-[280px] sm:p-8"
                  >
                    <span className="mb-10 flex h-11 w-11 items-center justify-center rounded-lg border border-cf-line-strong text-cf-accent transition-colors duration-300 group-hover:border-cf-accent/60">
                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <h3 className="text-[21px] font-semibold leading-snug tracking-[-0.015em] text-cf-text">
                      {text.title}
                    </h3>

                    <p className="mb-8 mt-2 text-[15px] leading-relaxed text-cf-muted">
                      {text.description}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-cf-accent">
                      {text.buttonLabel}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
};
