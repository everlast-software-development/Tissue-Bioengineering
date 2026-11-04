import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { InfiniteSlider } from '@/components/ui/infinite-slider';

interface ClinicalCase {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  duration: string;
  image: string;
  alt: string;
}

const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case-1',
    slug: 'burn-scar-bio-reconstruction',
    title: 'Advanced Burn Scar Bio-Reconstruction',
    category: 'Burn Scar Treatment',
    description: 'Autologous skin tissue engineering and cellular matrix deposition for complex burn scar reconstruction.',
    technologies: ['Autologous cell seeding', '3D extracellular matrix synthesis'],
    duration: '3 - 6 Weeks',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    alt: 'Microbiology culture and autologous skin cells for burn scar tissue bioengineering',
  },
  {
    id: 'case-2',
    slug: 'diabetic-foot-ulcer-grafting',
    title: 'Diabetic Foot Ulcer Tissue Grafting',
    category: 'Diabetic Foot',
    description: 'Advanced tissue-engineering approaches designed to support healing in chronic, non-healing diabetic lower-limb ulcers.',
    technologies: ['Pro-angiogenic growth factor release', 'ADSC cell matrix infusion'],
    duration: '2 - 4 Weeks',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    alt: 'Sterile surgical instrumentation for diabetic foot ulcer tissue grafting',
  },
  {
    id: 'case-3',
    slug: 'smart-biomaterial-wound-matrix',
    title: 'Smart Biomaterial Wound Matrix',
    category: 'Wound Healing',
    description: 'Bio-interactive biomaterial systems engineered to support accelerated acute and trauma wound remodeling.',
    technologies: ['pH-responsive drug release', 'Electrospun nanofiber scaffolding'],
    duration: '1 - 3 Weeks',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    alt: 'Bio-interactive clinical material research in medical biotechnology laboratory',
  },
  {
    id: 'case-4',
    slug: 'keloid-scar-remodeling',
    title: 'Keloid & Hypertrophic Scar Remodeling',
    category: 'Scar Management',
    description: 'Advanced regenerative approaches targeting abnormal scar tissue remodeling and fibrotic tissue formation.',
    technologies: ['Targeted TGF-beta pathway inhibition', 'Enzymatic collagen degradation'],
    duration: '4 - 8 Sessions',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f111818e?auto=format&fit=crop&w=800&q=80',
    alt: 'Clinical dermatologist examining patient skin for hypertrophic scar remodeling',
  },
  {
    id: 'case-5',
    slug: 'facial-nerve-regeneration',
    title: 'Bio-Engineered Facial Nerve Regeneration',
    category: 'Facial Palsy',
    description: 'Advanced nerve-guidance and regenerative strategies designed to support facial nerve reconstruction and muscle re-innervation.',
    technologies: ['Conductive nerve guidance conduits', 'Schwann cell supportive matrix'],
    duration: 'Surgical Placement + 6 Months Therapy',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    alt: 'Clinical consultation discussing facial nerve regeneration therapy options',
  },
  {
    id: 'case-6',
    slug: 'craniofacial-osteo-grafts',
    title: '3D Bioprinted Craniofacial Osteo-Grafts',
    category: 'Facial Asymmetry',
    description: 'Custom anatomical 3D bio-engineered constructs designed for craniofacial contour and tissue reconstruction.',
    technologies: ['CT-scan accurate 3D CAD modeling', 'Biphasic bone and cartilage bioprinting'],
    duration: 'Single Surgical Grafting',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    alt: 'Advanced medical diagnostics imaging computer indicating bone structures for craniofacial grafts',
  },
  {
    id: 'case-7',
    slug: 'stem-cell-exosome-therapy',
    title: 'Systemic Stem Cell & Exosome Therapy',
    category: 'Regenerative Medicine',
    description: 'Next-generation regenerative approaches using mesenchymal stem-cell and exosome-based technologies.',
    technologies: ['High-purity umbilical cord MSC exosomes', 'Immune-evasive cellular formulations'],
    duration: 'Outpatient Infusion Protocol',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    alt: 'Clinical team preparing high-purity exosome formulations for regenerative infusion',
  },
  {
    id: 'case-8',
    slug: 'bioprinted-skin-reconstruction',
    title: '3D Bioprinted Skin Reconstruction',
    category: 'Tissue Engineering',
    description: 'Advanced 3D bioprinting approaches for engineering skin-equivalent tissue structures for complex tissue reconstruction.',
    technologies: ['3D bioprinted skin scaffolds', 'Bioactive cellular matrices'],
    duration: 'Custom Treatment Protocol',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
    alt: 'Medical laboratory researcher preparing bioprinted skin equivalent cell cultures',
  },
  {
    id: 'case-9',
    slug: 'facial-tissue-regeneration',
    title: 'Advanced Facial Tissue Regeneration',
    category: 'Facial Reconstruction',
    description: 'Precision tissue-engineering strategies designed for complex facial tissue defects, asymmetry, and regenerative reconstruction.',
    technologies: ['Customized biomaterial scaffolds', 'Cell-based tissue regeneration'],
    duration: 'Custom Treatment Protocol',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    alt: 'Clinical case study review and team discussion for advanced facial tissue regeneration',
  },
];

export const ServicesOverview: React.FC = () => {
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
      className="py-24 relative overflow-hidden bg-[#FDFCF7] border-t border-b border-[#FAF8F2]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <SectionTitle
          badge="Clinical Applications"
          title="Advanced Regenerative Therapies"
          subtitle="Precision bio-engineering solutions for complex wounds, tissue regeneration, facial reconstruction, scar remodeling, and advanced regenerative medicine."
        />
      </div>

      {/* Infinite Horizontal Carousel Strip */}
      <div className="w-full relative z-10 pointer-events-auto">
        <InfiniteSlider
          gap={24}
          duration={prefersReducedMotion ? 999999 : 38}
          durationOnHover={prefersReducedMotion ? 999999 : 500}
          className="py-4"
        >
          {CLINICAL_CASES.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white border border-[#E5E7EB]/60 rounded-[24px] p-6 shadow-xs hover:shadow-lg transition-shadow duration-500 flex flex-col justify-between h-[490px] w-[320px] sm:w-[360px] shrink-0 select-none group"
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div>
                {/* Clinical Image */}
                <div className="relative overflow-hidden rounded-[18px] mb-5 h-44 bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0B1F3A]/45 via-transparent to-transparent opacity-80" />
                </div>

                {/* Category Label */}
                <span className="text-[10px] font-bold tracking-wider text-[#3B5B8A] uppercase bg-[#DCEEFF]/65 px-3 py-1 rounded-md inline-block mb-3 border border-[#3B5B8A]/10">
                  {item.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#0B1F3A] leading-snug line-clamp-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Key Technologies */}
                <ul className="mt-4 pt-4 border-t border-slate-100/70 space-y-2">
                  {item.technologies.map((tech, idx) => (
                    <li key={idx} className="flex items-center text-xs text-slate-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B5B8A] mr-2 shrink-0 opacity-80" />
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer with Duration & CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100/70 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#3B5B8A]/70" />
                  <span>
                    Duration: <strong className="text-[#0B1F3A] font-semibold">{item.duration}</strong>
                  </span>
                </div>
                <Link
                  to={`/services#${item.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0B1F3A] group-hover:text-[#3B5B8A] transition-colors"
                >
                  Explore Therapy
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
};
