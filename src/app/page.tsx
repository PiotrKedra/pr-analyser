'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { githubUrlSchema } from '@/lib/schemas';
import { PageTitle, Paragraph, Description } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';
import { Separator } from '@/components/ui/Separator';

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

      <Separator />

      <section className="flex w-full max-w-xl flex-col items-center gap-6 px-6 py-16">
        <PageTitle>Component Preview</PageTitle>
        <Paragraph>
          Below are the design-system primitives used across the app.
        </Paragraph>

        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link variant</Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Size xs</Button>
          <Button size="sm">Size sm</Button>
          <Button size="default">Size default</Button>
          <Button size="lg">Size lg</Button>
        </div>

        <Separator />

        <Description>
          Links use the <Link href="/">Link component</Link> with opacity hover.
          Here is another <Link href="/results/facebook/react">example link</Link>.
        </Description>
      </section>
    </div>
  );
}
