import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/pages/Home/SectionHeader';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  /** Describes what the image shows. */
  imageAlt: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'burn-scar',
    number: '01',
    title: 'Burn Scar Complications',
    description: 'Advanced autologous skin tissue engineering and cellular matrix deposition for complex burn scar reconstruction. Our approach eliminates donor-site morbidity by creating full-thickness skin grafts in 3D bioprinted matrices.',
    ctaText: 'Book Consultation',
    ctaLink: 'https://tissuebioengineering.com/burn-scar-complications-consultation-request/',
    image: '/images/scaffold-bg.webp',
    imageAlt: 'Illustration of a porous biomaterial scaffold with cells and a layered skin surface forming over it',
  },
  {
    id: 'diabetic-foot',
    number: '02',
    title: 'Diabetic Foot',
    description: 'Advanced tissue-engineering approaches designed to support healing in chronic, non-healing diabetic lower-limb ulcers using pro-angiogenic growth factor release.',
    ctaText: 'Learn More',
    ctaLink: '/services#diabetic-foot-ulcer-grafting',
    image: '/images/diabetic-foot-examination.webp',
    imageAlt: 'Physician examining the foot of a patient with diabetes',
  },
  {
    id: 'wound-healing',
    number: '03',
    title: 'Wound Healing',
    description: 'Bio-interactive biomaterial systems engineered to support accelerated acute and trauma wound remodeling with pH-responsive drug release and electrospun nanofiber scaffolding.',
    ctaText: 'Learn More',
    ctaLink: '/services#smart-biomaterial-wound-matrix',
    image: '/images/nanofiber-scaffold-sem.webp',
    imageAlt: 'Scanning electron micrograph of a fiber-based biomaterial scaffold (blue) partly covered by a cultured cell layer (gray)',
  },
  {
    id: 'scar-management',
    number: '04',
    title: 'Scar Management',
    description: 'Advanced regenerative approaches targeting abnormal scar tissue remodeling and fibrotic tissue formation through targeted TGF-beta pathway inhibition.',
    ctaText: 'Learn More',
    ctaLink: '/services#keloid-scar-remodeling',
    image: '/images/keloid-histopathology.webp',
    imageAlt: 'Histology of keloid scar tissue showing thick, disorganized collagen bundles beneath the epidermis',
  },
  {
    id: 'facial-palsy',
    number: '05',
    title: 'Facial Palsy',
    description: 'Advanced nerve-guidance and regenerative strategies designed to support facial nerve reconstruction and muscle re-innervation using conductive nerve guidance conduits.',
    ctaText: 'Learn More',
    ctaLink: '/services#facial-nerve-regeneration',
    image: '/images/peripheral-nerve-fibers.webp',
    imageAlt: 'Light micrograph of teased peripheral nerve fibers',
  },
  {
    id: 'vitiligo',
    number: '06',
    title: 'Vitiligo',
    description: 'Next-generation regenerative approaches using mesenchymal stem-cell and exosome-based technologies to restore pigmentation and cellular balance.',
    ctaText: 'Learn More',
    ctaLink: '/services#stem-cell-exosome-therapy',
    image: '/images/stem-cell-culture-flasks.webp',
    imageAlt: 'Scientist handling cell culture flasks inside a biosafety cabinet',
  },
];

