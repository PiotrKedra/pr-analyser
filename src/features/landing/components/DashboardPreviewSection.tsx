import { cn } from '@/lib/utils';
import { Paragraph, SectionTitle, SubsectionTitle } from '@/components/ui/Text';
import { ScoreRing } from '@/components/ui/ScoreRing';

function barColor(score: number): string {
  if (score >= 80) return 'bg-success';
  if (score >= 50) return 'bg-foreground';
  return 'bg-destructive';
}

function textScoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 50) return 'text-foreground';
  return 'text-destructive';
}

function RepositoryOverviewGraphic() {
  const bars = [
    { label: 'Impact', score: 82 },
    { label: 'AI Leverage', score: 65 },
    { label: 'Quality', score: 84 },
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      {bars.map(({ label, score }) => (
        <div key={label}>
          <div className="text-muted-foreground mb-1 flex justify-between text-xs">
            <span>{label}</span>
            <span>{score}</span>
          </div>
          <div className="bg-muted h-2 rounded-full">
            <div
              className={`${barColor(score)} h-2 rounded-full`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoreBreakdownGraphic() {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-muted-foreground text-xs">Overall Score</span>
      <ScoreRing score={78} size={110} strokeWidth={9} />
    </div>
  );
}

function PrDetailGraphic() {
  const rows = [
    { id: 12, title: 'fix: auth redirect loop', score: 91 },
    { id: 11, title: 'feat: dark mode toggle', score: 74 },
    { id: 10, title: 'refactor: API client', score: 85 },
    { id: 9, title: 'chore: update deps', score: 62 },
  ];

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-muted-foreground border-border border-b">
          <th className="pb-2 text-left font-medium">#</th>
          <th className="pb-2 text-left font-medium">Title</th>
          <th className="pb-2 text-right font-medium">Score</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-border/50 border-b">
            <td className="text-muted-foreground py-2 text-left">#{row.id}</td>
            <td className="py-2 text-left">{row.title}</td>
            <td
              className={`py-2 text-right font-bold ${textScoreColor(row.score)}`}
            >
              {row.score}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RecommendationsGraphic() {
  const items = [
    'Add unit tests for critical auth flows to improve quality score.',
    'Include PR descriptions that explain the "why" behind changes.',
    'Break large PRs into smaller, focused changesets for easier review.',
    'Use AI-assisted refactoring tools to boost leverage metrics.',
  ];

  return (
    <div className="w-full">
      <p className="text-foreground mb-2 text-sm font-semibold">
        Top recommendations
      </p>
      <ol className="text-foreground list-inside list-decimal space-y-3 text-sm whitespace-nowrap">
        {items.map((item, i) => (
          <li key={i} className="text-muted-foreground">
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}

const cards = [
  {
    title: 'Repository overview',
    description:
      'Overall scores for impact, AI leverage, and code quality aggregated across all analysed pull requests.',
    span: 'md:col-span-2',
    graphic: <RepositoryOverviewGraphic />,
  },
  {
    title: 'Score breakdown',
    description:
      'Visual charts showing how each dimension contributes to the total score.',
    span: '',
    graphic: <ScoreBreakdownGraphic />,
  },
  {
    title: 'PR-level detail',
    description:
      'Drill into individual pull requests with per-PR scores and AI-generated summaries.',
    span: '',
    graphic: <PrDetailGraphic />,
  },
  {
    title: 'Actionable recommendations',
    description:
      'Specific suggestions to improve PR quality, leverage AI more effectively, and increase impact.',
    span: 'md:col-span-2',
    graphic: <RecommendationsGraphic />,
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
              className={cn(
                'border-border overflow-hidden rounded-xl border p-0',
                card.span,
              )}
            >
              <div className="flex h-[180px] items-center justify-center bg-white p-6">
                {card.graphic}
              </div>
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
