import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { ContactForm } from './ContactForm';
import { SITE_METADATA } from '@/lib/site';
import { MapPin, Phone, Mail, Clock, Building2, Siren } from 'lucide-react';

/** tel: link in the same form the consultation CTA uses. */
const tel = (phone: string) => `tel:${phone}`;

export const ContactPage: React.FC = () => {
  const { address, phone, email, emergency } = SITE_METADATA.contact;

  const details = [
    { icon: MapPin, label: 'Campus Address', value: address },
    { icon: Phone, label: 'Main Clinical Line', value: phone, href: tel(phone) },
    { icon: Mail, label: 'General Inquiries', value: email, href: `mailto:${email}` },
    {
      icon: Clock,
      label: 'Laboratory Operating Hours',
      value: 'Monday - Friday: 8:00 AM - 6:00 PM EST',
    },
  ];

  return (
    <PageShell
      seo={{
        title: 'Contact Us',
        description:
          'Get in touch with Tissue Bioengineering clinical headquarters, research facilities, and global medical outreach team.',
      }}
    >
      <PageHero
        breadcrumb={[{ label: 'Contact Us' }]}
        eyebrow="Global Headquarters"
        title="Get in Touch with Our Clinical Team"
        lead="Whether you have questions regarding patient care, academic research partnerships, or cleanroom facility tours."
        className="border-b-0"
      />

      <section className="pb-14 sm:pb-24 lg:pb-32" aria-label="Contact details and form">
        <div className="cf-container grid items-start gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* Contact details */}
          <div>
            <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-[-0.03em] text-cf-text">
              <Building2 className="h-5 w-5 text-cf-accent" aria-hidden="true" /> Clinical Headquarters
            </h2>

            <dl className="mt-6 border-t border-cf-line">
              {details.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4 border-b border-cf-line py-6">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cf-accent" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="text-[13px] text-cf-muted">{label}</dt>
                    <dd className="mt-1.5 text-base text-cf-text [overflow-wrap:anywhere] sm:text-lg">
                      {href ? (
                        <a
                          href={href}
                          className="cf-focus rounded-sm underline-offset-4 transition-colors hover:text-cf-accent hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            {/* Urgent line: distinct color because it is an emergency contact */}
            <div className="mt-8 rounded-xl border border-rose-400/30 bg-rose-500/[0.06] p-6">
              <p className="flex items-center gap-2 text-base font-semibold text-rose-200">
                <Siren className="h-5 w-5 shrink-0 text-rose-300" aria-hidden="true" />
                Urgent Burn / Trauma Hotline
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-cf-text-2">
                Emergency transfer team available 24/7 for acute surgical consults:{' '}
                <a
                  href={tel(emergency)}
                  className="cf-focus whitespace-nowrap rounded-sm text-sm text-rose-200 underline underline-offset-4 hover:text-rose-100"
                >
                  {emergency}
                </a>
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
};
