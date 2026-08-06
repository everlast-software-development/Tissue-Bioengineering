import React from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ConsultationForm } from '@/components/forms/ConsultationForm';
import { ShieldCheck, Lock, Clock } from 'lucide-react';

export const ConsultationPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Request Clinical Consultation"
        description="Book a confidential clinical evaluation with our tissue bioengineers and plastic surgeons to review burn scar, diabetic foot, or facial asymmetry cases."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Request Consultation' }]} />

        <div className="py-8 text-center max-w-3xl mx-auto">
          <SectionTitle
            badge="Confidential Case Assessment"
            title="Schedule a Specialist Consultation"
            subtitle="Our clinical board evaluates patient records, 3D imaging, and wound histories to recommend custom bio-graft protocols."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 items-start">
          {/* Left Info Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card-navy p-6 space-y-4 bg-white shadow-card">
              <h3 className="text-lg font-bold text-navy">What to Expect</h3>
              <ul className="space-y-3 text-xs text-text-secondary">
                <li className="flex items-start">
                  <Clock className="w-4 h-4 text-navy mr-2 shrink-0 mt-0.5" />
                  <span><strong>45-Minute Review:</strong> Comprehensive evaluation with a senior plastic reconstructive surgeon.</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="w-4 h-4 text-navy mr-2 shrink-0 mt-0.5" />
                  <span><strong>3D Bio-Print Suitability:</strong> Assessment of patient autologous cell availability & scaffold design.</span>
                </li>
                <li className="flex items-start">
                  <Lock className="w-4 h-4 text-navy mr-2 shrink-0 mt-0.5" />
                  <span><strong>HIPAA Compliant:</strong> Encrypted medical record transmission & patient confidentiality.</span>
                </li>
              </ul>
            </div>

            <div className="card-navy p-6 bg-sky/50 border-steel/20">
              <h4 className="text-sm font-bold text-navy mb-2">Physician Referrals</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Referring plastic surgeons, endocrinologists, and trauma centers can submit patient charts directly via secure portal or phone.
              </p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-8">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </>
  );
};
