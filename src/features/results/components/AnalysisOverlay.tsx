'use client';

import { useEffect, useRef } from 'react';
import type { ProgressEvent } from '@/lib/schemas';
import type { SSEStatus } from '@/hooks/useSse';

export function AnalysisOverlay({
  progressSteps,
  status,
}: {
  progressSteps: ProgressEvent[];
  status: SSEStatus;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [progressSteps.length]);

  if (status !== 'connecting' && status !== 'receiving') return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="bg-muted mb-6 h-[120px] w-[120px] animate-pulse rounded-2xl" />
      <p className="text-muted-foreground mb-8 text-sm font-medium">
        AI is analyzing...
      </p>

      <div className="relative h-[300px] w-full max-w-md overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-16 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-16 bg-gradient-to-t from-white to-transparent" />

        <div
          ref={scrollRef}
          className="flex h-full flex-col gap-3 overflow-y-auto px-4 py-16"
        >
          {progressSteps.map((step) => (
            <div
              key={step.step}
              className="text-foreground flex items-center gap-3"
            >
              <span className="text-green-600">&#10003;</span>
              <span>{step.message}</span>
            </div>
          ))}
          {status === 'receiving' && (
            <div className="text-muted-foreground flex items-center gap-3">
              <span className="animate-pulse">&#9679;</span>
              <span>Processing...</span>
            </div>
          )}
          {status === 'connecting' && (
            <div className="text-muted-foreground flex items-center gap-3">
              <span className="animate-pulse">&#9679;</span>
              <span>Connecting...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
