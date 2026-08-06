import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '@/types';

export const FAQAccordion: React.FC<{ items: FAQItem[] }> = ({ items }) => {
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
