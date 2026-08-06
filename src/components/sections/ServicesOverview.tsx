import React from 'react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { mockServices } from '@/data/mockServices';

export const ServicesOverview: React.FC = () => {
  return (
    <section className="py-20 relative bg-[#F5F9FF] border-t border-b border-blue-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Clinical Applications"
          title="Advanced Regenerative Therapies"
          subtitle="Precision bio-engineering solutions for complex wound remodeling, facial asymmetry, and chronic diabetic ulcers."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};
