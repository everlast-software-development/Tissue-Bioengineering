import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Link } from '@/i18n/Link';
import { useI18n, useMessages } from '@/i18n/context';
import { homeMessages } from './messages';

type ServiceId = keyof (typeof homeMessages)['en']['coreServices']['items'];

/** Row structure; title, description, button label and alt text are in ./messages.ts by id. */
interface ServiceItem {
  id: ServiceId;
  number: string;
  ctaLink: string;
  image: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'burn-scar',
    number: '01',
    ctaLink: 'https://tissuebioengineering.com/burn-scar-complications-consultation-request/',
    image: '/images/scaffold-bg.webp',
  },
  {
    id: 'diabetic-foot',
    number: '02',
    ctaLink: '/services#diabetic-foot-ulcer-grafting',
    image: '/images/diabetic-foot-examination.webp',
  },
  {
    id: 'wound-healing',
    number: '03',
    ctaLink: '/services#smart-biomaterial-wound-matrix',
    image: '/images/nanofiber-scaffold-sem.webp',
  },
  {
    id: 'scar-management',
    number: '04',
    ctaLink: '/services#keloid-scar-remodeling',
    image: '/images/keloid-histopathology.webp',
  },
  {
    id: 'facial-palsy',
    number: '05',
    ctaLink: '/services#facial-nerve-regeneration',
    image: '/images/peripheral-nerve-fibers.webp',
  },
  {
    id: 'vitiligo',
    number: '06',
    ctaLink: '/services#stem-cell-exosome-therapy',
    image: '/images/stem-cell-culture-flasks.webp',
  },
];

/*
 * Horizontal positions are logical (start/end, ps/pe), so the timeline mirrors in Arabic: the
 * mobile line sits on the right and even rows put their text on the right half. Elements centred
 * on a point with -translate-x-1/2 flip that translate in RTL (rtl:translate-x-1/2), and the
 * slide-in offsets are multiplied by the reading direction.
 */
const ServiceRow: React.FC<{
  item: ServiceItem;
  index: number;
}> = ({ item, index }) => {
  const { dir } = useI18n();
  const text = useMessages(homeMessages).coreServices.items[item.id];
  /** +1 left-to-right, -1 right-to-left: horizontal motion offsets follow the reading direction. */
  const sign = dir === 'rtl' ? -1 : 1;
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
      <div className="absolute start-[24px] md:start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-20 flex flex-col items-center justify-center pointer-events-none">
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

      {/* Content Area — from md up, padding sits only on the side facing the timeline;
          the outer edge runs to the container boundary. */}
      <div className={`w-full md:w-1/2 flex ps-16 pe-4 ${isEven ? 'md:ps-0 md:pe-12 lg:pe-16 xl:pe-20 md:justify-end text-start md:text-end' : 'md:pe-0 md:ps-12 lg:ps-16 xl:ps-20 md:justify-start text-start'}`}>
        <motion.div
          initial={{ opacity: 0, x: sign * (isEven ? -30 : 30) }}
          animate={{ opacity: isInView ? 1 : 0.4, x: isInView ? 0 : sign * (isEven ? -10 : 10) }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`max-w-md md:max-w-[560px] ${isInView ? 'grayscale-0' : 'grayscale-[40%]'}`}
        >
          <span className="inline-block text-[13px] text-cf-accent mb-3">
            {item.number}
          </span>
          <h3 className="text-[26px] sm:text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-cf-text mb-4">
            {text.title}
          </h3>
          <p className="text-cf-text-2 text-[15px] sm:text-base leading-relaxed mb-7">
            {text.description}
          </p>
          <Link to={item.ctaLink} className="cf-btn cf-btn-outline-accent min-h-11 px-5 text-sm">
            {text.ctaText}
            <ArrowRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>

      {/* Media Area */}
      <div className={`w-full md:w-1/2 flex ps-16 pe-4 mt-8 md:mt-0 ${isEven ? 'md:pe-0 md:ps-12 lg:ps-16 xl:ps-20 md:justify-start' : 'md:ps-0 md:pe-12 lg:pe-16 xl:pe-20 md:justify-end'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: sign * (isEven ? 30 : -30) }}
          animate={{
            opacity: isInView ? 1 : 0.5,
            scale: isInView ? 1 : 0.98,
            x: isInView ? 0 : sign * (isEven ? 10 : -10)
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full max-w-[440px] md:max-w-none aspect-[4/3] rounded-xl overflow-hidden border border-cf-line bg-cf-panel group"
        >
          <img
            src={item.image}
            alt={text.imageAlt}
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
  const t = useMessages(homeMessages).coreServices;
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
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
          className="mb-4 sm:mb-6 lg:mb-8"
        />
      </div>

      {/* From md up this matches .cf-container (1320px content + 32/56px gutters) so the rows
          align with the header above. Below md the gutter stays at 0: the mobile line and
          nodes are positioned from the wrapper edge (start-[24px]). */}
      <div className="relative mx-auto w-full max-w-[calc(1320px+7rem)] md:px-8 lg:px-14" ref={containerRef}>
        {/* The vertical line */}
        <div className="absolute start-[24px] md:start-1/2 top-0 bottom-0 w-px bg-cf-line-strong -translate-x-1/2 rtl:translate-x-1/2 hidden sm:block">
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
        <div className="absolute start-[24px] top-0 bottom-0 w-px -translate-x-1/2 rtl:translate-x-1/2 bg-cf-line-strong sm:hidden">
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
