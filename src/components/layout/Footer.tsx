import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_METADATA, SERVICE_CATEGORIES } from '@/lib/site';
import { NAV_LINKS } from './navData';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#08172B] text-white pt-16 pb-8 text-sm border-t border-navy-hover">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center">
              <img
                src="/images/tissuebioengineering.webp"
                alt="Tissue Bioengineering"
                width={1000}
                height={328}
                loading="lazy"
                className="h-9 w-auto object-contain drop-shadow-md"
              />
            </Link>
            <p className="text-xs text-[#CBD5E1] leading-relaxed max-w-sm">
              {SITE_METADATA.description}
            </p>
            <div className="flex items-center space-x-2 text-xs text-white bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 w-fit">
              <ShieldCheck className="w-4 h-4 text-sky" />
              <span>ISO 13485 & GMP Certified Cleanrooms</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#CBD5E1]">
              {NAV_LINKS.slice(0, 5).map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Therapies & Services */}
          <div>
            <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-wider">
              Therapies
            </h4>
            <ul className="space-y-2 text-xs text-[#CBD5E1]">
              {SERVICE_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link to="/services" className="hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-wider">
              Clinical Headquarters
            </h4>
            <ul className="space-y-3 text-xs text-[#CBD5E1]">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-sky mr-2 shrink-0 mt-0.5" />
                <span>{SITE_METADATA.contact.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-sky mr-2 shrink-0" />
                <span>{SITE_METADATA.contact.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-sky mr-2 shrink-0" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{SITE_METADATA.contact.email}</span>
              </li>
            </ul>
            <div className="mt-5">
              <Link
                to="/consultation"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-navy bg-white hover:bg-slate-100 transition-all shadow-xs"
              >
                Schedule Case Review
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#CBD5E1] gap-4">
          <p>© {new Date().getFullYear()} Tissue Bioengineering Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Clinical Care</a>
            <a href="#" className="hover:text-white transition-colors">Ethics & Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
