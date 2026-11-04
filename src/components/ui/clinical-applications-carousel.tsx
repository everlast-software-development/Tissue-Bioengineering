import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ClinicalApplication } from '@/data/clinicalApplications';

interface ClinicalApplicationsCarouselProps {
  applications: ClinicalApplication[];
}

export const ClinicalApplicationsCarousel: React.FC<ClinicalApplicationsCarouselProps> = ({ applications }) => {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create an array that loops the applications twice to give the illusion of infinite scrolling.
  // Actually, we need it wide enough. Duplicating twice or thrice ensures a continuous stream.
  const infiniteApps = [...applications, ...applications, ...applications];

  // Using standard CSS animation for smoother performance and native pause-on-hover capability.
  return (
    <div className="relative w-full overflow-hidden py-10" aria-label="Clinical Applications Carousel">
      <style>
        {`
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% / 3)); }
          }
          
          .carousel-track {
            display: flex;
            width: fit-content;
            /* Will animate the width of exactly one original array length */
            animation: infinite-scroll 45s linear infinite;
          }
          
          .carousel-track:hover,
          .carousel-track:focus-within {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .carousel-track {
              animation: none;
              overflow-x: auto;
              scroll-snap-type: x mandatory;
            }
            .carousel-card {
              scroll-snap-align: center;
            }
          }
        `}
      </style>

      {/* 
        We use a wrapper to apply the animation or fallback to normal scroll on reduced motion 
      */}
      <div 
        ref={containerRef}
        className="carousel-track gap-6 px-4 md:px-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {infiniteApps.map((app, idx) => (
          <div 
            key={`${app.id}-${idx}`} 
            className="carousel-card flex-none w-[320px] md:w-[400px] h-[550px] md:h-[600px] py-4"
          >
            <motion.div
              whileHover={!prefersReducedMotion ? { y: -8 } : {}}
              className="group relative h-full flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-hover"
            >
              {/* Image Section (45-50%) */}
              <div className="relative h-[45%] w-full overflow-hidden bg-gray-50">
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay z-10" />
                <motion.img
                  src={app.imageSrc}
                  alt={app.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-grow p-6 md:p-8 bg-white">
                <div className="text-[10px] md:text-xs font-semibold tracking-widest text-[#075A9C] uppercase mb-3 flex items-center">
                  <span className="mr-1">[</span> {app.label} <span className="ml-1">]</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 leading-snug line-clamp-2">
                  {app.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                  {app.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    {app.duration}
                  </span>
                  
                  <Link 
                    to={app.href}
                    className="inline-flex items-center text-sm font-semibold text-[#1677C8] group/link"
                  >
                    Read More
                    <ArrowRight className="ml-1.5 w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};