const ServiceRow: React.FC<{
  item: ServiceItem;
  index: number;
}> = ({ item, index }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });

  return (
    <div
      ref={ref}
      className={`relative flex flex-col md:flex-row items-center justify-center w-full min-h-[36vh] my-14 md:my-20 group ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Central node (Desktop/Tablet) */}
      <div className="absolute left-[24px] md:left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={false}
          animate={{
            scale: isInView ? 1.2 : 1,
            backgroundColor: isInView ? '#4FD6E8' : '#0A1019',
            borderColor: isInView ? '#4FD6E8' : '#243246',
            boxShadow: isInView ? '0 0 0 6px rgba(79, 214, 232, 0.14)' : '0 0 0 0px rgba(79, 214, 232, 0)',
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-4 h-4 md:w-[18px] md:h-[18px] rounded-full border-2 z-10"
        />
        {/* Connection rung */}
        <motion.div
          animate={{
            opacity: isInView ? 1 : 0.3,
            width: isInView ? '40px' : '20px',
          }}
          className="absolute h-px bg-cf-accent/50 -z-10"
        />
      </div>

      {/* Content Area */}
      <div className={`w-full md:w-1/2 flex pl-16 pr-4 md:px-12 lg:px-20 ${isEven ? 'md:justify-end text-left md:text-right' : 'md:justify-start text-left'}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          animate={{ opacity: isInView ? 1 : 0.4, x: isInView ? 0 : (isEven ? -10 : 10) }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`max-w-md ${isInView ? 'grayscale-0' : 'grayscale-[40%]'}`}
        >
          <span className="inline-block font-geist-mono text-[13px] text-cf-accent mb-3">
            {item.number}
          </span>
          <h3 className="text-[26px] sm:text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-cf-text mb-4">
            {item.title}
          </h3>
          <p className="text-cf-text-2 text-[15px] sm:text-base leading-relaxed mb-7">
            {item.description}
          </p>
          <Link to={item.ctaLink} className="cf-btn cf-btn-outline-accent min-h-11 px-5 text-sm">
            {item.ctaText}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>

      {/* Media Area */}
      <div className={`w-full md:w-1/2 flex pl-16 pr-4 md:px-12 lg:px-20 mt-8 md:mt-0 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: isEven ? 30 : -30 }}
          animate={{
            opacity: isInView ? 1 : 0.5,
            scale: isInView ? 1 : 0.98,
            x: isInView ? 0 : (isEven ? 10 : -10)
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full max-w-[440px] aspect-[4/3] rounded-xl overflow-hidden border border-cf-line bg-cf-panel group"
        >
          <img
            src={item.image}
            alt={item.imageAlt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cf-bg/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-cf-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
      </div>
    </div>
  );
};

export const CoreServicesTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      className="relative w-full bg-cf-raised border-y border-cf-line pt-14 pb-6 sm:pt-24 lg:pt-32 lg:pb-12 overflow-hidden"
      aria-labelledby="core-services-heading"
    >
      <div className="cf-container relative z-10">
        <SectionHeader
          id="core-services-heading"
          eyebrow="Medical Innovation"
          title="Our Core Services"
          subtitle="Pioneering regenerative treatments across the spectrum of complex tissue reconstruction and aesthetic restoration."
          className="mb-4 sm:mb-6 lg:mb-8"
        />
      </div>

      <div className="relative max-w-7xl mx-auto" ref={containerRef}>
        {/* The vertical line */}
        <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-px bg-cf-line-strong transform -translate-x-1/2 hidden sm:block">
          {/* Progress fill: blue → cyan as the reader moves down the list */}
          <motion.div
            className="absolute top-0 w-full bg-gradient-to-b from-cf-blue via-cf-cyan-2 to-cf-accent"
            style={{ height: lineHeight }}
          />

          {/* Decorative SVG DNA strand wrapped around the line (Visible on Desktop) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-full pointer-events-none hidden md:block overflow-hidden opacity-25">
             <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 80 1000" fill="none" strokeWidth="1.5">
               {/* Base Pair Connections (Rungs) */}
               {Array.from({ length: 40 }).map((_, i) => (
                 <line
                   key={`rung-${i}`}
                   x1="40"
                   y1={i * 25 + 12.5}
                   x2={40 + Math.sin(i * Math.PI / 4) * 20}
                   y2={i * 25 + 12.5}
                   stroke="currentColor"
                   className="text-cf-muted/40"
                   strokeWidth="1"
                 />
               ))}
               {/* Strand 1 */}
               <path d="M 40 0 Q 80 50 40 100 T 40 200 T 40 300 T 40 400 T 40 500 T 40 600 T 40 700 T 40 800 T 40 900 T 40 1000" stroke="currentColor" className="text-cf-blue" />
               {/* Strand 2 */}
               <path d="M 40 0 Q 0 50 40 100 T 40 200 T 40 300 T 40 400 T 40 500 T 40 600 T 40 700 T 40 800 T 40 900 T 40 1000" stroke="currentColor" className="text-cf-accent" />
               {/* Molecular Nodes */}
               {Array.from({ length: 20 }).map((_, i) => (
                 <g key={`nodes-${i}`}>
                   <circle cx={40 + Math.sin((i*2) * Math.PI / 4) * 20} cy={(i*2) * 25} r="2" className="fill-cf-blue" />
                   <circle cx={40 + Math.sin(((i*2)+2) * Math.PI / 4) * -20} cy={(i*2) * 25} r="2" className="fill-cf-accent" />
                 </g>
               ))}
             </svg>
          </div>
        </div>

        {/* Mobile line (since SVG above is hidden on mobile) */}
        <div className="absolute left-[24px] top-0 bottom-0 w-px -translate-x-1/2 bg-cf-line-strong sm:hidden">
          <motion.div
            className="absolute top-0 w-full bg-gradient-to-b from-cf-blue to-cf-accent"
            style={{ height: lineHeight }}
          />
        </div>

        <div className="relative z-10 py-6 sm:py-10">
          {SERVICES.map((item, index) => (
            <ServiceRow key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
