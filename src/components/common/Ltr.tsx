import React from 'react';

/**
 * Keeps a phone number, email address, URL, DOI or other left-to-right token in its own
 * direction inside right-to-left text (an isolated `dir="ltr"` run), so `+971…` never
 * renders as `…971+`. No effect on English pages.
 */
export const Ltr: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <bdi dir="ltr" className={className}>
    {children}
  </bdi>
);
