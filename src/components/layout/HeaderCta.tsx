import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';

/**
 * Header (lg+) Book Consultation: a label pill with an arrow disc attached (styles and motion in
 * the "Site header, desktop" block of src/index.css). Light label, cyan disc; on hover or keyboard
 * focus the label slowly turns the disc's cyan and the arrow slides out through the disc while a
 * second one slides in after it; in Arabic the arrow points and travels the other way.
 *
 * `filled` (whether the Home hero's own primary button has scrolled away; Navbar.tsx,
 * src/lib/heroCta.ts) is exposed as `data-filled` but no longer changes the look.
 */
export const HeaderCta: React.FC<{ filled: boolean }> = ({ filled }) => {
  const { t } = useI18n();
  return (
    <Link to="/consultation" data-filled={filled || undefined} className="hdr-cta cf-focus">
      <span className="hdr-cta__label">{t.common.bookConsultation}</span>
      <span aria-hidden="true" className="hdr-cta__icon">
        <span className="hdr-cta__arrow hdr-cta__arrow--out">
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
        </span>
        <span className="hdr-cta__arrow hdr-cta__arrow--in">
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
        </span>
      </span>
    </Link>
  );
};
