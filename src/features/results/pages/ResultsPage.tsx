'use client';

import { useShareableResult } from '@/hooks/useShareableResult';
import { AnalysisOverlay } from '@/features/results/components/AnalysisOverlay';
import { ResultsDashboard } from '@/features/results/components/ResultsDashboard';
import { PageTitle } from '@/components/ui/Text';
import { CopyLinkButton } from '@/features/results/components/CopyLinkButton';

export function ResultsPage({ owner, repo }: { owner: string; repo: string }) {
  const { status, progressSteps, result, error, isSharedView } =
    useShareableResult(owner, repo);

  return (
    <div className="bg-background flex flex-1 flex-col items-center px-6 py-16">
      {!isSharedView && (
        <AnalysisOverlay progressSteps={progressSteps} status={status} />
      )}
      <div className="w-full max-w-5xl">
        <div className="mb-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <PageTitle>
            Review of {owner}/{repo}
          </PageTitle>
          <CopyLinkButton />
        </div>
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
