import React from 'react';
import { SEOHead } from './SEOHead';
import { CTASection } from './CTASection';

interface PageShellProps {
  /** SEO title (suffixed with the site name) and meta description (site default if omitted). */
  seo: { title: string; description?: string };
  /** Render the shared consultation CTA band after the page content. */
  cta?: boolean;
  children: React.ReactNode;
}

/**
 * Common frame for inner pages: SEO tags, the page's "Confocal" base styles, page content (each
 * page composes its own PageHero and sections) and the optional CTA.
 */
export const PageShell: React.FC<PageShellProps> = ({ seo, cta = false, children }) => (
  <div className="bg-cf-bg text-cf-text antialiased">
    <SEOHead title={seo.title} description={seo.description} />
    {children}
    {cta && <CTASection />}
  </div>
);
