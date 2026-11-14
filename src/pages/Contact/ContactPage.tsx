import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { HeroBackdrop, PageHero } from '@/components/common/PageHero';
import { Ltr } from '@/components/common/Ltr';
import { ContactForm } from './ContactForm';
import { SITE_METADATA } from '@/lib/site';
import { useI18n, useMessages } from '@/i18n/context';
import { contactMessages } from './messages';
import { MapPin, Phone, Mail, Globe, Building2, Siren } from 'lucide-react';

/** tel: link in the same form the consultation CTA uses. */
const tel = (phone: string) => `tel:${phone}`;

export const ContactPage: React.FC = () => {
  const { t: common } = useI18n();
  const t = useMessages(contactMessages);
  const { phone, email, emergency } = SITE_METADATA.contact;
  const provider = SITE_METADATA.treatmentProvider;
  const providerName = common.site.providerName;

  const details: {
    icon: typeof MapPin;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
    /** Phone numbers, emails and URLs stay left-to-right in Arabic. */
    ltr?: boolean;
  }[] = [
    {
      icon: MapPin,
      label: t.labels.location,
      value: `${providerName}${common.common.listSeparator}${common.site.providerAddress}`,
    },
    {
      icon: Globe,
      label: t.labels.website,
      value: provider.website.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      href: provider.website,
      external: true,
      ltr: true,
    },
    { icon: Phone, label: t.labels.phone, value: phone, href: tel(phone), ltr: true },
    { icon: Mail, label: t.labels.email, value: email, href: `mailto:${email}`, ltr: true },
  ];

  return (
    <PageShell seo={t.seo}>
      {/* The hero's cellular backdrop spans the hero and the details/form section, so it reads as
          one continuous hero instead of a strip that ends at the hero's bottom edge. It dissolves
          into the page background toward the bottom. */}
      <div className="relative isolate">
        <HeroBackdrop className="cf-hero-backdrop-fade overflow-hidden" />

        <PageHero
          breadcrumb={[{ label: t.breadcrumb }]}
          eyebrow={t.eyebrow}
          title={t.title}
          lead={t.lead}
          className="border-b-0"
        />

        <section className="pb-14 sm:pb-24 lg:pb-32" aria-label={t.sectionLabel}>
          <div className="cf-container grid items-start gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">
            {/* Contact details */}
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-[-0.03em] text-cf-text">
                <Building2 className="h-5 w-5 text-cf-accent" aria-hidden="true" /> {t.infoTitle}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-cf-text-2">
                {t.infoBody(providerName)}
              </p>

              <dl className="mt-6 border-t border-cf-line">
                {details.map(({ icon: Icon, label, value, href, external, ltr }) => {
                  const text = ltr ? <Ltr>{value}</Ltr> : value;
                  return (
                    <div key={label} className="flex gap-4 border-b border-cf-line py-6">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cf-accent" aria-hidden="true" />
                      <div className="min-w-0">
                        <dt className="text-[13px] text-cf-muted">{label}</dt>
                        <dd className="mt-1.5 text-base text-cf-text [overflow-wrap:anywhere] sm:text-lg">
                          {href ? (
                            <a
                              href={href}
                              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                              className="cf-focus rounded-sm underline-offset-4 transition-colors hover:text-cf-accent hover:underline"
                            >
                              {text}
                            </a>
                          ) : (
                            text
                          )}
                        </dd>
                      </div>
                    </div>
                  );
                })}
              </dl>

              {/* Urgent line: distinct color because it is an emergency contact */}
              <div className="mt-8 rounded-xl border border-rose-400/30 bg-rose-500/[0.06] p-6">
                <p className="flex items-center gap-2 text-base font-semibold text-rose-200">
                  <Siren className="h-5 w-5 shrink-0 text-rose-300" aria-hidden="true" />
                  {t.urgentTitle}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-cf-text-2">
                  {t.urgentBody}{' '}
                  <a
                    href={tel(emergency)}
                    className="cf-focus whitespace-nowrap rounded-sm text-sm text-rose-200 underline underline-offset-4 hover:text-rose-100"
                  >
                    <Ltr>{emergency}</Ltr>
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
      </div>
    </PageShell>
  );
};
