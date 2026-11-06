import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { FAQItem } from '@/types';

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
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`card-navy overflow-hidden transition-all bg-white ${
              isOpen ? 'border-steel/50 shadow-md' : 'hover:border-border-light'
            }`}
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-navy text-sm md:text-base focus:outline-none"
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-navy group-hover:text-steel shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-steel' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-text-secondary leading-relaxed border-t border-border-light bg-slate-50">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const FAQSection: React.FC = () => {
  return (
    <section className="py-20 relative bg-white border-t border-border-light">
      <div className="container-site">
        <SectionTitle
          badge="Frequently Asked Questions"
          title="Clinical & Scientific Clarifications"
          subtitle="Everything you need to know about our autologous cell harvesting, 3D bioprinting process, and consultation protocols."
        />

        <FAQAccordion items={faqList} />
      </div>
    </section>
  );
};
