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

/* ─── Horizontal DNA Helix Strand Configurations (deeper blues for light bg) */
const HELIX_STRANDS = [
  { dots: 80, speed: 4.0, top: '15%', variant: 'dna' as const, opacity: 0.12, color: '#1d4ed8' },
  { dots: 70, speed: 5.0, top: '50%', variant: 'dna' as const, opacity: 0.08, color: '#2563eb' },
  { dots: 75, speed: 3.5, top: '80%', variant: 'dna' as const, opacity: 0.10, color: '#3b82f6' },
  { dots: 50, speed: 6.0, top: '32%', variant: 'ribbon' as const, opacity: 0.06, color: '#60a5fa' },
  { dots: 55, speed: 5.5, top: '68%', variant: 'ribbon' as const, opacity: 0.05, color: '#93c5fd' },
];

/* ─── Component ───────────────────────────────────────────── */
export const ExploreBioCards: React.FC = () => {
  return (
    <section
      className="relative w-full overflow-hidden select-none"
      aria-label="Explore Tissue Bioengineering"
      style={{
        background: 'linear-gradient(180deg, #F5F9FC 0%, #F8FBFF 40%, #EFF6FF 100%)',
      }}
    >

      {/* ── Layer 1: Horizontal DNA Helix Particle Overlays ───── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none overflow-hidden"
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
              rungColor={`${strand.color}20`}
            />
          </div>
        ))}
      </div>

      {/* ── Layer 2: Subtle Light Overlay for Readability ─────── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, rgba(245, 249, 252, 0.20) 0%, rgba(248, 251, 255, 0.10) 50%, rgba(245, 249, 252, 0.20) 100%)',
        }}
      />

      {/* ── Layer 3: Subtle Radial Glow Accents (light mode) ──── */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 25% 40%, rgba(37, 99, 235, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 75% 55%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(96, 165, 250, 0.03) 0%, transparent 55%)',
        }}
      />

      {/* ── Top Gradient Fade – seamless merge from Hero ────── */}
      <div
        className="absolute inset-x-0 top-0 h-28 z-[4] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, #F5F9FC 0%, transparent 100%)',
        }}
      />

      {/* ── Bottom Gradient Fade ────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 z-[4] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, #EFF6FF 0%, transparent 100%)',
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
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600 mb-3">
            Explore Our Institute
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Discover What We Offer
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
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
                  className="group relative flex flex-col justify-between h-full rounded-3xl p-8 sm:p-9 transition-all duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  style={{
                    background: 'rgba(255, 255, 255, 0.80)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(30, 64, 175, 0.08)',
                    boxShadow:
                      '0 4px 24px rgba(30, 64, 175, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.90)',
                    borderRadius: '24px',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(-6px)';
                    el.style.border = '1px solid rgba(37, 99, 235, 0.20)';
                    el.style.boxShadow =
                      '0 20px 48px rgba(37, 99, 235, 0.10), 0 8px 24px rgba(30, 64, 175, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.95)';
                    el.style.background = 'rgba(255, 255, 255, 0.92)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(0)';
                    el.style.border = '1px solid rgba(30, 64, 175, 0.08)';
                    el.style.boxShadow =
                      '0 4px 24px rgba(30, 64, 175, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.90)';
                    el.style.background = 'rgba(255, 255, 255, 0.80)';
                  }}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/50 flex items-center justify-center mb-6 group-hover:bg-blue-100 group-hover:border-blue-300/60 transition-all duration-300">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-snug mb-2">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 leading-relaxed mb-8">
                    {card.description}
                  </p>

                  {/* Button */}
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-blue-700 border border-blue-200/60 bg-blue-50/50 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 w-fit mt-auto">
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
