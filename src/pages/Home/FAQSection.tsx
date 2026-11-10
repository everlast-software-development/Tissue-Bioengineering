import React, { useState } from 'react';
import { FAQItem } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';

const faqList: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does autologous 3D bioprinting prevent graft rejection?',
    answer:
      'Because the bio-ink is formulated using the patient’s own skin fibroblasts and stem cells isolated via punch biopsy, the immune system recognizes the grafted tissue as self-tissue, completely bypassing organ rejection.',
  },
  {
    id: 'faq-2',
    question: 'What is the recovery timeframe for diabetic ulcer tissue grafting?',
    answer:
      'Most chronic non-healing diabetic foot ulcers achieve significant re-vascularization within 14 days and complete full-thickness wound closure within 3 to 5 weeks.',
  },
  {
    id: 'faq-3',
    question: 'Are treatments covered by medical insurance or clinical trial funds?',
    answer:
      'Many of our FDA-approved autologous therapies are covered under major health insurance plans, while experimental bio-printing protocols are sponsored through IRB clinical trial grants.',
  },
  {
    id: 'faq-4',
    question: 'Can 3D bioprinted cartilage restore severe facial asymmetry?',
    answer:
      'Yes, by utilizing high-resolution 3D CT scans, our bio-engineers construct patient-specific osteo-chondral scaffolds that permanently restore natural craniofacial symmetry without donor-site surgical trauma.',
  },
];

const FAQAccordion: React.FC<{ items: FAQItem[] }> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <ul className="border-y border-cf-line">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = `faq-button-${item.id}`;
        const panelId = `faq-panel-${item.id}`;
        return (
          <li key={item.id} className="border-t border-cf-line first:border-t-0">
            <h3 className="text-[17px] font-medium leading-snug sm:text-lg">
              <button
                id={buttonId}
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={`cf-focus flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-200 motion-reduce:transition-none ${
                  isOpen ? 'text-cf-text' : 'text-cf-text-2 hover:text-cf-text'
                }`}
              >
                <span>{item.question}</span>
                {/* +/− indicator: the vertical bar collapses when open */}
                <span aria-hidden="true" className="relative mt-1 h-4 w-4 shrink-0 text-cf-accent">
                  <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded bg-current" />
                  <span
                    className={`absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 rounded bg-current transition-transform duration-200 motion-reduce:transition-none ${
                      isOpen ? 'scale-y-0' : 'scale-y-100'
                    }`}
                  />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-7 pr-10 text-[15px] leading-relaxed text-cf-muted sm:text-base"
            >
              {item.answer}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export const FAQSection: React.FC = () => {
  return (
    <section className="cf-section relative bg-cf-bg" aria-labelledby="faq-heading">
      <div className="cf-container grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <SectionHeader
          id="faq-heading"
          layout="stack"
          eyebrow="Frequently Asked Questions"
          title="Clinical & Scientific Clarifications"
          subtitle="Everything you need to know about our autologous cell harvesting, 3D bioprinting process, and consultation protocols."
          className="mb-0 sm:mb-0"
        />

        <FAQAccordion items={faqList} />
      </div>
    </section>
  );
};
