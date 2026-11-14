import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { FilterBar } from '@/components/common/FilterBar';
import { ServiceCard } from './ServiceCard';
import { ServicesClosingCTA } from './ServicesClosingCTA';
import { mockServices } from '@/data/mockServices';
import { SERVICE_CATEGORIES } from '@/lib/site';

/**
 * Other pages link to /services#<slug> with slugs that differ from mockServices (Home's
 * ServicesOverview and CoreServicesTimeline). Map them onto the matching row here.
 */
const HASH_ALIASES: Record<string, string> = {
  'burn-scar-bio-reconstruction': 'burn-scar-treatment',
  'diabetic-foot-ulcer-grafting': 'diabetic-foot-ulcer-regeneration',
  'smart-biomaterial-wound-matrix': 'wound-healing-biomaterials',
  'keloid-scar-remodeling': 'scar-management-therapeutics',
  'facial-nerve-regeneration': 'facial-palsy-nerve-reconstruction',
  'craniofacial-osteo-grafts': 'facial-asymmetry-reconstruction',
  'stem-cell-exosome-therapy': 'regenerative-stem-cell-medicine',
};

export const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { hash } = useLocation();

  const filteredServices =
    selectedCategory === 'All'
      ? mockServices
      : mockServices.filter((s) => s.category === selectedCategory);

  /* Scroll to the therapy named in the URL hash. Deferred a frame so it runs after the
     layout's scroll-to-top on navigation. */
  useEffect(() => {
    const raw = decodeURIComponent(hash.slice(1));
    if (!raw) return;
    const slug = HASH_ALIASES[raw] ?? raw;
    if (!mockServices.some((s) => s.slug === slug)) return;
    setSelectedCategory('All');
    const frame = requestAnimationFrame(() => {
      document.getElementById(slug)?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <PageShell
      seo={{
        title: 'Services & Bio-Therapies',
        description:
          'Comprehensive regenerative medical services including Burn Scar Bio-Reconstruction, Diabetic Foot Ulcer Grafting, Facial Palsy Nerve Conduits, and Systemic Stem Cell Therapies.',
      }}
    >
      <PageHero
        breadcrumb={[{ label: 'Services & Therapies' }]}
        eyebrow="Clinical Capabilities"
        /* Two deliberate lines; "Bio-Therapies" never splits at its hyphen. */
        title={
          <>
            Cellular <span className="whitespace-nowrap">Bio-Therapies</span>
            <br />
            <span className="svc-gradient-text">&amp; Grafting</span>
          </>
        }
        titleClassName="max-w-none [font-size:clamp(2.25rem,1.35rem+3.9vw,4.75rem)]"
        lead="Explore our specialized reconstructive treatments for burn scars, non-healing diabetic ulcers, facial asymmetry, and wound remodeling."
        /* Editorial split from lg: the title column takes the title's natural width (keeping its
           two lines), the lead sits beside it, centred on the heading block. Stacks below lg. */
        gridClassName="lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center"
        leadClassName="lg:max-w-md lg:justify-self-end"
        cells
        className="border-b-0"
      />

      {/* Filter strip: stays under the header while the list scrolls */}
      <div className="sticky top-16 z-30 border-y border-cf-line bg-cf-bg/[0.92] backdrop-blur-md lg:top-[88px]">
        <div className="cf-container flex items-center gap-4 py-3 sm:gap-6">
          <FilterBar
            label="Filter therapies by category"
            options={SERVICE_CATEGORIES}
            value={selectedCategory}
            onChange={setSelectedCategory}
            allLabel="All Therapies"
            className="mx-0 min-w-0 flex-1 px-0 sm:mx-0 sm:px-0 lg:flex-nowrap lg:overflow-x-auto"
          />
          <p
            className="cf-mono shrink-0 border-l border-cf-line pl-4 text-cf-text-2 sm:pl-6"
            aria-live="polite"
          >
            {String(filteredServices.length).padStart(2, '0')} /{' '}
            {String(mockServices.length).padStart(2, '0')}
          </p>
        </div>
      </div>

      <section aria-label="Therapies">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} index={mockServices.indexOf(service)} />
        ))}
      </section>

      <ServicesClosingCTA />
    </PageShell>
  );
};
