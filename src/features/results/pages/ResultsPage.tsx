'use client';

import { useSse } from '@/hooks/useSse';
import type { RepoAnalysis } from '@/lib/schemas';
import { AnalysisOverlay } from '@/features/results/components/AnalysisOverlay';
import { ResultsDashboard } from '@/features/results/components/ResultsDashboard';
import { PageTitle } from '@/components/ui/Text';

export function ResultsPage({ owner, repo }: { owner: string; repo: string }) {
  const url = `/api/analyze?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`;
  const { status, progressSteps, result, error } = useSse<RepoAnalysis>(url);

  return (
    <div className="bg-background flex flex-1 flex-col items-center px-6 py-16">
      <AnalysisOverlay progressSteps={progressSteps} status={status} />
      <div className="w-full max-w-5xl">
        <PageTitle className="mb-8">
          Review of {owner}/{repo}
        </PageTitle>
        {error && (
          <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-4">
            {error}
          </div>
        )}

        {result && <ResultsDashboard analysis={result} />}
      </div>
    </div>
  );
}
