import React from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SectionTitle } from '@/components/common/SectionTitle';
import { mockCaseStudies } from '@/data/mockArticles';
import { CTASection } from '@/components/sections/CTASection';
import { CheckCircle2, User, Clock } from 'lucide-react';

export const CaseStudiesPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Clinical Case Studies"
        description="Review documented clinical case reports showcasing rapid wound closure, neck contracture restoration, and diabetic limb salvage."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Case Studies' }]} />

        <div className="py-8 text-center max-w-3xl mx-auto">
          <SectionTitle
            badge="Evidence-Based Medicine"
            title="Documented Clinical Case Reports"
            subtitle="Detailed patient histories, therapeutic procedures, and 100% tissue remodeling outcomes verified by Doppler ultrasound."
          />
        </div>

        <div className="space-y-10 pb-16">
          {mockCaseStudies.map((cs) => (
            <div key={cs.id} className="card-navy p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white shadow-card">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-3 text-xs text-text-secondary">
                  <span className="px-2.5 py-1 rounded bg-sky text-navy font-bold border border-steel/20">
                    {cs.condition}
                  </span>
                  <span className="flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-steel" /> {cs.patientInitials}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-text-muted" /> Treatment: {cs.duration}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-navy">{cs.title}</h3>

                <div className="space-y-3 text-xs sm:text-sm text-text-secondary">
                  <p>
                    <strong className="text-navy">Patient History:</strong> {cs.summary}
                  </p>
                  <p>
                    <strong className="text-navy">Bio-Therapeutic Procedure:</strong> {cs.procedure}
                  </p>
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-status-success flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-emerald-900">Clinical Outcome:</strong> {cs.outcome}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-text-muted">
                  Attending Surgeon: <span className="text-navy font-bold">{cs.attendingSurgeon}</span>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border-light shadow-xs">
                  <img
                    src={cs.beforeAfterImage}
                    alt={cs.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-3 py-1 rounded-lg bg-white/95 text-[11px] font-bold text-navy border border-border-light shadow-xs">
                    Ultrasound Verified Regeneration
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CTASection />
    </>
  );
};
