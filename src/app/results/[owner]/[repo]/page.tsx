'use client';

import { use } from 'react';
import { useSse } from '@/hooks/useSse';
import type { RepoAnalysis } from '@/lib/schemas';
import { AnalysisOverlay } from '@/features/results/components/AnalysisOverlay';

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
      <div className="w-full max-w-3xl">
        <h1 className="text-foreground mb-8 text-3xl font-bold tracking-tight">
          {owner}/{repo}
        </h1>

        {error && (
          <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-4">
            {error}
          </div>
        )}

        {/* TODO: Replace JSON dump with proper results dashboard */}
        {result && (
          <pre className="border-border bg-background overflow-auto rounded-lg border p-6 text-sm text-zinc-800">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
