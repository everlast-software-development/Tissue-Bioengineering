import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Dna, Award } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-12">
        <div className="space-y-6">
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

        <div className="card-navy overflow-hidden p-2 relative group bg-white">
          <img
            src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80"
            alt="Tissue Engineering Cleanroom Laboratory"
            className="w-full h-[400px] object-cover rounded-xl"
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
          {[
            {
              name: 'Dr. Aris Thorne, MD, PhD',
              role: 'Chief Scientific Officer & Co-Founder',
              bio: 'Pioneer in 3D bioprinting micro-vascular networks with over 20 years in plastic surgery innovation.',
              img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
            },
            {
              name: 'Dr. Elena Rostova, PhD',
              role: 'Head of Regenerative Therapeutics',
              bio: 'Specialist in umbilical mesenchymal stem cell paracrine factors and purified exosome delivery.',
              img: 'https://images.unsplash.com/photo-1594824813570-8263158c30a8?auto=format&fit=crop&w=400&q=80',
            },
            {
              name: 'Dr. Michael Chen, MD',
              role: 'Director of Clinical Surgery',
              bio: 'Leading reconstructive surgeon focused on diabetic lower limb salvage and complex burn care.',
              img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
            },
          ].map((member, i) => (
            <div key={i} className="card-navy card-navy-hover p-6 text-center group bg-white">
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-navy mb-4 group-hover:scale-105 transition-transform shadow-xs"
              />
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
