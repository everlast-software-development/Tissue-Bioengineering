import React from 'react';
import { Link } from 'react-router-dom';
import { Dna, Home } from 'lucide-react';
import { PageShell } from '@/components/common/PageShell';

export const NotFoundPage: React.FC = () => {
  return (
    <PageShell seo={{ title: '404 - Page Not Found' }}>
      <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden border-b border-cf-line lg:min-h-[calc(100svh-88px)]">
        <div className="cf-graticule absolute inset-0 -z-10" aria-hidden="true" />

        <div className="cf-container py-20 sm:py-28">
          <div className="cf-fade max-w-2xl">
            <span className="mb-10 flex h-12 w-12 items-center justify-center rounded-full border border-cf-accent/40 text-cf-accent">
              <Dna className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="font-light leading-none tracking-[-0.06em] text-cf-text [font-size:clamp(6rem,4rem+10vw,12rem)]">
              4<span className="text-cf-accent">0</span>4
            </h1>
            <h2 className="mt-8 text-3xl font-semibold tracking-[-0.035em] text-cf-text sm:text-4xl">
              Cellular Map Not Found
            </h2>
            <p className="cf-lead mt-4 max-w-lg">
              The page or clinical resource you requested does not exist or has been relocated to
              another research domain.
            </p>
            <div className="mt-10">
              <Link to="/" className="cf-btn cf-btn-primary">
                <Home className="h-4 w-4" aria-hidden="true" />
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};
