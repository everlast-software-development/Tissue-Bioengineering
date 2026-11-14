import React from 'react';
import { Link as RouterLink, type LinkProps, type To } from 'react-router-dom';
import type { Locale } from './config';
import { localizePath } from './config';
import { useI18n } from './context';

function localizeTo(to: To, locale: Locale): To {
  if (typeof to === 'string') return localizePath(to, locale);
  if (to.pathname) return { ...to, pathname: localizePath(to.pathname, locale) };
  return to;
}

/**
 * react-router's <Link> for site pages: write the locale-neutral path (`/about`,
 * `/services#slug`) and it points at the current language's version (`/ar/about` in Arabic).
 * External URLs pass through unchanged.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, ...props },
  ref
) {
  const { locale } = useI18n();
  return <RouterLink ref={ref} to={localizeTo(to, locale)} {...props} />;
});
