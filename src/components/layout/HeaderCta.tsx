import React from 'react';
import { ArrowPillLink } from '@/components/common/ArrowPillLink';
import { useI18n } from '@/i18n/context';

/**
 * Header (lg+) Book Consultation: the arrow pill (components/common/ArrowPillLink.tsx) at 40px.
 *
 * `filled` (whether the Home hero's own primary button has scrolled away; Navbar.tsx,
 * src/lib/heroCta.ts) is exposed as `data-filled` but no longer changes the look.
 */
export const HeaderCta: React.FC<{ filled: boolean }> = ({ filled }) => {
  const { t } = useI18n();
  return (
    <ArrowPillLink to="/consultation" data-filled={filled || undefined}>
      {t.common.bookConsultation}
    </ArrowPillLink>
  );
};
