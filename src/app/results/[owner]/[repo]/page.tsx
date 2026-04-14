'use client';

import { use } from 'react';
import { useSse } from '@/hooks/useSse';
import type { RepoAnalysis } from '@/lib/schemas';
import { AnalysisOverlay } from '@/features/results/components/AnalysisOverlay';
import { ResultsDashboard } from '@/features/results/components/ResultsDashboard';

export default function ResultsPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = use(params);
  const url = `/api/analyze?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`;
  const { status, progressSteps, result, error } = useSse<RepoAnalysis>(url);

  return (
    <div className="bg-background flex flex-1 flex-col items-center px-6 py-16">
      <AnalysisOverlay progressSteps={progressSteps} status={status} />
      <div className="w-full max-w-5xl">
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
