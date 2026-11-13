import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_METADATA, SERVICE_CATEGORIES } from '@/lib/site';
import { FOOTER_NAV_LINKS } from './navData';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

/** Footer classes (the Home page's "Confocal" design, used on every route). */
const s = {
  footer: 'bg-cf-bg text-cf-text pt-16 pb-10 text-sm border-t border-cf-line sm:pt-20',
  container: 'cf-container',
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-x-10 gap-y-12 pb-14 border-b border-cf-line',
  description: 'text-sm text-cf-muted leading-relaxed max-w-sm',
  badge:
    'flex items-center gap-2 text-[13px] text-cf-text-2 px-3 py-2 rounded-lg border border-cf-line-strong w-fit',
  badgeIcon: 'w-4 h-4 text-cf-accent',
  heading: 'font-semibold text-cf-text mb-5 text-sm',
  list: 'space-y-1 text-sm text-cf-muted',
  contactList: 'space-y-4 text-sm text-cf-muted',
  link: 'inline-flex min-h-8 items-center rounded-sm hover:text-cf-accent transition-colors cf-focus',
  icon: 'text-cf-accent',
  cta: 'cf-btn cf-btn-outline-accent min-h-11 px-5 text-sm',
  bottom:
    'pt-8 flex flex-col md:flex-row md:items-center justify-between text-[13px] text-cf-muted gap-4',
  legal: 'flex flex-wrap gap-x-6 gap-y-2',
} as const;

export const Footer: React.FC = () => {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.grid}>
          {/* Brand Info */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center w-fit rounded-md cf-focus">
              <img
                src="/images/tissuebioengineering.webp"
                alt="Tissue Bioengineering"
                width={1000}
                height={328}
                loading="lazy"
                className="h-[5.25rem] w-auto object-contain drop-shadow-md"
              />
            </Link>
            <p className={s.description}>
              {SITE_METADATA.description}
            </p>
            <div className={s.badge}>
              <ShieldCheck className={s.badgeIcon} />
              <span>ISO 13485 & GMP Certified Cleanrooms</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className={s.heading}>
              Navigation
            </h2>
            <ul className={s.list}>
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className={s.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Therapies & Services */}
          <div>
            <h2 className={s.heading}>
              Therapies
            </h2>
            <ul className={s.list}>
              {SERVICE_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link to="/services" className={s.link}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h2 className={s.heading}>
              Contact
            </h2>
            <ul className={s.contactList}>
              <li className="flex items-start">
                <MapPin className={`w-4 h-4 ${s.icon} mr-2 shrink-0 mt-0.5`} />
                <span>
                  Clinical treatments provided at {SITE_METADATA.treatmentProvider.name},{' '}
                  {SITE_METADATA.treatmentProvider.address}.
                </span>
              </li>
              <li className="flex items-center">
                <Phone className={`w-4 h-4 ${s.icon} mr-2 shrink-0`} />
                <span>{SITE_METADATA.contact.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className={`w-4 h-4 ${s.icon} mr-2 shrink-0`} />
                <span className="min-w-0 [overflow-wrap:anywhere]">{SITE_METADATA.contact.email}</span>
              </li>
            </ul>
            <div className="mt-5">
              <Link
                to="/consultation"
                className={s.cta}
              >
                Schedule Case Review
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal disclaimers */}
        <div className={s.bottom}>
          <p>© {new Date().getFullYear()} Tissue Bioengineering Inc. All rights reserved.</p>
          <div className={s.legal}>
            <a href="#" className={s.link}>Privacy Policy</a>
            <a href="#" className={s.link}>Terms of Clinical Care</a>
            <a href="#" className={s.link}>Ethics & Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
