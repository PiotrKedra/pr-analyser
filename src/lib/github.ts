import {
  githubPrSchema,
  githubPrFileSchema,
  githubCommitSchema,
  type EnrichedPr,
} from '@/lib/schemas';
import { z } from 'zod';

const GITHUB_API = 'https://api.github.com';
const MAX_PRS = 20;
const MAX_FILES = 30;

type ErrorCode = 'INVALID_REPO' | 'NO_PRS' | 'RATE_LIMIT';

export class GitHubError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    h['Authorization'] = `Bearer ${token}`;
  }
  return h;
}

async function githubFetch(path: string): Promise<unknown> {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: headers() });

  if (res.status === 404) {
    throw new GitHubError('INVALID_REPO', 'Repository not found or is private');
  }
  if (res.status === 403 || res.status === 429) {
    throw new GitHubError(
      'RATE_LIMIT',
      'GitHub API rate limit exceeded. Try again later or add a GITHUB_TOKEN.',
    );
  }
  if (!res.ok) {
    throw new GitHubError(
      'INVALID_REPO',
      `GitHub API error: ${res.status} ${res.statusText}`,
    );
  }

  return res.json();
}

export async function fetchMergedPrs(
  owner: string,
  repo: string,
  onProgress: (message: string) => Promise<void>,
): Promise<EnrichedPr[]> {
  const raw = await githubFetch(
    `/repos/${owner}/${repo}/pulls?state=closed&per_page=30&sort=updated&direction=desc`,
  );

  const allPrs = z.array(githubPrSchema).parse(raw);
  const mergedPrs = allPrs
    .filter((pr) => pr.merged_at !== null)
    .slice(0, MAX_PRS);

  if (mergedPrs.length === 0) {
    throw new GitHubError(
      'NO_PRS',
      'No merged pull requests found in this repository',
    );
  }

  await onProgress(`Fetched ${mergedPrs.length} merged PRs from GitHub`);

  const enriched: EnrichedPr[] = [];

  for (let i = 0; i < mergedPrs.length; i++) {
    const pr = mergedPrs[i];

    const [rawFiles, rawCommits] = await Promise.all([
      githubFetch(`/repos/${owner}/${repo}/pulls/${pr.number}/files`),
      githubFetch(`/repos/${owner}/${repo}/pulls/${pr.number}/commits`),
    ]);

    const files = z
      .array(githubPrFileSchema)
      .parse(rawFiles)
      .sort((a, b) => b.changes - a.changes)
      .slice(0, MAX_FILES);

    const commits = z.array(githubCommitSchema).parse(rawCommits);

    const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0);
    const totalDeletions = files.reduce((sum, f) => sum + f.deletions, 0);

    enriched.push({
      number: pr.number,
      title: pr.title,
      body: pr.body,
      author: pr.user.login,
      mergedAt: pr.merged_at!,
      additions: totalAdditions,
      deletions: totalDeletions,
      changedFiles: files.length,
      files,
      commitMessages: commits.map((c) => c.commit.message),
    });

    await onProgress(
      `Downloaded PR #${pr.number}: ${pr.title} (${i + 1}/${mergedPrs.length})`,
    );
  }

  return enriched;
}
