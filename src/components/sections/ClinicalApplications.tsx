import React from 'react';
import { ClinicalApplicationsCarousel } from '@/components/ui/clinical-applications-carousel';
import { TissueBackground3D } from '@/components/ui/tissue-background-3d';
import { clinicalApplicationsData } from '@/data/clinicalApplications';

export const ClinicalApplications: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-24 bg-[#0b1f3a]">
      {/* 3D Animated Tissue Engineering Background */}
      <TissueBackground3D />

      {/* Subtle Dark Overlay to allow 3D structures to remain visible while ensuring text readability */}
      <div className="absolute inset-0 bg-[#0b1f3a]/55 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="text-center mb-16 px-4">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-[#5CC8E8] bg-[#1677C8]/10 border border-[#5CC8E8]/30 uppercase mb-4 shadow-sm backdrop-blur-sm">
            Clinical Applications
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Advanced Regenerative Therapies
          </h2>
          <p className="mt-4 text-base md:text-xl text-[#B8D9EA] leading-relaxed max-w-3xl mx-auto font-medium">
            Precision bio-engineering solutions for complex wound remodeling, facial asymmetry, chronic diabetic ulcers, nerve regeneration, and advanced tissue reconstruction.
          </p>
        </div>

        <ClinicalApplicationsCarousel applications={clinicalApplicationsData} />
      </div>
    </section>
  );
};

