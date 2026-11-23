import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { useMessages } from '@/i18n/context';
import { homeMessages } from './messages';
import { Hero } from './Hero';
import { ExploreBioCards } from './ExploreBioCards';
import { CoreServicesTimeline } from './CoreServicesTimeline';
import { ServicesOverview } from './ServicesOverview';
import { WhyChooseUs } from './WhyChooseUs';
import { ResearchHighlights } from './ResearchHighlights';
import { TechnologiesSection } from './TechnologiesSection';
import { TreatmentProcess } from './TreatmentProcess';
import { StatisticsSection } from './StatisticsSection';
import { FeaturedArticles } from './FeaturedArticles';
import { PatientTestimonials } from './PatientTestimonials';
import { FAQSection } from './FAQSection';

export const HomePage: React.FC = () => {
  const t = useMessages(homeMessages);
  return (
    <PageShell seo={t.seo} cta>
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
    </PageShell>
  );
};
