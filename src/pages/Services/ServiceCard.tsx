import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Activity, ShieldCheck, Sparkles, Zap, Box, Dna } from 'lucide-react';
import { Service } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Flame,
  Activity,
  ShieldCheck,
  Sparkles,
  Zap,
  Box,
  Dna,
};

/**
 * One therapy as a ruled editorial row ("dossier"): image left, description, features and
 * timings right. The row carries `id={slug}` so /services#<slug> links land on it.
 */
export const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const Icon = iconMap[service.iconName] || Dna;

  return (
    <article
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      className="grid scroll-mt-40 gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:gap-x-14 lg:py-20 xl:gap-x-20"
    >
      <figure className="relative lg:col-span-5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-cf-line bg-cf-panel lg:sticky lg:top-44">
          <img
            src={service.image}
            alt={service.imageAlt ?? service.title}
            width={1200}
            height={900}
            loading={index === 0 ? undefined : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover"
          />
          <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-cf-bg/80 text-cf-accent backdrop-blur-md">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
      </figure>

      <div className="min-w-0 lg:col-span-7">
        <div className="flex items-center gap-4">
          <span className="cf-mono" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="h-px w-8 bg-cf-line-strong" aria-hidden="true" />
          <span className="text-[13px] font-medium text-cf-accent">{service.category}</span>
        </div>

        <h2
          id={`${service.slug}-title`}
          className="mt-5 text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] text-cf-text sm:text-4xl"
        >
          {service.title}
        </h2>

        <p className="mt-5 text-lg leading-relaxed text-cf-text-2">{service.shortDescription}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-cf-muted">{service.fullDescription}</p>

        <ul className="mt-8 grid gap-x-8 border-t border-cf-line sm:grid-cols-2">
          {service.features.map((feat) => (
            <li
              key={feat}
              className="flex items-start gap-3 border-b border-cf-line py-3.5 text-[15px] text-cf-text-2"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cf-accent"
                aria-hidden="true"
              />
              {feat}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-cf-line bg-cf-line sm:min-w-[360px]">
            <div className="bg-cf-bg px-4 py-3">
              <dt className="text-xs text-cf-muted">Duration:</dt>
              <dd className="mt-1 font-geist-mono text-[13px] text-cf-text">
                {service.treatmentDuration}
              </dd>
            </div>
            <div className="bg-cf-bg px-4 py-3">
              <dt className="text-xs text-cf-muted">Recovery:</dt>
              <dd className="mt-1 font-geist-mono text-[13px] text-cf-text">
                {service.recoveryPeriod}
              </dd>
            </div>
          </dl>

          <Link to="/consultation" className="cf-link min-h-11 shrink-0 text-sm">
            Request Consultation
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};
