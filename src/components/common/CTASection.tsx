import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, PhoneCall } from 'lucide-react';
import { SITE_METADATA } from '@/lib/site';

/** Consultation call to action, shared by Home and every inner page that shows one. */
export const CTASection: React.FC = () => (
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
