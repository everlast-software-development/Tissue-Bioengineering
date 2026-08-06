import React from 'react';
import { ResearchItem } from '@/types';
import { FileText, Calendar, ExternalLink } from 'lucide-react';

export const ResearchCard: React.FC<{ item: ResearchItem }> = ({ item }) => {
  return (
    <div className="card-navy card-navy-hover p-6 flex flex-col justify-between group bg-white">
      <div>
        <div className="flex items-center justify-between text-xs text-text-muted mb-3">
          <span className="px-2.5 py-1 rounded-md bg-sky border border-steel/20 text-navy font-bold">
            {item.category}
          </span>
          <span className="flex items-center text-text-muted">
            <Calendar className="w-3.5 h-3.5 mr-1 text-steel" />
            {item.publicationDate}
          </span>
        </div>

        <h3 className="text-lg font-bold text-navy group-hover:text-steel transition-colors line-clamp-2">
          {item.title}
        </h3>

        <p className="text-xs text-text-secondary mt-2 line-clamp-3 leading-relaxed">
          {item.abstract}
        </p>

        <div className="mt-4 flex flex-wrap gap-1 text-[11px] text-text-muted">
          <strong className="text-text-primary">Authors:</strong> {item.authors.join(', ')}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-between">
        <span
          className={`text-xs px-2.5 py-1 rounded font-semibold ${
            item.status === 'FDA Approved'
              ? 'bg-emerald-50 text-status-success border border-emerald-200'
              : item.status === 'Clinical Trial'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-sky-light text-navy border border-steel/20'
          }`}
        >
          {item.status}
        </span>

        {item.doi ? (
          <a
            href={`https://doi.org/${item.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-bold text-navy hover:text-steel"
          >
            DOI <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        ) : (
          <span className="inline-flex items-center text-xs text-text-muted">
            <FileText className="w-3.5 h-3.5 mr-1" /> Abstract
          </span>
        )}
      </div>
    </div>
  );
};
