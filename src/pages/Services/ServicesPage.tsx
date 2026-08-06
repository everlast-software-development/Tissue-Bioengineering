import React, { useState } from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { mockServices } from '@/data/mockServices';
import { SERVICE_CATEGORIES } from '@/constants';
import { CTASection } from '@/components/sections/CTASection';

export const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredServices =
    selectedCategory === 'All'
      ? mockServices
      : mockServices.filter((s) => s.category === selectedCategory);

  return (
    <>
      <SEOHead
        title="Services & Bio-Therapies"
        description="Comprehensive regenerative medical services including Burn Scar Bio-Reconstruction, Diabetic Foot Ulcer Grafting, Facial Palsy Nerve Conduits, and Systemic Stem Cell Therapies."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Services & Therapies' }]} />

        <div className="py-8 text-center max-w-3xl mx-auto">
          <SectionTitle
            badge="Clinical Capabilities"
            title="Cellular Bio-Therapies & Grafting"
            subtitle="Explore our specialized reconstructive treatments for burn scars, non-healing diabetic ulcers, facial asymmetry, and wound remodeling."
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              selectedCategory === 'All'
                ? 'bg-navy text-white shadow-soft'
                : 'bg-white border border-border-light text-navy hover:border-navy'
            }`}
          >
            All Therapies
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-navy text-white shadow-soft'
                  : 'bg-white border border-border-light text-navy hover:border-navy'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      <CTASection />
    </>
  );
};
