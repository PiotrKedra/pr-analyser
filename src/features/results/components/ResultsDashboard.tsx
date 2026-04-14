import type { RepoAnalysis } from '@/lib/schemas';
import { SectionTitle } from '@/components/ui/Text';
import { ScoreOverview } from './ScoreOverview';
import { PrTable } from './PrTable';

function ResultsDashboard({ analysis }: { analysis: RepoAnalysis }) {
  return (
    <div className="space-y-8">
      <ScoreOverview
        totalScore={analysis.totalScore}
        impact={analysis.impact}
        aiLeverage={analysis.aiLeverage}
        quality={analysis.quality}
        recommendations={analysis.recommendations}
      />

      <SectionTitle>Pull Requests</SectionTitle>
      <div className="border-border rounded-xl border bg-white">
        <PrTable prs={analysis.prs} />
      </div>
    </div>
  );
}

export { ResultsDashboard };
