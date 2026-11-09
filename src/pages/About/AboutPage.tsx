import React from 'react';
import { Dna, Award } from 'lucide-react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { SectionHeader } from '@/pages/Home/SectionHeader';

/** "Dr. Elena Rostova, PhD" -> "ER": drops the leading title and trailing credentials. */
const getInitials = (name: string) =>
  name
    .split(',')[0]
    .replace(/^(Dr|Prof)\.\s+/, '')
    .split(/\s+/)
    .map((part) => part[0])
    .join('');

const FACTS = [
  { icon: Dna, value: 'ISO Class 5', label: 'Sterile Cleanrooms' },
  { icon: Award, value: '18+ Patents', label: 'Bio-ink Innovations' },
];

/* Only authentic, approved headshots belong in `img`; until one is supplied, the roster shows initials. */
const LEADERSHIP: { name: string; role: string; bio: string; img?: string }[] = [
  {
    name: 'Dr. Aris Thorne, MD, PhD',
    role: 'Chief Scientific Officer & Co-Founder',
    bio: 'Pioneer in 3D bioprinting micro-vascular networks with over 20 years in plastic surgery innovation.',
  },
  {
    name: 'Dr. Elena Rostova, PhD',
    role: 'Head of Regenerative Therapeutics',
    bio: 'Specialist in umbilical mesenchymal stem cell paracrine factors and purified exosome delivery.',
  },
  {
    name: 'Dr. Michael Chen, MD',
    role: 'Director of Clinical Surgery',
    bio: 'Leading reconstructive surgeon focused on diabetic lower limb salvage and complex burn care.',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <PageShell
      seo={{
        title: 'About Us',
        description:
          "Learn about Tissue Bioengineering's mission, executive team, cleanroom infrastructure, and clinical breakthroughs in stem cell therapies.",
      }}
      cta
    >
      <PageHero
        breadcrumb={[{ label: 'About Tissue Bioengineering' }]}
        eyebrow="Our Mission & Legacy"
        title={
          <>
            Redefining Healing Through{' '}
            <span className="text-cf-accent">Living Tissue Architecture</span>
          </>
        }
        titleClassName="max-w-[17ch]"
        lead="Founded by world-renowned reconstructive surgeons and stem cell bioengineers, Tissue Bioengineering bridges fundamental cellular biology with clinical plastic surgery."
      >
        <figure className="mt-14 overflow-hidden rounded-xl border border-cf-line bg-cf-panel sm:mt-20">
          <img
            src="/images/cell-culture-biosafety-cabinet.webp"
            alt="Scientist working with cell cultures inside a biosafety cabinet"
            width={1600}
            height={1066}
            fetchPriority="high"
            decoding="async"
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/8] lg:aspect-[21/9]"
          />
        </figure>
      </PageHero>

      {/* Benchtop & bedside: essay column with the two facility facts */}
      <section className="cf-section border-b border-cf-line bg-cf-raised" aria-labelledby="bridge-heading">
        <div className="cf-container grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <h2 id="bridge-heading" className="cf-h2 max-w-[14ch]">
            Bridging the Gap Between Benchtop & Bedside
          </h2>

          <div>
            <p className="text-lg leading-relaxed text-cf-text-2 sm:text-xl sm:leading-relaxed">
              Traditional reconstructive techniques rely on harvesting donor skin from uninjured
              body parts, leaving painful donor sites and disfiguring scars. Our tissue
              bioengineering approach eliminates donor-site morbidity by creating full-thickness
              skin grafts in 3D bioprinted matrices seeded with autologous stem cells.
            </p>

            <dl className="mt-12 grid border-y border-cf-line sm:grid-cols-2">
              {FACTS.map(({ icon: Icon, value, label }, i) => (
                <div
                  key={value}
                  className={`flex items-start gap-5 py-8 ${
                    i === 0 ? 'border-b border-cf-line sm:border-b-0 sm:border-r sm:pr-8' : 'sm:pl-8'
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cf-accent/40 text-cf-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col-reverse">
                    <dt className="mt-2 text-sm text-cf-muted">{label}</dt>
                    <dd className="text-[28px] font-light leading-none tracking-[-0.04em] text-cf-text sm:text-[34px]">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Leadership roster: ruled columns, initials monograms */}
      <section className="cf-section" aria-labelledby="leadership-heading">
        <div className="cf-container">
          <SectionHeader
            id="leadership-heading"
            eyebrow="Scientific Leadership"
            title="World-Class Bioengineers & Surgeons"
            subtitle="Our multidisciplinary board combines plastic surgery pioneers, microfluidics experts, and stem cell scientists."
          />

          <ul className="grid border-t border-cf-line md:grid-cols-3">
            {LEADERSHIP.map((member, i) => (
              <li
                key={member.name}
                className={`border-cf-line py-10 md:px-8 md:first:pl-0 md:last:pr-0 lg:px-10 ${
                  i > 0 ? 'border-t md:border-l md:border-t-0' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  {member.img ? (
                    <img
                      src={member.img}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      className="h-16 w-16 rounded-lg border border-cf-line-strong object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-16 w-16 items-center justify-center rounded-lg border border-cf-line-strong bg-cf-panel font-geist-mono text-lg text-cf-accent"
                    >
                      {getInitials(member.name)}
                    </span>
                  )}
                  <span className="cf-mono" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.015em] text-cf-text">
                  {member.name}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-cf-accent">{member.role}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-cf-muted">{member.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
};
