'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { githubUrlSchema } from '@/lib/schemas';

export default function Home() {
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
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50">
      <main className="flex w-full max-w-xl flex-col items-center gap-8 px-6 py-32">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          PR Analyser
        </h1>
        <p className="text-center text-lg text-zinc-600">
          Analyze GitHub PR quality with AI. Paste a repository URL to get
          started.
        </p>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Analyse
          </button>
        </form>
      </main>
    </div>
  );
}
