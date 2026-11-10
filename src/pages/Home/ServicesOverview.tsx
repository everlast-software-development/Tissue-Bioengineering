import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
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
    image: '/images/bioprinted-tissue-well-plate.webp',
    alt: '3D bioprinted tissue constructs in a 12-well transwell culture plate',
  },
  {
    id: 'case-2',
    slug: 'diabetic-foot-ulcer-grafting',
    title: 'Diabetic Foot Ulcer Tissue Grafting',
    category: 'Diabetic Foot',
    description: 'Advanced tissue-engineering approaches designed to support healing in chronic, non-healing diabetic lower-limb ulcers.',
    technologies: ['Pro-angiogenic growth factor release', 'ADSC cell matrix infusion'],
    duration: '2 - 4 Weeks',
    image: '/images/diabetic-foot-examination.webp',
    alt: 'Physician examining the foot of a patient with diabetes',
  },
  {
    id: 'case-3',
    slug: 'smart-biomaterial-wound-matrix',
    title: 'Smart Biomaterial Wound Matrix',
    category: 'Wound Healing',
    description: 'Bio-interactive biomaterial systems engineered to support accelerated acute and trauma wound remodeling.',
    technologies: ['pH-responsive drug release', 'Electrospun nanofiber scaffolding'],
    duration: '1 - 3 Weeks',
    image: '/images/nanofiber-scaffold-sem.webp',
    alt: 'Scanning electron micrograph of a fiber-based biomaterial scaffold (blue) partly covered by a cultured cell layer (gray)',
  },
  {
    id: 'case-4',
    slug: 'keloid-scar-remodeling',
    title: 'Keloid & Hypertrophic Scar Remodeling',
    category: 'Scar Management',
    description: 'Advanced regenerative approaches targeting abnormal scar tissue remodeling and fibrotic tissue formation.',
    technologies: ['Targeted TGF-beta pathway inhibition', 'Enzymatic collagen degradation'],
    duration: '4 - 8 Sessions',
    image: '/images/keloid-histopathology.webp',
    alt: 'Histology of keloid scar tissue showing thick, disorganized collagen bundles beneath the epidermis',
  },
  {
    id: 'case-5',
    slug: 'facial-nerve-regeneration',
    title: 'Bio-Engineered Facial Nerve Regeneration',
    category: 'Facial Palsy',
    description: 'Advanced nerve-guidance and regenerative strategies designed to support facial nerve reconstruction and muscle re-innervation.',
    technologies: ['Conductive nerve guidance conduits', 'Schwann cell supportive matrix'],
    duration: 'Surgical Placement + 6 Months Therapy',
    image: '/images/peripheral-nerve-fibers.webp',
    alt: 'Light micrograph of teased peripheral nerve fibers',
  },
  {
    id: 'case-6',
    slug: 'craniofacial-osteo-grafts',
    title: '3D Bioprinted Craniofacial Osteo-Grafts',
    category: 'Facial Asymmetry',
    description: 'Custom anatomical 3D bio-engineered constructs designed for craniofacial contour and tissue reconstruction.',
    technologies: ['CT-scan accurate 3D CAD modeling', 'Biphasic bone and cartilage bioprinting'],
    duration: 'Single Surgical Grafting',
    image: '/images/craniofacial-skull-model.webp',
    alt: 'Transparent anatomical skull model showing craniofacial bone structure',
  },
  {
    id: 'case-7',
    slug: 'stem-cell-exosome-therapy',
    title: 'Systemic Stem Cell & Exosome Therapy',
    category: 'Regenerative Medicine',
    description: 'Next-generation regenerative approaches using mesenchymal stem-cell and exosome-based technologies.',
    technologies: ['High-purity umbilical cord MSC exosomes', 'Immune-evasive cellular formulations'],
    duration: 'Outpatient Infusion Protocol',
    image: '/images/stem-cell-culture-flasks.webp',
    alt: 'Scientist handling cell culture flasks inside a biosafety cabinet',
  },
  {
    id: 'case-8',
    slug: 'bioprinted-skin-reconstruction',
    title: '3D Bioprinted Skin Reconstruction',
    category: 'Tissue Engineering',
    description: 'Advanced 3D bioprinting approaches for engineering skin-equivalent tissue structures for complex tissue reconstruction.',
    technologies: ['3D bioprinted skin scaffolds', 'Bioactive cellular matrices'],
    duration: 'Custom Treatment Protocol',
    image: '/images/bioprinting-laboratory.webp',
    alt: 'Researcher operating a 3D bioprinter inside a biosafety cabinet',
  },
  {
    id: 'case-9',
    slug: 'facial-tissue-regeneration',
    title: 'Advanced Facial Tissue Regeneration',
    category: 'Facial Reconstruction',
    description: 'Precision tissue-engineering strategies designed for complex facial tissue defects, asymmetry, and regenerative reconstruction.',
    technologies: ['Customized biomaterial scaffolds', 'Cell-based tissue regeneration'],
    duration: 'Custom Treatment Protocol',
    image: '/images/scaffold-bg.webp',
    alt: 'Illustration of a porous biomaterial scaffold for tissue regeneration',
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
      className="cf-section relative overflow-hidden bg-cf-bg"
      aria-labelledby="clinical-applications-heading"
    >
      <div className="cf-container">
        <SectionHeader
          id="clinical-applications-heading"
          eyebrow="Clinical Applications"
          title="Advanced Regenerative Therapies"
          subtitle="Precision bio-engineering solutions for complex wounds, tissue regeneration, facial reconstruction, scar remodeling, and advanced regenerative medicine."
        />
      </div>

      {/* Infinite Horizontal Carousel Strip */}
      <div className="cf-edge-fade w-full relative z-10 pointer-events-auto">
        <InfiniteSlider
          gap={20}
          duration={prefersReducedMotion ? 999999 : 38}
          durationOnHover={prefersReducedMotion ? 999999 : 500}
          className="py-4"
        >
          {CLINICAL_CASES.map((item) => (
            <motion.div
              key={item.id}
              className="bg-cf-panel border border-cf-line rounded-xl p-5 sm:p-6 hover:border-cf-line-strong transition-colors duration-500 flex flex-col w-[min(340px,calc(100vw-2.5rem))] sm:w-[380px] md:w-[400px] lg:w-[420px] xl:w-[440px] 2xl:w-[460px] shrink-0 select-none group"
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="grow">
                {/* Clinical Image */}
                <div className="relative overflow-hidden rounded-lg mb-5 h-48 bg-cf-raised border border-cf-line">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cf-bg/50 via-transparent to-transparent" />
                </div>

                {/* Category Label */}
                <span className="text-xs font-medium text-cf-accent bg-cf-active px-2.5 py-1 rounded-md inline-block mb-3">
                  {item.category}
                </span>

                {/* Title */}
                <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.015em] text-cf-text line-clamp-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-cf-muted mt-2 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Key Technologies */}
                <ul className="mt-4 pt-4 border-t border-cf-line space-y-2">
                  {item.technologies.map((tech, idx) => (
                    <li key={idx} className="flex items-center text-[13px] text-cf-text-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cf-accent mr-2.5 shrink-0" aria-hidden="true" />
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer with Duration & CTA */}
              <div className="mt-6 pt-4 border-t border-cf-line flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <div className="flex min-h-8 min-w-0 flex-1 items-center gap-1.5 text-xs text-cf-muted">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-cf-muted" aria-hidden="true" />
                  <span>
                    Duration: <strong className="font-geist-mono font-medium text-cf-text">{item.duration}</strong>
                  </span>
                </div>
                <Link
                  to={`/services#${item.slug}`}
                  className="cf-link shrink-0 whitespace-nowrap text-[13px] font-semibold min-h-8"
                >
                  Explore Therapy
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
};
