import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-xs md:text-sm text-text-secondary space-x-2 py-4">
      <Link to="/" className="flex items-center hover:text-navy transition-colors font-medium">
        <Home className="w-4 h-4 mr-1 text-steel" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 text-border-light" />
          {item.path ? (
            <Link to={item.path} className="hover:text-navy transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="text-navy font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
