import React from 'react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ResearchCard } from '@/components/cards/ResearchCard';
import { researchItems } from '@/data/research';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const ResearchHighlights: React.FC = () => {
  return (
    <section className="py-20 relative bg-white">
      <div className="container-site">
        <SectionTitle
          badge="Scientific Frontier"
          title="Research & Clinical Innovations"
          subtitle="Pioneering peer-reviewed discoveries across 3D Bioprinting, iPSC Stem Cells, Gene Editing, and Organ-on-Chip technology."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {researchItems.slice(0, 3).map((item) => (
            <ResearchCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/research">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All 8 Research Domains
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
