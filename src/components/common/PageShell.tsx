import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { SEOHead } from './SEOHead';
import { SectionTitle } from './SectionTitle';
import { CTASection } from './CTASection';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 py-4 text-xs text-text-secondary md:text-sm">
      <Link to="/" className="flex items-center font-medium transition-colors hover:text-navy">
        <Home className="mr-1 h-4 w-4 text-steel" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-3.5 w-3.5 text-border-light" />
          {item.path ? (
            <Link to={item.path} className="font-medium transition-colors hover:text-navy">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-navy">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

interface PageShellProps {
  /** SEO title (suffixed with the site name) and meta description. */
  seo: { title: string; description: string };
  /** Label of the current page in the breadcrumb trail. */
  breadcrumb: string;
  /** Centered page header. Omit to render a custom header as the first child. */
  header?: { badge: string; title: string; subtitle: string };
  /** Render the shared consultation CTA band after the page content. */
  cta?: boolean;
  children: React.ReactNode;
}

/** Common frame for inner pages: SEO tags, breadcrumb, page header, content, optional CTA. */
export const PageShell: React.FC<PageShellProps> = ({
  seo,
  breadcrumb,
  header,
  cta = false,
  children,
}) => {
  return (
    <>
      <SEOHead title={seo.title} description={seo.description} />

      <div className="container-site py-8">
        <Breadcrumb items={[{ label: breadcrumb }]} />

        {header && (
          <div className="mx-auto max-w-3xl py-8 text-center">
            <SectionTitle badge={header.badge} title={header.title} subtitle={header.subtitle} />
          </div>
        )}

        {children}
      </div>

      {cta && <CTASection />}
    </>
  );
};
