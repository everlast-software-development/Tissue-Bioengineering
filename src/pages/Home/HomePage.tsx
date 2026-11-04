import React from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { Hero } from './Hero';
import { ExploreBioCards } from './ExploreBioCards';
import { CoreServicesTimeline } from '@/components/sections/CoreServicesTimeline';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { WhyChooseUs } from './WhyChooseUs';
import { ResearchHighlights } from './ResearchHighlights';
import { TechnologiesSection } from './TechnologiesSection';
import { TreatmentProcess } from './TreatmentProcess';
import { StatisticsSection } from './StatisticsSection';
import { FeaturedArticles } from './FeaturedArticles';
import { PatientTestimonials } from './PatientTestimonials';
import { FAQSection } from './FAQSection';
import { CTASection } from '@/components/common/CTASection';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Home | Pioneer in Bio-Grafting & 3D Bioprinting"
        description="Leading Tissue Bioengineering and Regenerative Medicine institution specializing in Burn Scar Treatment, Diabetic Foot Ulcers, Facial Palsy, and 3D Bioprinted Skin Matrices."
      />

      <Hero />
      <ExploreBioCards />
      <CoreServicesTimeline />
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
