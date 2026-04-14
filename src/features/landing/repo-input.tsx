'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { githubUrlSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/Button';

export function RepoInput() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = githubUrlSchema.safeParse(url);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const { owner, repo } = result.data;
    router.push(`/results/${owner}/${repo}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-row gap-3">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://github.com/owner/repo"
        className="border-border text-foreground placeholder-muted-foreground focus:border-ring focus:ring-ring/20 w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none"
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" size="lg">
        Analyse
      </Button>
    </form>
  );
}
