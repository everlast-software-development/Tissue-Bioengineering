import React from 'react';
import { Star, Quote } from 'lucide-react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Testimonial } from '@/types';

const testimonials: Testimonial[] = [
  {
    id: 't-1',
    patientName: 'Eleanor Vance',
    treatment: 'Burn Scar Treatment',
    quote:
      'Following my severe burn injury, traditional skin grafts left tight, painful contractures. The 3D bioprinted autologous graft from Tissue Bioengineering restored both mobility and my skin’s natural appearance.',
    rating: 5,
    date: 'June 2026',
  },
  {
    id: 't-2',
    patientName: 'Robert Martinez',
    treatment: 'Diabetic Foot',
    quote:
      'I was facing amputation due to a chronic diabetic ulcer that hadn’t closed in 14 months. Their stem-cell bio-membrane therapy healed the wound completely in just 5 weeks.',
    rating: 5,
    date: 'May 2026',
  },
  {
    id: 't-3',
    patientName: 'Sophia Lin',
    treatment: 'Facial Palsy',
    quote:
      'The bio-engineered nerve conduit procedure restored nerve function and facial muscle control after years of palsy. The care and scientific expertise were world-class.',
    rating: 5,
    date: 'April 2026',
  },
];

export const PatientTestimonials: React.FC = () => {
  return (
    <section className="py-20 relative bg-[#F7F9FC] border-t border-b border-slate-200/60">
      <div className="container-site">
        <SectionTitle
          badge="Clinical Success"
          title="Patient Recovery Stories"
          subtitle="Real testimonials from patients whose lives were transformed by living tissue bio-grafts."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
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
