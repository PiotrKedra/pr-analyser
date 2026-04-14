import {
  IconRocket,
  IconSparkles,
  IconShieldCheck,
} from '@tabler/icons-react';
import { Paragraph, SectionTitle, SubsectionTitle } from '@/components/ui/Text';

const cards = [
  {
    title: 'Impact (30%)',
    icon: IconRocket,
    description:
      'How much real value does the PR deliver? We evaluate functionality changes, architectural decisions, and performance improvements.',
  },
  {
    title: 'AI-Leverage (35%)',
    icon: IconSparkles,
    description:
      'Is this AI-generated code? We detect co-authored-by tags, prompt-driven patterns, and unusual size-to-coherence ratios.',
  },
  {
    title: 'Quality (35%)',
    icon: IconShieldCheck,
    description:
      'Does the code meet engineering standards? We check for focused changes, clean diffs, meaningful descriptions, and test coverage.',
  },
];

function WhatWeScoreSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <SectionTitle className="mb-8 text-center">What we score</SectionTitle>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="border-border rounded-xl border bg-white p-6 text-center"
          >
            <div className="bg-secondary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
              <card.icon size={24} className="text-primary" />
            </div>
            <SubsectionTitle className="mt-4">{card.title}</SubsectionTitle>
            <Paragraph className="text-muted-foreground mt-2 text-sm">
              {card.description}
            </Paragraph>
          </div>
        ))}
      </div>
    </section>
  );
}

export { WhatWeScoreSection };
