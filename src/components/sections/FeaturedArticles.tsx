import React from 'react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { mockArticles, mockTestimonials } from '@/data/mockArticles';
import { Star, Quote } from 'lucide-react';

export const FeaturedArticles: React.FC = () => {
  return (
    <section className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Scientific Insights"
          title="Featured Biotech Publications"
          subtitle="Articles, whitepapers, and clinical updates authored by our leading tissue bioengineers."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const PatientTestimonials: React.FC = () => {
  return (
    <section className="py-20 relative bg-[#F7F9FC] border-t border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Clinical Success"
          title="Patient Recovery Stories"
          subtitle="Real testimonials from patients whose lives were transformed by living tissue bio-grafts."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockTestimonials.map((t) => (
            <div key={t.id} className="card-navy card-navy-hover p-6 flex flex-col justify-between relative bg-white">
              <div>
                <Quote className="w-8 h-8 text-steel/20 mb-3" />
                <div className="flex space-x-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-text-primary italic leading-relaxed">"{t.quote}"</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-light flex items-center space-x-3">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt={t.patientName} className="w-10 h-10 rounded-full object-cover border border-steel/30" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-sky text-navy font-bold flex items-center justify-center text-sm">
                    {t.patientName[0]}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-navy">{t.patientName}</h4>
                  <span className="text-xs text-steel font-bold">{t.treatment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
