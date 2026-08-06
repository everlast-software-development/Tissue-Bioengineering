import React from 'react';
import { SectionTitle } from '@/components/common/SectionTitle';
import { FAQAccordion } from '@/components/common/Accordion';
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

export const FAQSection: React.FC = () => {
  return (
    <section className="py-20 relative bg-white border-t border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
