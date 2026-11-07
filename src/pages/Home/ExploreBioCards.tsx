import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical, Microscope, BookOpen, Building2 } from 'lucide-react';
import { LoaderHelix } from './LoaderHelix';
import { SectionHeader } from './SectionHeader';

/* ─── Card Data ───────────────────────────────────────────── */
const CARDS = [
  {
    title: 'Core Services',
    description: 'Empowering Solutions for Your Success.',
    buttonLabel: 'Explore Services',
    path: '/services',
    icon: FlaskConical,
  },
  {
    title: 'Our Researches',
    description: 'Innovative Research Driving Tomorrow\'s Solutions.',
    buttonLabel: 'Explore Research',
    path: '/research',
    icon: Microscope,
  },
  {
    title: 'Explore Articles',
    description: 'Discover Insights, Expand Knowledge.',
    buttonLabel: 'Read Articles',
    path: '/articles',
    icon: BookOpen,
  },
  {
    title: 'About Tissue Bioengineering',
    description: 'Dermatological and Anti-Aging Specialists.',
    buttonLabel: 'Learn More',
    path: '/about',
    icon: Building2,
  },
];

/* ─── Animation Variants ─────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Horizontal DNA Helix Strand Configurations (fluorescence channel colors on dark) */
const HELIX_STRANDS = [
  { dots: 80, speed: 4.0, top: '15%', variant: 'dna' as const, opacity: 0.16, color: '#4FD6E8' },
  { dots: 70, speed: 5.0, top: '50%', variant: 'dna' as const, opacity: 0.1, color: '#6E8BFF' },
  { dots: 75, speed: 3.5, top: '80%', variant: 'dna' as const, opacity: 0.12, color: '#5BB3F2' },
  { dots: 50, speed: 6.0, top: '32%', variant: 'ribbon' as const, opacity: 0.08, color: '#4FD6E8' },
  { dots: 55, speed: 5.5, top: '68%', variant: 'ribbon' as const, opacity: 0.07, color: '#6E8BFF' },
];

/**
 * The helix strands are ~550 individually animated elements, each its own compositor layer.
 * Left rendering, they cost a main-thread style pass every frame anywhere on the page and keep
 * ~1000 layers alive while the neighbouring sections scroll. While the section is off screen,
 * mark it so index.css can skip rendering the helix layer (content-visibility: hidden). The
 * animations stay on the document timeline, so they reappear in phase, without restarting.
 */
function useHelixOffscreen(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => el.toggleAttribute('data-helix-offscreen', !entry.isIntersecting),
      { rootMargin: '100px 0px' } // render again just before it scrolls into view
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

/* ─── Component ───────────────────────────────────────────── */
export const ExploreBioCards: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useHelixOffscreen(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full select-none overflow-hidden bg-cf-bg"
      aria-label="Explore Tissue Bioengineering"
    >
      {/* ── Layer 1: Horizontal DNA Helix Particle Overlays ───── */}
      <div
        className="explore-helix pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden="true"
        style={{ transform: 'translateZ(0)' }}
      >
        {HELIX_STRANDS.map((strand, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: strand.top,
              left: '50%',
              opacity: strand.opacity,
              transform: 'translateX(-50%) rotate(90deg) scale(3)',
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          >
            <LoaderHelix
              dots={strand.dots}
              speed={strand.speed}
              variant={strand.variant}
              dotColor={strand.color}
              rungColor={`${strand.color}30`}
            />
          </div>
        ))}
      </div>

      {/* ── Layer 2: edge fades so the helix settles into the page canvas ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,#060A10_0%,rgba(6,10,16,0.55)_30%,rgba(6,10,16,0.55)_70%,#060A10_100%)]"
        aria-hidden="true"
      />

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="cf-container cf-section relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            eyebrow="Explore Our Institute"
            title="Discover What We Offer"
            subtitle="World-class tissue bioengineering services, cutting-edge research, and clinical excellence — all under one roof."
          />
        </motion.div>

        {/* Ruled index: the hairlines are the 1px gaps showing the line color behind the cells. */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-cf-line bg-cf-line sm:grid-cols-2 xl:grid-cols-4"
        >
          {CARDS.map((card) => {
            const IconComponent = card.icon;
            return (
              <li key={card.title} className="bg-cf-bg">
                <motion.div variants={cardVariants} className="h-full">
                  <Link
                    to={card.path}
                    className="group flex h-full min-h-[240px] flex-col p-7 transition-colors duration-300 hover:bg-cf-active focus:outline-none focus-visible:bg-cf-active focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cf-accent sm:min-h-[280px] sm:p-8"
                  >
                    <span className="mb-10 flex h-11 w-11 items-center justify-center rounded-lg border border-cf-line-strong text-cf-accent transition-colors duration-300 group-hover:border-cf-accent/60">
                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <h3 className="text-[21px] font-semibold leading-snug tracking-[-0.015em] text-cf-text">
                      {card.title}
                    </h3>

                    <p className="mb-8 mt-2 text-[15px] leading-relaxed text-cf-muted">
                      {card.description}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-cf-accent">
                      {card.buttonLabel}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
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
