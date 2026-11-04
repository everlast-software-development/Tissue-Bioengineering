import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dna } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

const HomePage = lazy(() => import('@/pages/Home/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() =>
  import('@/pages/About/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ServicesPage = lazy(() =>
  import('@/pages/Services/ServicesPage').then((m) => ({ default: m.ServicesPage }))
);
const ResearchPage = lazy(() =>
  import('@/pages/Research/ResearchPage').then((m) => ({ default: m.ResearchPage }))
);
const TechnologiesPage = lazy(() =>
  import('@/pages/Technologies/TechnologiesPage').then((m) => ({ default: m.TechnologiesPage }))
);
const ArticlesPage = lazy(() =>
  import('@/pages/Articles/ArticlesPage').then((m) => ({ default: m.ArticlesPage }))
);
const CaseStudiesPage = lazy(() =>
  import('@/pages/CaseStudies/CaseStudiesPage').then((m) => ({ default: m.CaseStudiesPage }))
);
const ConsultationPage = lazy(() =>
  import('@/pages/Consultation/ConsultationPage').then((m) => ({ default: m.ConsultationPage }))
);
const ContactPage = lazy(() =>
  import('@/pages/Contact/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const PageLoader = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
    <Dna className="text-biotech-400 h-12 w-12 animate-spin" />
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
      Loading Regenerative Data...
    </span>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
