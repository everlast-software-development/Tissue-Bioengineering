import React from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { Hero } from '@/components/sections/Hero';
import { ExploreBioCards } from '@/components/sections/ExploreBioCards';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { ResearchHighlights } from '@/components/sections/ResearchHighlights';
import { TechnologiesSection } from '@/components/sections/TechnologiesSection';
import { TreatmentProcess } from '@/components/sections/TreatmentProcess';
import { StatisticsSection } from '@/components/sections/StatisticsSection';
import { FeaturedArticles, PatientTestimonials } from '@/components/sections/FeaturedArticles';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTASection } from '@/components/sections/CTASection';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Home | Pioneer in Bio-Grafting & 3D Bioprinting"
        description="Leading Tissue Bioengineering and Regenerative Medicine institution specializing in Burn Scar Treatment, Diabetic Foot Ulcers, Facial Palsy, and 3D Bioprinted Skin Matrices."
      />

      <Hero />
      <ExploreBioCards />
      <ServicesOverview />
      <WhyChooseUs />
      <ResearchHighlights />
      <TechnologiesSection />
      <TreatmentProcess />
      <StatisticsSection />
      <FeaturedArticles />
      <PatientTestimonials />
      <FAQSection />
      <CTASection />
    </>
  );
};
