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
    <section className="w-full bg-white pt-[6.5rem] pb-[6.5rem]">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-[23px] text-center sm:mb-[45px]">
          <SectionTitle>Your results at a glance</SectionTitle>
          <Paragraph className="text-muted-foreground mt-3 text-sm">
            See exactly how each pull request performs across three key
            dimensions.
          </Paragraph>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`border-border overflow-hidden rounded-xl border p-0 ${card.span}`}
            >
              <div className="bg-muted h-32 w-full" />
              <div className="p-6 pt-4">
                <SubsectionTitle>{card.title}</SubsectionTitle>
                <Paragraph className="text-muted-foreground mt-2 text-sm">
                  {card.description}
                </Paragraph>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { DashboardPreviewSection };
