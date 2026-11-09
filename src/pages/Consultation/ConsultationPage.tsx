import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { ConsultationForm } from './ConsultationForm';
import { ShieldCheck, Lock, Clock } from 'lucide-react';

const EXPECTATIONS = [
  {
    icon: Clock,
    title: '45-Minute Review:',
    text: 'Comprehensive evaluation with a senior plastic reconstructive surgeon.',
  },
  {
    icon: ShieldCheck,
    title: '3D Bio-Print Suitability:',
    text: 'Assessment of patient autologous cell availability & scaffold design.',
  },
  {
    icon: Lock,
    title: 'HIPAA Compliant:',
    text: 'Encrypted medical record transmission & patient confidentiality.',
  },
];

export const ConsultationPage: React.FC = () => {
  return (
    <PageShell
      seo={{
        title: 'Request Clinical Consultation',
        description:
          'Book a confidential clinical evaluation with our tissue bioengineers and plastic surgeons to review burn scar, diabetic foot, or facial asymmetry cases.',
      }}
    >
      <PageHero
        breadcrumb={[{ label: 'Request Consultation' }]}
        eyebrow="Confidential Case Assessment"
        title="Schedule a Specialist Consultation"
        lead="Our clinical board evaluates patient records, 3D imaging, and wound histories to recommend custom bio-graft protocols."
        graticule
        className="border-b-0"
      />

      <section className="pb-14 sm:pb-24 lg:pb-32" aria-label="Consultation request">
        <div className="cf-container grid items-start gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* Form (first on small screens, right column from lg) */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <ConsultationForm />
          </div>

          {/* What to expect + referrals */}
          <aside className="lg:sticky lg:top-[120px] lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-cf-text">What to Expect</h2>
            <ol className="mt-6 border-t border-cf-line">
              {EXPECTATIONS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-5 border-b border-cf-line py-6">
                  <span className="cf-mono pt-0.5" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[15px] font-semibold text-cf-text">
                      <Icon className="h-4 w-4 shrink-0 text-cf-accent" aria-hidden="true" />
                      {title}
                    </p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-cf-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-xl border border-cf-line-strong bg-cf-raised p-6">
              <h3 className="mb-2 text-base font-semibold text-cf-text">Physician Referrals</h3>
              <p className="text-[15px] leading-relaxed text-cf-muted">
                Referring plastic surgeons, endocrinologists, and trauma centers can submit patient
                charts directly via secure portal or phone.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
};
