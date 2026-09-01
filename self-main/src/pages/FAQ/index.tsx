import React from 'react';
import { Breadcrumb, SectionHeader } from '../../components/common/States';
import { Accordion } from '../../components/common/Accordion';
import { FAQS } from '../../constants/mockData';

export const FAQ: React.FC = () => {
  return (
    <div className="bg-gov-bg-alt min-h-screen pb-12">
      <Breadcrumb items={[{ label: 'Portal FAQs' }]} />

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Answers to common questions regarding NGO registration, proposal submission processes, and application tracking."
          badge="Help Center"
        />

        <div className="bg-white border border-gov-border rounded-xl p-6 shadow-sm">
          <Accordion items={FAQS} />
        </div>
      </div>
    </div>
  );
};
