import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ArrowRight, Dna } from 'lucide-react';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const MARQUEE_ITEMS = [
  'Skin Regeneration',
  'Biomaterial Scaffolds',
  'Stem Cell Therapy',
  '3D Bioprinting',
  'Cartilage Repair',
  'Bone Regeneration',
  'Burn Reconstruction',
  'Chronic Wound Healing',
  'Facial Tissue Engineering',
  'Personalized Regenerative Medicine',
  'Extracellular Matrix (ECM)',
  'Collagen Engineering',
  'Advanced Biomaterials',
  'Tissue Engineering',
];

export const Hero: React.FC = () => {
  const marqueeList = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className="relative min-h-screen h-screen flex flex-col justify-between overflow-hidden bg-[#05142D] text-white select-none">
      {/* Full-bleed DNA Video Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
          src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477"
        />
      </div>

      {/* Dark Navy Glassmorphic Radial Overlay (rgba(5,20,45,0.55)) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 45% 45%, rgba(5, 20, 45, 0.45) 0%, rgba(5, 20, 45, 0.72) 65%, rgba(5, 20, 45, 0.92) 100%)',
        }}
      />

      {/* Main Hero Left-Aligned Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-28 sm:pt-36 pb-12 pointer-events-none">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-left max-w-[700px] space-y-6 pointer-events-auto"
        >
          {/* Main Heading - 2 Lines, Very Large Bold Typography */}
          <motion.h1
            variants={fadeIn}
            className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[0.92] drop-shadow-xl max-w-[700px]"
          >
            TISSUE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-300">
              BIOENGINEERING
            </span>
          </motion.h1>

          {/* Hero Description Paragraph */}
          <motion.p
            variants={fadeIn}
            className="text-base sm:text-lg lg:text-xl text-slate-200/90 max-w-[600px] leading-relaxed font-normal pt-1 drop-shadow-sm"
          >
            Advancing regenerative medicine through tissue engineering, biomaterials, stem cell
            technologies, and personalized regenerative therapies.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3"
          >
            {/* Primary Button: Explore Research → */}
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/research">
                <Button
                  size="lg"
                  variant="primary"
                  className="bg-white text-navy hover:bg-sky-100 font-bold shadow-2xl border border-white text-base px-8 py-3.5 rounded-full flex items-center justify-center gap-3 transition-all duration-300 w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-5 h-5 text-navy" />}
                >
                  Explore Research
                </Button>
              </Link>
            </motion.div>

            {/* Secondary Button: Our Services */}
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-navy-footer/60 border-2 border-white/70 text-white hover:bg-white/20 hover:border-white font-semibold backdrop-blur-md text-base px-8 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all duration-300 w-full sm:w-auto"
                  leftIcon={<Dna className="w-5 h-5 text-sky-300" />}
                >
                  Our Services
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Infinite Scrolling Marquee – seamlessly blended into Hero */}
      <div className="relative z-20 w-full mt-auto pointer-events-none">
        {/* Top gradient fade – blends ticker into Hero background */}
        <div
          className="absolute inset-x-0 top-0 h-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(5, 20, 45, 0.35) 100%)',
          }}
        />
        <div
          className="w-full overflow-hidden py-5 px-4 sm:px-6 lg:px-8"
          style={{
            background: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            className="flex shrink-0 items-center gap-8 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 35,
            }}
            style={{ willChange: 'transform' }}
          >
            {marqueeList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-8">
                <span className="text-xs sm:text-sm font-medium tracking-wider text-white/80 uppercase select-none">
                  {item}
                </span>
                <span className="text-sky-300/50 text-[10px] select-none">◆</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
