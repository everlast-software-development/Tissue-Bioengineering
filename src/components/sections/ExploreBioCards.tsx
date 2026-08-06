import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical, Microscope, BookOpen, Building2 } from 'lucide-react';
import { LoaderHelix } from '@/components/ui/loader-helix';

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

/* ─── Horizontal DNA Helix Background ─────────────────────── */
const HELIX_STRANDS = [
  { dots: 60, speed: 3.5, y: '18%', variant: 'dna' as const, opacity: 0.30, scale: 2.8 },
  { dots: 50, speed: 4.2, y: '45%', variant: 'dna' as const, opacity: 0.18, scale: 3.2 },
  { dots: 55, speed: 3.0, y: '72%', variant: 'dna' as const, opacity: 0.22, scale: 2.5 },
  { dots: 40, speed: 5.0, y: '30%', variant: 'ribbon' as const, opacity: 0.12, scale: 2.0 },
  { dots: 45, speed: 4.5, y: '60%', variant: 'ribbon' as const, opacity: 0.10, scale: 2.2 },
];

/* ─── Component ───────────────────────────────────────────── */
export const ExploreBioCards: React.FC = () => {
  return (
    <section
      className="relative w-full overflow-hidden select-none"
      aria-label="Explore Tissue Bioengineering"
      style={{
        background: '#05142D',
      }}
    >
      {/* ── Horizontal DNA Helix Background ──────────────────── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{ transform: 'translateZ(0)' }}
      >
        {HELIX_STRANDS.map((strand, i) => (
          <div
            key={i}
            className="absolute left-1/2"
            style={{
              top: strand.y,
              opacity: strand.opacity,
              /* Rotate 90° to make vertical helix run horizontally */
              transform: `translateX(-50%) rotate(90deg) scale(${strand.scale})`,
              transformOrigin: 'center center',
              willChange: 'transform',
              filter: 'blur(0.5px)',
            }}
          >
            <LoaderHelix
              dots={strand.dots}
              speed={strand.speed}
              variant={strand.variant}
              className="[&_.bg-foreground]:!bg-sky-400 [&_span.bg-foreground\\/20]:!bg-sky-400/20"
            />
          </div>
        ))}

        {/* Soft radial glow accents behind the helixes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 25% 40%, rgba(56, 189, 248, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 75% 60%, rgba(96, 165, 250, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.04) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* ── Dark Overlay for Readability ──────────────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,20,45,0.40) 0%, rgba(5,20,45,0.20) 50%, rgba(5,20,45,0.40) 100%)',
        }}
      />

      {/* ── Top Gradient Fade – seamless merge from Hero ────── */}
      <div
        className="absolute inset-x-0 top-0 h-24 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, #05142D 0%, transparent 100%)',
        }}
      />

      {/* ── Bottom Gradient Fade ────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, #05142D 0%, transparent 100%)',
        }}
      />

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 sm:mb-16"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-sky-400 mb-3">
            Explore Our Institute
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Discover What We Offer
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
            World-class tissue bioengineering services, cutting-edge research, and clinical
            excellence — all under one roof.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-7"
        >
          {CARDS.map((card) => {
            const IconComponent = card.icon;
            return (
              <motion.div key={card.title} variants={cardVariants}>
                <Link
                  to={card.path}
                  className="group relative flex flex-col justify-between h-full rounded-3xl p-8 sm:p-9 transition-all duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow:
                      '0 8px 32px rgba(0, 0, 0, 0.20), 0 2px 8px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.10)',
                    borderRadius: '24px',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(-6px)';
                    el.style.border = '1px solid rgba(96, 165, 250, 0.35)';
                    el.style.boxShadow =
                      '0 20px 48px rgba(59, 130, 246, 0.15), 0 8px 24px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255,255,255,0.15)';
                    el.style.background = 'rgba(255, 255, 255, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(0)';
                    el.style.border = '1px solid rgba(255, 255, 255, 0.12)';
                    el.style.boxShadow =
                      '0 8px 32px rgba(0, 0, 0, 0.20), 0 2px 8px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.10)';
                    el.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/25 flex items-center justify-center mb-6 group-hover:bg-sky-500/25 group-hover:border-sky-400/40 transition-all duration-300">
                    <IconComponent className="w-5 h-5 text-sky-400" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-[22px] font-bold text-white tracking-tight leading-snug mb-2">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300/80 leading-relaxed mb-8">
                    {card.description}
                  </p>

                  {/* Button */}
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white/90 border border-white/20 bg-transparent group-hover:bg-white group-hover:text-[#0B1F3A] group-hover:border-white transition-all duration-300 w-fit mt-auto">
                    {card.buttonLabel}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
