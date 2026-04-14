import { SmallTitle, Paragraph } from '@/components/ui/Text';

type ScoreOverviewProps = {
  totalScore: number;
  impact: number;
  aiLeverage: number;
  quality: number;
  recommendations: string[];
};

const subScores = [
  { label: 'Impact', weight: '20%', key: 'impact' },
  { label: 'AI Leverage', weight: '40%', key: 'aiLeverage' },
  { label: 'Quality', weight: '40%', key: 'quality' },
] as const;

function scoreColor(score: number): string {
  if (score >= 80) return 'bg-success';
  if (score >= 50) return 'bg-foreground';
  return 'bg-destructive';
}

function ScoreOverview({
  totalScore,
  impact,
  aiLeverage,
  quality,
  recommendations,
}: ScoreOverviewProps) {
  const scores = { impact, aiLeverage, quality };

  return (
    <div className="border-border rounded-xl border bg-white p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
        <div className="text-center sm:text-left">
          <Paragraph className="text-muted-foreground mb-1">
            Overall Score
          </Paragraph>
          <p className="text-foreground text-5xl font-bold tracking-tight">
            {totalScore}
            <span className="text-muted-foreground text-2xl font-normal">
              /100
            </span>
          </p>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-4">
          {subScores.map(({ label, weight, key }) => {
            const value = scores[key];
            return (
              <div key={key}>
                <Paragraph className="text-muted-foreground mb-1 text-sm">
                  {label}{' '}
                  <span className="text-muted-foreground/60">({weight})</span>
                </Paragraph>
                <p className="text-foreground mb-2 text-2xl font-bold">
                  {value}
                </p>
                <div className="bg-muted h-2 rounded-full">
                  <div
                    className={`${scoreColor(value)} h-2 rounded-full transition-all`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {recommendations.length > 0 && (
        <>
          <div className="border-border my-6 border-t" />
          <SmallTitle className="mb-3">Recommendations</SmallTitle>
          <ol className="text-foreground list-inside list-decimal space-y-2 text-sm">
            {recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

export { ScoreOverview };
