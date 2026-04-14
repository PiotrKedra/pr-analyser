import { IconLoader2 } from '@tabler/icons-react';
import { Paragraph, SectionTitle, SubsectionTitle } from '@/components/ui/Text';

function StepBadge({ number }: { number: number }) {
  return (
    <span className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold">
      {number}
    </span>
  );
}

function PasteUrlGraphic() {
  return (
    <div className="-ml-[15%] flex w-[130%] flex-col gap-3">
      <div className="border-border rounded-lg border bg-white px-4 py-3 text-sm text-gray-500">
        https://github.com/vercel/next.js
      </div>
      <div className="bg-primary text-primary-foreground flex h-10 items-center justify-center rounded-lg px-[50px] text-[17px] font-medium">
        Analyse
      </div>
    </div>
  );
}

function AiAnalysisGraphic() {
  return (
    <div className="flex translate-x-8 flex-col gap-3">
      <div className="mb-1 flex items-center justify-center">
        <IconLoader2 size={36} className="text-primary" />
      </div>
      {['fix: resolve auth redirect loop', 'feat: add dark mode toggle'].map(
        (label) => (
          <div key={label} className="flex items-center gap-3 text-base">
            <span className="text-green-600">&#10003;</span>
            <span className="text-muted-foreground truncate">{label}</span>
          </div>
        ),
      )}
      <div className="flex items-center gap-3 text-base">
        <IconLoader2 size={20} className="text-primary" />
        <span className="text-muted-foreground truncate">
          refactor: extract API client
        </span>
      </div>
    </div>
  );
}

function ScorecardGraphic() {
  const rows = [
    { pr: 'Auth fix', impact: 82, ai: 45, quality: 91 },
    { pr: 'Dark mode', impact: 68, ai: 88, quality: 74 },
    { pr: 'API client', impact: 91, ai: 72, quality: 85 },
  ];

  return (
    <table className="w-[160%] translate-x-4 text-sm">
      <thead>
        <tr className="text-muted-foreground border-b border-gray-200">
          <th className="pb-2 text-left font-medium">PR</th>
          <th className="pb-2 text-right font-medium">Impact</th>
          <th className="pb-2 text-right font-medium">AI</th>
          <th className="pb-2 text-right font-medium">Quality</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.pr} className="border-b border-gray-100">
            <td className="py-2.5 text-left">{row.pr}</td>
            <td className="py-2.5 text-right">{row.impact}</td>
            <td className="py-2.5 text-right">{row.ai}</td>
            <td className="py-2.5 text-right">{row.quality}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const steps = [
  {
    number: 1,
    title: 'Paste a repository URL',
    description:
      'Enter any public GitHub repository link. We automatically find the most recent merged pull requests to analyse.',
    graphic: <PasteUrlGraphic />,
  },
  {
    number: 2,
    title: 'AI analyses every PR',
    description:
      'Our engine reads diffs, descriptions, and metadata from up to 20 merged pull requests — scoring each one in seconds.',
    graphic: <AiAnalysisGraphic />,
  },
  {
    number: 3,
    title: 'Get your scorecard',
    description:
      'View a detailed breakdown of impact, AI leverage, and code quality for every pull request in the repo.',
    graphic: <ScorecardGraphic />,
  },
];

function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-5xl px-4">
      <SectionTitle className="mb-[23px] sm:mb-[45px]">
        How it works
      </SectionTitle>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="group">
            <div className="border-border relative h-[200px] overflow-hidden rounded-xl border bg-white p-6">
              <div className="absolute top-4 left-4">
                <StepBadge number={step.number} />
              </div>
              <div className="flex h-full items-center justify-center pt-8">
                {step.graphic}
              </div>
            </div>
            <SubsectionTitle className="mt-4">{step.title}</SubsectionTitle>
            <Paragraph className="text-muted-foreground mt-2 text-sm">
              {step.description}
            </Paragraph>
          </div>
        ))}
      </div>
    </section>
  );
}

export { HowItWorksSection };
