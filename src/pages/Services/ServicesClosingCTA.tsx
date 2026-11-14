import React from 'react';
import { Calendar, PhoneCall } from 'lucide-react';
import { SITE_METADATA } from '@/lib/site';
import { CellField } from '@/components/common/CellField';
import { Ltr } from '@/components/common/Ltr';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';

/** Splits off the last word so it can be kept on one line ("Bio-Grafting" never breaks at its hyphen). */
const splitLastWord = (text: string): [string, string] => {
  const i = text.lastIndexOf(' ');
  return i === -1 ? ['', text] : [text.slice(0, i + 1), text.slice(i + 1)];
};

/**
 * Closing consultation band for the Services page. Same copy and destinations as the shared
 * CTASection (components/common/CTASection.tsx, both read `cta` from the dictionaries). It has
 * its own layout so it can close the page with the hero's cellular texture instead of a photo
 * (the shared band's SEM image is already shown by service 03 on this page).
 */
export const ServicesClosingCTA: React.FC = () => {
  const { t } = useI18n();
  const [accentStart, accentEnd] = splitLastWord(t.cta.titleAccent);
  return (
    <section className="bg-cf-bg py-14 sm:py-24 lg:py-28" aria-labelledby="cta-heading">
      <div className="cf-container">
        <div className="relative isolate overflow-hidden rounded-2xl border border-cf-line-strong bg-cf-raised">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="svc-glow-cta absolute inset-0" />
            <CellField className="svc-cells-cta absolute inset-0 h-full w-full text-cf-accent" />
          </div>

          <div className="grid gap-10 p-7 sm:p-12 lg:grid-cols-12 lg:items-end lg:gap-16 lg:p-16">
            <div className="lg:col-span-7">
              <p className="cf-eyebrow">{t.cta.eyebrow}</p>
              <h2 id="cta-heading" className="cf-h2 max-w-[17ch]">
                {t.cta.titleBefore}
                <span className="svc-gradient-text">
                  {accentStart}
                  <span className="whitespace-nowrap">{accentEnd}</span>
                </span>
                {t.cta.titleAfter}
              </h2>
              <p className="cf-lead mt-6 max-w-xl">{t.cta.lead}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:flex-col lg:border-s lg:border-cf-line lg:ps-12">
              <Link to="/consultation" className="cf-btn cf-btn-primary min-h-[52px]">
                <Calendar className="h-5 w-5" aria-hidden="true" />
                {t.common.bookConsultationNow}
              </Link>
              <a
                href={`tel:${SITE_METADATA.contact.phone}`}
                className="cf-btn min-h-[52px] border border-cf-line-strong bg-cf-bg/40 py-2 text-cf-text hover:border-cf-accent hover:text-cf-accent"
              >
                <PhoneCall className="h-5 w-5 shrink-0 text-cf-accent" aria-hidden="true" />
                <span className="flex flex-wrap justify-center gap-x-1.5">
                  <span>{t.common.callHotline}</span>
                  <Ltr className="whitespace-nowrap">{SITE_METADATA.contact.phone}</Ltr>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
