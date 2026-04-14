'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { githubUrlSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/Button';
import { PrimitiveInput } from '@/components/form/PrimitiveInput';
import { InputError } from '@/components/form/InputError';

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
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col justify-center gap-3 sm:flex-row"
    >
      <div className="flex w-full flex-col gap-0.5 sm:w-auto">
        <PrimitiveInput
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          aria-label="GitHub repository URL"
          error={error}
          className="h-[58px] w-full sm:w-[400px]"
        />
        <InputError error={error} />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Analyse
      </Button>
    </form>
  );
}
