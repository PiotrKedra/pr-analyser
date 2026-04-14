import type { Metadata } from 'next';
import { ResultsPage } from '@/features/results/pages/ResultsPage';

type Params = { owner: string; repo: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { owner, repo } = await params;
  return {
    title: `PR Analysis: ${owner}/${repo} | PR Analyser`,
    description: `AI-powered code review analysis for ${owner}/${repo}`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { owner, repo } = await params;
  return <ResultsPage owner={owner} repo={repo} />;
}
