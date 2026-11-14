import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dna } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { I18nProvider } from '@/i18n/I18nProvider';
import { useI18n } from '@/i18n/context';

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
const ArticleDetailPage = lazy(() =>
  import('@/pages/Articles/ArticleDetailPage').then((m) => ({ default: m.ArticleDetailPage }))
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

const PageLoader = () => {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 bg-cf-bg">
      <Dna className="h-10 w-10 animate-spin text-cf-accent motion-reduce:animate-none" aria-hidden="true" />
      <span className="text-xs text-cf-muted">{t.common.loading}</span>
    </div>
  );
};

/**
 * The page tree, mounted once per locale: English at `/` (the original routes, unchanged)
 * and Arabic under `/ar`. Both sit under one layout route, so switching language re-renders
 * the current page in place instead of remounting the header and footer.
 */
const pageRoutes = (
  <>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="services" element={<ServicesPage />} />
    <Route path="research" element={<ResearchPage />} />
    <Route path="technologies" element={<TechnologiesPage />} />
    <Route path="articles" element={<ArticlesPage />} />
    <Route path="articles/:slug" element={<ArticleDetailPage />} />
    <Route path="case-studies" element={<CaseStudiesPage />} />
    <Route path="consultation" element={<ConsultationPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <I18nProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/ar">{pageRoutes}</Route>
              <Route path="/">{pageRoutes}</Route>
            </Route>
          </Routes>
        </Suspense>
      </I18nProvider>
    </BrowserRouter>
  );
};

export default App;
