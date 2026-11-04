import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  isVideoPreview?: boolean;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'burn-scar',
    number: '01',
    title: 'Burn Scar Complications',
    description: 'Advanced autologous skin tissue engineering and cellular matrix deposition for complex burn scar reconstruction. Our approach eliminates donor-site morbidity by creating full-thickness skin grafts in 3D bioprinted matrices.',
    ctaText: 'Book Consultation',
    ctaLink: 'https://tissuebioengineering.com/burn-scar-complications-consultation-request/',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    isVideoPreview: true,
  },
  {
    id: 'diabetic-foot',
    number: '02',
    title: 'Diabetic Foot',
    description: 'Advanced tissue-engineering approaches designed to support healing in chronic, non-healing diabetic lower-limb ulcers using pro-angiogenic growth factor release.',
    ctaText: 'Learn More',
    ctaLink: '/services#diabetic-foot-ulcer-grafting',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'wound-healing',
    number: '03',
    title: 'Wound Healing',
    description: 'Bio-interactive biomaterial systems engineered to support accelerated acute and trauma wound remodeling with pH-responsive drug release and electrospun nanofiber scaffolding.',
    ctaText: 'Learn More',
    ctaLink: '/services#smart-biomaterial-wound-matrix',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    isVideoPreview: true,
  },
  {
    id: 'scar-management',
    number: '04',
    title: 'Scar Management',
    description: 'Advanced regenerative approaches targeting abnormal scar tissue remodeling and fibrotic tissue formation through targeted TGF-beta pathway inhibition.',
    ctaText: 'Learn More',
    ctaLink: '/services#keloid-scar-remodeling',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f111818e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'facial-palsy',
    number: '05',
    title: 'Facial Palsy',
    description: 'Advanced nerve-guidance and regenerative strategies designed to support facial nerve reconstruction and muscle re-innervation using conductive nerve guidance conduits.',
    ctaText: 'Learn More',
    ctaLink: '/services#facial-nerve-regeneration',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    isVideoPreview: true,
  },
  {
    id: 'vitiligo',
    number: '06',
    title: 'Vitiligo',
    description: 'Next-generation regenerative approaches using mesenchymal stem-cell and exosome-based technologies to restore pigmentation and cellular balance.',
    ctaText: 'Learn More',
    ctaLink: '/services#stem-cell-exosome-therapy',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
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
      className={`relative flex flex-col md:flex-row items-center justify-center w-full min-h-[40vh] my-16 md:my-24 group ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Central DNA Node (Desktop/Tablet) */}
      <div className="absolute left-[24px] md:left-1/2 transform md:-translate-x-1/2 z-20 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={false}
          animate={{
            scale: isInView ? 1.3 : 1,
            backgroundColor: isInView ? '#3b82f6' : '#eff6ff',
            borderColor: isInView ? '#60a5fa' : '#bfdbfe',
            boxShadow: isInView ? '0 0 20px 4px rgba(59, 130, 246, 0.4)' : '0 0 0px 0px rgba(59, 130, 246, 0)',
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-4 h-4 md:w-5 md:h-5 rounded-full border-[3px] z-10 transition-colors duration-500"
        />
        {/* Abstract Rung/Connection */}
        <motion.div
          animate={{
            opacity: isInView ? 1 : 0.3,
            width: isInView ? '40px' : '20px',
          }}
          className="absolute h-[2px] bg-blue-400/50 -z-10"
        />
      </div>

      {/* Content Area */}
      <div className={`w-full md:w-1/2 flex pl-16 pr-4 md:px-12 lg:px-24 ${isEven ? 'md:justify-end text-left md:text-right' : 'md:justify-start text-left'}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          animate={{ opacity: isInView ? 1 : 0.4, x: isInView ? 0 : (isEven ? -10 : 10) }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`max-w-md ${isInView ? 'grayscale-0' : 'grayscale-[40%]'}`}
        >
          <span className="inline-block text-sm font-black text-blue-300/80 mb-2 tracking-widest font-mono">
            {item.number}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] tracking-tight mb-4">
            {item.title}
          </h3>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6">
            {item.description}
          </p>
          <Link to={item.ctaLink}>
            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300">
              {item.ctaText}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Media Area */}
      <div className={`w-full md:w-1/2 flex pl-16 pr-4 md:px-12 lg:px-24 mt-8 md:mt-0 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: isEven ? 30 : -30 }}
          animate={{
            opacity: isInView ? 1 : 0.5,
            scale: isInView ? 1 : 0.98,
            x: isInView ? 0 : (isEven ? 10 : -10)
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full max-w-[400px] aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-blue-100/50 group"
        >
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/40 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {item.isVideoPreview && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-600/30">
                <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          )}
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
    <section className="relative w-full bg-[#F5F9FC] py-24 sm:py-32 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10 text-center">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600 mb-3">
          Medical Innovation
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1F3A] tracking-tight leading-tight">
          Our Core Services
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Pioneering regenerative treatments across the spectrum of complex tissue reconstruction and aesthetic restoration.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto" ref={containerRef}>
        {/* The Vertical DNA Line */}
        <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-blue-100 transform md:-translate-x-1/2 hidden sm:block">
          {/* Animated Active Line */}
          <motion.div
            className="absolute top-0 w-full bg-gradient-to-b from-blue-300 via-blue-500 to-cyan-400 rounded-full"
            style={{ height: lineHeight, filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))' }}
          />
          
          {/* Decorative SVG DNA strand wrapped around the line (Visible on Desktop) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-full pointer-events-none hidden md:block overflow-hidden opacity-30">
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
                   className="text-blue-300/40" 
                   strokeWidth="1"
                 />
               ))}
               {/* Strand 1 */}
               <path d="M 40 0 Q 80 50 40 100 T 40 200 T 40 300 T 40 400 T 40 500 T 40 600 T 40 700 T 40 800 T 40 900 T 40 1000" stroke="currentColor" className="text-blue-600" />
               {/* Strand 2 */}
               <path d="M 40 0 Q 0 50 40 100 T 40 200 T 40 300 T 40 400 T 40 500 T 40 600 T 40 700 T 40 800 T 40 900 T 40 1000" stroke="currentColor" className="text-cyan-400" />
               {/* Molecular Nodes */}
               {Array.from({ length: 20 }).map((_, i) => (
                 <g key={`nodes-${i}`}>
                   <circle cx={40 + Math.sin((i*2) * Math.PI / 4) * 20} cy={(i*2) * 25} r="2" className="fill-blue-500" />
                   <circle cx={40 + Math.sin(((i*2)+2) * Math.PI / 4) * -20} cy={(i*2) * 25} r="2" className="fill-cyan-400" />
                 </g>
               ))}
             </svg>
          </div>
        </div>

        {/* Mobile line (since SVG above is hidden on mobile) */}
        <div className="absolute left-[31px] top-0 bottom-0 w-[2px] bg-blue-100 sm:hidden">
          <motion.div
            className="absolute top-0 w-full bg-gradient-to-b from-blue-400 to-cyan-400"
            style={{ height: lineHeight }}
          />
        </div>

        <div className="relative z-10 py-10">
          {SERVICES.map((item, index) => (
            <ServiceRow key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
