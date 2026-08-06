import React from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ContactForm } from '@/components/forms/ContactForm';
import { SITE_METADATA } from '@/constants';
import { MapPin, Phone, Mail, Clock, Building2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Contact Us"
        description="Get in touch with Tissue Bioengineering clinical headquarters, research facilities, and global medical outreach team."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Contact Us' }]} />

        <div className="py-8 text-center max-w-3xl mx-auto">
          <SectionTitle
            badge="Global Headquarters"
            title="Get in Touch with Our Clinical Team"
            subtitle="Whether you have questions regarding patient care, academic research partnerships, or cleanroom facility tours."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16">
          {/* Left Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-navy p-6 space-y-5 bg-white shadow-card">
              <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                <Building2 className="w-5 h-5 text-navy" /> Clinical Headquarters
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-text-secondary">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-navy shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy block">Campus Address</strong>
                    <span>{SITE_METADATA.contact.address}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-navy shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy block">Main Clinical Line</strong>
                    <span>{SITE_METADATA.contact.phone}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-navy shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy block">General Inquiries</strong>
                    <span>{SITE_METADATA.contact.email}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-navy shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy block">Laboratory Operating Hours</strong>
                    <span>Monday - Friday: 8:00 AM - 6:00 PM EST</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-navy p-6 bg-rose-50 border-rose-200 text-xs text-status-error">
              <strong className="text-rose-900 block text-sm mb-1">Urgent Burn / Trauma Hotline</strong>
              Emergency transfer team available 24/7 for acute surgical consults: {SITE_METADATA.contact.emergency}
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};
