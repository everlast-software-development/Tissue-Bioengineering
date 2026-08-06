import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ArrowRight, Calendar, PhoneCall } from 'lucide-react';
import { SITE_METADATA } from '@/constants';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-[#0B1F3A] via-[#12335C] to-[#163D6B] rounded-3xl p-10 md:p-14 text-center max-w-4xl mx-auto shadow-2xl text-white relative overflow-hidden">
          {/* Subtle Ambient Soft Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />

          <span className="text-xs font-bold uppercase tracking-wider text-sky px-3.5 py-1 rounded-full bg-white/10 border border-white/20 inline-block mb-4 backdrop-blur-md">
            Clinical Case Assessment
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Ready to Explore <span className="text-sky">Autologous Bio-Grafting</span>?
          </h2>

          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Schedule a confidential virtual consultation with our tissue bioengineers and plastic
            reconstructive surgeons to review your clinical case.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/consultation">
              <Button
                size="lg"
                variant="primary"
                className="bg-white text-navy hover:bg-slate-100 hover:text-navy-hover font-bold shadow-lg"
                leftIcon={<Calendar className="w-5 h-5 text-navy" />}
                rightIcon={<ArrowRight className="w-5 h-5 text-navy" />}
              >
                Book Consultation Now
              </Button>
            </Link>
            <a href={`tel:${SITE_METADATA.contact.phone}`}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/60 text-white hover:bg-white/10 hover:border-white"
                leftIcon={<PhoneCall className="w-5 h-5 text-sky" />}
              >
                Call Hotline: {SITE_METADATA.contact.phone}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
