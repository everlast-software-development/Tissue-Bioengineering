import React from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';
import { Dna, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead title="404 - Page Not Found" />

      <div className="min-h-[70vh] flex items-center justify-center text-center px-4 py-20">
        <div className="card-navy p-10 max-w-md mx-auto border-border-light bg-white shadow-card">
          <Dna className="w-16 h-16 text-navy mx-auto mb-4 animate-spin" />
          <h1 className="text-5xl font-extrabold text-navy">404</h1>
          <h2 className="text-xl font-bold text-steel mt-2">Cellular Map Not Found</h2>
          <p className="text-xs text-text-secondary mt-3 leading-relaxed">
            The page or clinical resource you requested does not exist or has been relocated to another research domain.
          </p>
          <div className="mt-6">
            <Link to="/">
              <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
