import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  // Store the currently active open item ID. Only one item open at a time.
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `accordion-panel-${item.id}`;
        const headerId = `accordion-header-${item.id}`;

        return (
          <div
            key={item.id}
            className="border border-gov-border rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-200"
          >
            {/* Header Trigger */}
            <button
              id={headerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 text-left font-medium text-gov-charcoal hover:bg-gov-bg-alt focus:outline-none transition-colors group"
            >
              <span className="text-sm md:text-base pr-4 group-hover:text-gov-navy transition-colors">
                {item.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gov-muted transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? 'transform rotate-180 text-gov-navy' : ''
                }`}
              />
            </button>

            {/* Collapsible Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <div className="px-4 pb-4 pt-1 text-sm text-gov-muted leading-relaxed border-t border-gov-border/50 bg-gov-bg-alt/30">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
