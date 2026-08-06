import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_METADATA } from '@/constants';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = SITE_METADATA.description,
  keywords = 'Tissue Engineering, 3D Bioprinting, Regenerative Medicine, Stem Cells, Burn Scar Treatment, Diabetic Foot Ulcer',
  canonicalUrl,
}) => {
  const pageTitle = title ? `${title} | ${SITE_METADATA.name}` : SITE_METADATA.name;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};
