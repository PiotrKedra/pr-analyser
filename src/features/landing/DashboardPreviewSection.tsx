import { Paragraph, SectionTitle, SubsectionTitle } from '@/components/ui/Text';

const cards = [
  {
    title: 'Repository overview',
    description:
      'Overall scores for impact, AI leverage, and code quality aggregated across all analysed pull requests.',
    span: 'md:col-span-2',
  },
  {
    title: 'Score breakdown',
    description:
      'Visual charts showing how each dimension contributes to the total score.',
    span: '',
  },
  {
    title: 'PR-level detail',
    description:
      'Drill into individual pull requests with per-PR scores and AI-generated summaries.',
    span: '',
  },
  {
    title: 'Actionable recommendations',
    description:
      'Specific suggestions to improve PR quality, leverage AI more effectively, and increase impact.',
    span: 'md:col-span-2',
  },
];

function DashboardPreviewSection() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto max-w-5xl px-4">
        <SectionTitle className="mb-8 text-center">
          Your results at a glance
        </SectionTitle>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`border-border rounded-xl border p-6 ${card.span}`}
            >
              <div className="bg-muted h-32 w-full rounded-lg" />
              <SubsectionTitle className="mt-4">{card.title}</SubsectionTitle>
              <Paragraph className="text-muted-foreground mt-2 text-sm">
                {card.description}
              </Paragraph>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { DashboardPreviewSection };
