import React, { useState } from 'react';
import { PageShell } from '@/components/common/PageShell';
import { FilterBar } from '@/components/common/FilterBar';
import { ServiceCard } from './ServiceCard';
import { mockServices } from '@/data/mockServices';
import { SERVICE_CATEGORIES } from '@/lib/site';

export const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredServices =
    selectedCategory === 'All'
      ? mockServices
      : mockServices.filter((s) => s.category === selectedCategory);

  return (
    <PageShell
      seo={{
        title: 'Services & Bio-Therapies',
        description:
          'Comprehensive regenerative medical services including Burn Scar Bio-Reconstruction, Diabetic Foot Ulcer Grafting, Facial Palsy Nerve Conduits, and Systemic Stem Cell Therapies.',
      }}
      breadcrumb="Services & Therapies"
      header={{
        badge: 'Clinical Capabilities',
        title: 'Cellular Bio-Therapies & Grafting',
        subtitle:
          'Explore our specialized reconstructive treatments for burn scars, non-healing diabetic ulcers, facial asymmetry, and wound remodeling.',
      }}
      cta
    >
      <FilterBar
        options={SERVICE_CATEGORIES}
        value={selectedCategory}
        onChange={setSelectedCategory}
        allLabel="All Therapies"
      />

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </PageShell>
  );
};
