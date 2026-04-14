'use client';

import { use } from 'react';
import { useSse } from '@/hooks/useSse';
import type { RepoAnalysis } from '@/lib/schemas';

export default function ResultsPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = use(params);
  const url = `/api/analyze?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`;
  const { status, progressSteps, result, error } = useSse<RepoAnalysis>(url);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900">
          {owner}/{repo}
        </h1>

        <div className="mb-8 flex flex-col gap-3">
          {progressSteps.map((step) => (
            <div
              key={step.step}
              className="flex items-center gap-3 text-zinc-700"
            >
              <span className="text-green-600">&#10003;</span>
              <span>{step.message}</span>
            </div>
          ))}
          {(status === 'connecting' || status === 'receiving') && (
            <div className="flex items-center gap-3 text-zinc-400">
              <span className="animate-pulse">&#9679;</span>
              <span>
                {status === 'connecting' ? 'Connecting...' : 'Processing...'}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {result && (
          <pre className="overflow-auto rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-800">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
