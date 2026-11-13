import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, PhoneCall } from 'lucide-react';
import { SITE_METADATA } from '@/lib/site';
import { CellField } from './CellField';

/**
 * Closing consultation band for the Services page. Same copy and destinations as the shared
 * CTASection (components/common/CTASection.tsx); keep the two in sync. It has its own layout so it
 * can close the page with the hero's cellular texture instead of a photo (the shared band's SEM
 * image is already shown by service 03 on this page).
 */
export const ServicesClosingCTA: React.FC = () => (
  <section className="bg-cf-bg py-14 sm:py-24 lg:py-28" aria-labelledby="cta-heading">
    <div className="cf-container">
      <div className="relative isolate overflow-hidden rounded-2xl border border-cf-line-strong bg-cf-raised">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="svc-glow-cta absolute inset-0" />
          <CellField className="svc-cells-cta absolute inset-0 h-full w-full text-cf-accent" />
        </div>

        <div className="grid gap-10 p-7 sm:p-12 lg:grid-cols-12 lg:items-end lg:gap-16 lg:p-16">
          <div className="lg:col-span-7">
            <p className="cf-eyebrow">Clinical Case Assessment</p>
            <h2 id="cta-heading" className="cf-h2 max-w-[17ch]">
              Ready to Explore{' '}
              <span className="svc-gradient-text">
                Autologous <span className="whitespace-nowrap">Bio-Grafting</span>
              </span>
              ?
            </h2>
            <p className="cf-lead mt-6 max-w-xl">
              Schedule a confidential virtual consultation with our tissue bioengineers and plastic
              reconstructive surgeons to review your clinical case.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:flex-col lg:border-l lg:border-cf-line lg:pl-12">
            <Link to="/consultation" className="cf-btn cf-btn-primary min-h-[52px]">
              <Calendar className="h-5 w-5" aria-hidden="true" />
              Book Consultation Now
            </Link>
            <a
              href={`tel:${SITE_METADATA.contact.phone}`}
              className="cf-btn min-h-[52px] border border-cf-line-strong bg-cf-bg/40 py-2 text-cf-text hover:border-cf-accent hover:text-cf-accent"
            >
              <PhoneCall className="h-5 w-5 shrink-0 text-cf-accent" aria-hidden="true" />
              <span className="flex flex-wrap justify-center gap-x-1.5">
                <span>Call Hotline:</span>
                <span className="whitespace-nowrap">{SITE_METADATA.contact.phone}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
