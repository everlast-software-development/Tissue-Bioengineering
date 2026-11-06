import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Dna, Award } from 'lucide-react';

/** "Dr. Elena Rostova, PhD" -> "ER": drops the leading title and trailing credentials. */
const getInitials = (name: string) =>
  name
    .split(',')[0]
    .replace(/^(Dr|Prof)\.\s+/, '')
    .split(/\s+/)
    .map((part) => part[0])
    .join('');

export const AboutPage: React.FC = () => {
  return (
    <PageShell
      seo={{
        title: 'About Us',
        description:
          "Learn about Tissue Bioengineering's mission, executive team, cleanroom infrastructure, and clinical breakthroughs in stem cell therapies.",
      }}
      breadcrumb="About Tissue Bioengineering"
      cta
    >
      {/* Hero Header */}
      <div className="py-12 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-navy uppercase tracking-widest px-3.5 py-1 rounded-full bg-sky border border-steel/20 shadow-xs">
          Our Mission & Legacy
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-navy mt-4">
          Redefining Healing Through <span className="text-steel">Living Tissue Architecture</span>
        </h1>
        <p className="mt-4 text-base text-text-secondary leading-relaxed">
          Founded by world-renowned reconstructive surgeons and stem cell bioengineers, Tissue
          Bioengineering bridges fundamental cellular biology with clinical plastic surgery.
        </p>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-10 items-center py-12">
        <div className="space-y-6 xl:col-span-5">
          <h2 className="text-2xl font-bold text-navy">
            Bridging the Gap Between Benchtop & Bedside
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Traditional reconstructive techniques rely on harvesting donor skin from uninjured body
            parts, leaving painful donor sites and disfiguring scars. Our tissue bioengineering
            approach eliminates donor-site morbidity by creating full-thickness skin grafts in 3D
            bioprinted matrices seeded with autologous stem cells.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="card-navy p-4 flex items-center space-x-3 bg-white">
              <Dna className="w-8 h-8 text-navy shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-navy">ISO Class 5</h4>
                <span className="text-xs text-text-muted">Sterile Cleanrooms</span>
              </div>
            </div>
            <div className="card-navy p-4 flex items-center space-x-3 bg-white">
              <Award className="w-8 h-8 text-navy shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-navy">18+ Patents</h4>
                <span className="text-xs text-text-muted">Bio-ink Innovations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-navy overflow-hidden p-2 relative group bg-white xl:col-span-7">
          <img
            src="/images/cell-culture-biosafety-cabinet.webp"
            alt="Scientist working with cell cultures inside a biosafety cabinet"
            width={1600}
            height={1066}
            className="w-full h-[400px] xl:h-[440px] object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Leadership Team */}
      <div className="py-16">
        <SectionTitle
          badge="Scientific Leadership"
          title="World-Class Bioengineers & Surgeons"
          subtitle="Our multidisciplinary board combines plastic surgery pioneers, microfluidics experts, and stem cell scientists."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Only authentic, approved headshots belong in `img`; until one is supplied, the card shows initials. */}
          {(
            [
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
            ] as { name: string; role: string; bio: string; img?: string }[]
          ).map((member, i) => (
            <div key={i} className="card-navy card-navy-hover p-6 text-center group bg-white">
              {member.img ? (
                <img
                  src={member.img}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-navy mb-4 group-hover:scale-105 transition-transform shadow-xs"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="w-24 h-24 rounded-full mx-auto bg-sky text-navy text-2xl font-bold flex items-center justify-center border-2 border-navy mb-4 group-hover:scale-105 transition-transform shadow-xs"
                >
                  {getInitials(member.name)}
                </div>
              )}
              <h3 className="text-lg font-bold text-navy">{member.name}</h3>
              <span className="text-xs font-bold text-steel block mb-2">{member.role}</span>
              <p className="text-xs text-text-secondary leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};
