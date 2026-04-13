import { z } from 'zod';

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
