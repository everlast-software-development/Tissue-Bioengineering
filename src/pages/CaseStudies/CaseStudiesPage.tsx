import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { CheckCircle2, User, Clock } from 'lucide-react';
import { CaseStudy } from '@/types';

const caseStudies: CaseStudy[] = [
  {
    id: 'cs-1',
    slug: 'case-diabetic-ulcer-reconstruction',
    title: 'Complete Healing of Grade 3 Diabetic Foot Ulcer in 35 Days',
    patientInitials: 'D.M. (Age 61)',
    condition: 'Diabetic Foot',
    duration: '5 Weeks',
    summary:
      'A 61-year-old male with a 14-month history of non-healing neuropathic plantar ulcer unresponsive to conventional hyperbaric and debridement therapy.',
    procedure:
      'Application of vascularized ADSC-hydrogel membrane combined with bi-weekly low-level laser bio-stimulation.',
    outcome:
      '100% full-thickness skin closure achieved with neo-vascularization verified by Doppler ultrasound.',
    beforeAfterImage: '/images/stem-cell-culture-flasks.webp',
    beforeAfterImageAlt: 'Scientist handling cell culture flasks inside a biosafety cabinet',
    attendingSurgeon: 'Dr. Michael Chen, MD',
  },
  {
    id: 'cs-2',
    slug: 'case-pediatric-burn-contracture',
    title: 'Functional Range of Motion Restoration in Pediatric Neck Burn Contracture',
    patientInitials: 'K.S. (Age 9)',
    condition: 'Burn Scar Treatment',
    duration: '8 Weeks',
    summary:
      'Severe post-burn hypertrophic neck contracture limiting cervical extension to less than 15 degrees.',
    procedure:
      'Surgical excision of scar tissue followed by immediate grafting of 3D bioprinted autologous skin matrix.',
    outcome:
      'Restoration of 85-degree cervical extension without graft shrinkage or donor site morbidity.',
    beforeAfterImage:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    beforeAfterImageAlt:
      'Surgical team viewed from the operating table during a reconstructive procedure',
    attendingSurgeon: 'Dr. Aris Thorne, MD, PhD',
  },
];

export const CaseStudiesPage: React.FC = () => {
  return (
    <PageShell
      seo={{
        title: 'Clinical Case Studies',
        description:
          'Review documented clinical case reports showcasing rapid wound closure, neck contracture restoration, and diabetic limb salvage.',
      }}
      breadcrumb="Case Studies"
      header={{
        badge: 'Evidence-Based Medicine',
        title: 'Documented Clinical Case Reports',
        subtitle:
          'Detailed patient histories, therapeutic procedures, and 100% tissue remodeling outcomes verified by Doppler ultrasound.',
      }}
      cta
    >
      <div className="space-y-10 pb-16">
        {caseStudies.map((cs, index) => (
          <div key={cs.id} className="card-navy p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white shadow-card">
            <div className="lg:col-span-7 xl:col-span-6 space-y-4">
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

            <div className="lg:col-span-5 xl:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-border-light shadow-xs">
                <img
                  src={cs.beforeAfterImage}
                  alt={cs.beforeAfterImageAlt ?? cs.title}
                  loading={index === 0 ? undefined : 'lazy'}
                  decoding="async"
                  className="w-full h-64 xl:h-80 object-cover"
                />
                <div className="absolute bottom-2 left-2 px-3 py-1 rounded-lg bg-white/95 text-[11px] font-bold text-navy border border-border-light shadow-xs">
                  Ultrasound Verified Regeneration
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
};
