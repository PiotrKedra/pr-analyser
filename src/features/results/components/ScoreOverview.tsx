'use client';

import { useState, useEffect } from 'react';
import { SmallTitle, Paragraph } from '@/components/ui/Text';
import { ScoreRing } from '@/components/ui/ScoreRing';

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
  const [barsAnimated, setBarsAnimated] = useState(false);
  const scores = { impact, aiLeverage, quality };

  useEffect(() => {
    const id = requestAnimationFrame(() => setBarsAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="border-border rounded-xl border bg-white p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <Paragraph className="text-muted-foreground mb-2">
            Overall Score
          </Paragraph>
          <ScoreRing score={totalScore} />
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
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
                    className={`${scoreColor(value)} h-2 rounded-full`}
                    style={{
                      width: barsAnimated ? `${value}%` : '0%',
                      transition: 'width 0.8s ease-out',
                    }}
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
