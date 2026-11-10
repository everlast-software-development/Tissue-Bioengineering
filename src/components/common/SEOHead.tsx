import React from 'react';
import { SITE_METADATA } from '@/lib/site';

const KEYWORDS =
  'Tissue Engineering, 3D Bioprinting, Regenerative Medicine, Stem Cells, Burn Scar Treatment, Diabetic Foot Ulcer';

interface SEOHeadProps {
  /** Page title; suffixed with the site name. */
  title?: string;
  /** Meta description; the site description if omitted. */
  description?: string;
}

/**
 * Page title and meta tags. React 19 hoists <title> and <meta> rendered anywhere in the tree
 * into <head>, and removes them when the component unmounts.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({ title, description = SITE_METADATA.description }) => {
  const pageTitle = title ? `${title} | ${SITE_METADATA.name}` : SITE_METADATA.name;

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={KEYWORDS} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </>
  );
};
