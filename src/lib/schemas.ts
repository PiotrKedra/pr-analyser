import { z } from 'zod';

// --- GitHub API response schemas ---

export const githubPrFileSchema = z.object({
  filename: z.string(),
  additions: z.number(),
  deletions: z.number(),
  changes: z.number(),
});

export type GitHubPrFile = z.infer<typeof githubPrFileSchema>;

export const githubCommitSchema = z.object({
  sha: z.string(),
  commit: z.object({
    message: z.string(),
    author: z.object({
      name: z.string(),
    }),
  }),
});

export type GitHubCommit = z.infer<typeof githubCommitSchema>;

export const githubPrSchema = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string().nullable(),
  user: z.object({
    login: z.string(),
  }),
  merged_at: z.string().nullable(),
});

export type GitHubPr = z.infer<typeof githubPrSchema>;

export const enrichedPrSchema = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string().nullable(),
  author: z.string(),
  mergedAt: z.string(),
  additions: z.number(),
  deletions: z.number(),
  changedFiles: z.number(),
  files: z.array(githubPrFileSchema),
  commitMessages: z.array(z.string()),
});

export type EnrichedPr = z.infer<typeof enrichedPrSchema>;

// --- Claude analysis response schemas ---

export const claudePrScoreSchema = z.object({
  prNumber: z.number(),
  impact: z.number().min(0).max(100),
  aiLeverage: z.number().min(0).max(100),
  quality: z.number().min(0).max(100),
  summary: z.string(),
});

export type ClaudePrScore = z.infer<typeof claudePrScoreSchema>;

export const claudeAnalysisResponseSchema = z.object({
  scores: z.array(claudePrScoreSchema),
  recommendations: z.array(z.string()),
});

export type ClaudeAnalysisResponse = z.infer<
  typeof claudeAnalysisResponseSchema
>;

// --- App-level schemas ---

export const prScoreSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  additions: z.number(),
  deletions: z.number(),
  changedFiles: z.number(),
  impact: z.number().min(0).max(100),
  aiLeverage: z.number().min(0).max(100),
  quality: z.number().min(0).max(100),
  totalScore: z.number().min(0).max(100),
  summary: z.string(),
  diffUrl: z
    .string()
    .url()
    .refine((url) => url.startsWith('https://github.com/'), {
      message: 'Diff URL must be a GitHub URL',
    }),
});

export type PRScore = z.infer<typeof prScoreSchema>;

export const repoAnalysisSchema = z.object({
  repo: z.string(),
  totalScore: z.number().min(0).max(100),
  impact: z.number().min(0).max(100),
  aiLeverage: z.number().min(0).max(100),
  quality: z.number().min(0).max(100),
  prs: z.array(prScoreSchema),
  recommendations: z.array(z.string()),
});

export type RepoAnalysis = z.infer<typeof repoAnalysisSchema>;

export const progressEventSchema = z.object({
  step: z.number(),
  message: z.string(),
});

export type ProgressEvent = z.infer<typeof progressEventSchema>;

const githubUrlRegex =
  /^https?:\/\/github\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)/;

export const githubUrlSchema = z
  .string()
  .transform((val) => val.replace(/\/+$/, '').replace(/\.git$/, ''))
  .pipe(
    z.string().refine((val) => githubUrlRegex.test(val), {
      message: 'Invalid GitHub repository URL',
    }),
  )
  .transform((val) => {
    const match = val.match(githubUrlRegex)!;
    return { owner: match[1], repo: match[2] };
  });

export type GitHubUrl = z.infer<typeof githubUrlSchema>;
