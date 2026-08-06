import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Dna } from 'lucide-react';

const HomePage = lazy(() => import('@/pages/Home/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('@/pages/About/AboutPage').then((m) => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('@/pages/Services/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const ResearchPage = lazy(() => import('@/pages/Research/ResearchPage').then((m) => ({ default: m.ResearchPage })));
const TechnologiesPage = lazy(() => import('@/pages/Technologies/TechnologiesPage').then((m) => ({ default: m.TechnologiesPage })));
const ArticlesPage = lazy(() => import('@/pages/Articles/ArticlesPage').then((m) => ({ default: m.ArticlesPage })));
const CaseStudiesPage = lazy(() => import('@/pages/CaseStudies/CaseStudiesPage').then((m) => ({ default: m.CaseStudiesPage })));
const ConsultationPage = lazy(() => import('@/pages/Consultation/ConsultationPage').then((m) => ({ default: m.ConsultationPage })));
const ContactPage = lazy(() => import('@/pages/Contact/ContactPage').then((m) => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <Dna className="w-12 h-12 text-biotech-400 animate-spin" />
    <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
      Loading Regenerative Data...
    </span>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="technologies" element={<TechnologiesPage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/:slug" element={<ArticlesPage />} />
          <Route path="case-studies" element={<CaseStudiesPage />} />
          <Route path="consultation" element={<ConsultationPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
