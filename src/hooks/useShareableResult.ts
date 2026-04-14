'use client';

import { useEffect, useState } from 'react';
import { useSse } from '@/hooks/useSse';
import { repoAnalysisSchema } from '@/lib/schemas';
import type { RepoAnalysis } from '@/lib/schemas';
import { compressToHash, decompressFromHash } from '@/lib/shareCodec';

export function useShareableResult(owner: string, repo: string) {
  const [hashResult, setHashResult] = useState<RepoAnalysis | null>(null);
  const [hashChecked, setHashChecked] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);

  useEffect(() => {
    async function checkHash() {
      const hash = window.location.hash.slice(1);
      if (hash) {
        try {
          const data = await decompressFromHash(hash);
          setHashResult(data);
          setIsSharedView(true);
        } catch {
          console.warn('Invalid shared link, falling back to fresh analysis');
          window.location.hash = '';
        }
      }
      setHashChecked(true);
    }
    checkHash();
  }, []);

  const sseUrl =
    hashChecked && !hashResult
      ? `/api/analyze?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`
      : null;

  const sse = useSse<RepoAnalysis>(sseUrl, repoAnalysisSchema);

  useEffect(() => {
    if (sse.result && !isSharedView) {
      compressToHash(sse.result).then((encoded) => {
        history.replaceState(null, '', '#' + encoded);
      });
    }
  }, [sse.result, isSharedView]);

  if (isSharedView && hashResult) {
    return {
      status: 'done' as const,
      progressSteps: [],
      result: hashResult,
      error: null,
      isSharedView: true,
    };
  }

  return {
    ...sse,
    isSharedView: false,
  };
}
