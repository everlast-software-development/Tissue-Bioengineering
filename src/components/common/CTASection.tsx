import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { ArrowRight, Calendar, PhoneCall } from 'lucide-react';
import { SITE_METADATA } from '@/lib/site';

interface CTASectionProps {
  /** `confocal`: the Home page's dark design. Every other page uses the default. */
  variant?: 'default' | 'confocal';
}

/** Home ("Confocal") presentation of the same consultation call to action. */
const ConfocalCTA: React.FC = () => (
  <section className="relative bg-cf-bg pb-14 sm:pb-24 lg:pb-32" aria-labelledby="cta-heading">
    <div className="cf-container">
      <div className="grid overflow-hidden rounded-2xl border border-cf-line-strong bg-cf-panel lg:grid-cols-12">
        <div className="p-7 sm:p-10 lg:col-span-7 lg:p-14">
          <p className="cf-eyebrow">Clinical Case Assessment</p>

          <h2 id="cta-heading" className="cf-h2 max-w-[16ch]">
            Ready to Explore <span className="text-cf-accent">Autologous Bio-Grafting</span>?
          </h2>

          <p className="cf-lead mt-5 max-w-xl">
            Schedule a confidential virtual consultation with our tissue bioengineers and plastic
            reconstructive surgeons to review your clinical case.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/consultation" className="cf-btn cf-btn-primary">
              <Calendar className="h-5 w-5" aria-hidden="true" />
              Book Consultation Now
            </Link>
            <a
              href={`tel:${SITE_METADATA.contact.phone}`}
              className="cf-btn border border-cf-line-strong py-2 text-cf-text hover:border-cf-accent hover:text-cf-accent"
            >
              <PhoneCall className="h-5 w-5 shrink-0 text-cf-accent" aria-hidden="true" />
              <span className="flex flex-wrap justify-center gap-x-1.5">
                <span>Call Hotline:</span>
                <span className="whitespace-nowrap">{SITE_METADATA.contact.phone}</span>
              </span>
            </a>
          </div>
        </div>

        <div className="relative min-h-[240px] border-t border-cf-line-strong sm:min-h-[320px] lg:col-span-5 lg:border-l lg:border-t-0">
          <img
            src="/images/nanofiber-scaffold-sem.webp"
            alt="Scanning electron micrograph of a fiber-based biomaterial scaffold (blue) partly covered by a cultured cell layer (gray)"
            width={900}
            height={798}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

export const CTASection: React.FC<CTASectionProps> = ({ variant = 'default' }) => {
  if (variant === 'confocal') return <ConfocalCTA />;

  return (
    <section className="py-20 relative overflow-hidden bg-white">
      <div className="container-site relative z-10">
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
