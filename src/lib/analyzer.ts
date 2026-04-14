import Anthropic from '@anthropic-ai/sdk';
import {
  claudeAnalysisResponseSchema,
  type EnrichedPr,
  type RepoAnalysis,
} from '@/lib/schemas';

export class AnalysisError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AnalysisError';
  }
}

const SYSTEM_PROMPT = `You are a senior engineering manager evaluating GitHub pull requests.

For each PR, score these three dimensions from 0 to 100:

1. **Impact** (weight: 20%): Real value of the changes — new functionality, architecture improvements, performance gains, bug fixes. Trivial changes (typos, formatting) score low.

2. **AI-Leverage** (weight: 40%): Evidence that AI tools were used effectively. Look for: co-authored-by tags mentioning AI, [cc] or [ai] commit tags, large coherent changes with consistent style, boilerplate generation patterns, unusually high code-to-description ratios. Score higher when AI is clearly leveraged well, lower when changes appear fully manual or AI usage is unclear.

3. **Quality** (weight: 40%): Engineering quality — focused scope, clean code, meaningful PR descriptions, presence of tests, proper refactoring, good commit messages.

Respond with ONLY valid JSON (no markdown fences, no extra text) in this exact format:
{
  "scores": [
    {
      "prNumber": 123,
      "impact": 75,
      "aiLeverage": 60,
      "quality": 80,
      "summary": "One sentence describing what this PR does and its quality."
    }
  ],
  "recommendations": [
    "2-4 actionable recommendations for the repository based on patterns across all PRs."
  ]
}`;

function formatPrForPrompt(pr: EnrichedPr, index: number): string {
  const fileList = pr.files
    .slice(0, 15)
    .map((f) => `  ${f.filename} (+${f.additions}/-${f.deletions})`)
    .join('\n');

  const commits = pr.commitMessages
    .slice(0, 10)
    .map((m) => `  - ${m.split('\n')[0]}`)
    .join('\n');

  return `--- PR #${index + 1} ---
Number: #${pr.number}
Title: ${pr.title}
Author: ${pr.author}
Description: ${pr.body || '(no description)'}
Stats: +${pr.additions}/-${pr.deletions} across ${pr.changedFiles} files
Merged: ${pr.mergedAt}

Files changed:
${fileList}

Commit messages:
${commits}`;
}

function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*\n?/i, '')
    .replace(/\n?```\s*$/i, '')
    .trim();
}

async function callClaude(
  client: Anthropic,
  userPrompt: string,
  retryWithSuffix: boolean,
): Promise<unknown> {
  const prompt = retryWithSuffix
    ? userPrompt +
      '\n\nIMPORTANT: Respond with ONLY raw JSON. No markdown code fences. No explanations.'
    : userPrompt;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new AnalysisError('ANALYSIS_FAILED', 'Claude returned no text');
  }

  const cleaned = stripCodeFences(textBlock.text);
  return JSON.parse(cleaned);
}

export async function analyzePrs(
  repo: string,
  prs: EnrichedPr[],
): Promise<RepoAnalysis> {
  const client = new Anthropic();

  const userPrompt = `Analyze the following ${prs.length} merged pull requests from the repository "${repo}":

${prs.map((pr, i) => formatPrForPrompt(pr, i)).join('\n\n')}

Score each PR on Impact, AI-Leverage, and Quality (0-100 each). Return JSON only.`;

  let parsed: unknown;
  try {
    parsed = await callClaude(client, userPrompt, false);
  } catch {
    try {
      parsed = await callClaude(client, userPrompt, true);
    } catch (retryError) {
      throw new AnalysisError(
        'ANALYSIS_FAILED',
        retryError instanceof Error
          ? retryError.message
          : 'Claude analysis failed',
      );
    }
  }

  let validated;
  try {
    validated = claudeAnalysisResponseSchema.parse(parsed);
  } catch {
    // Retry with stricter prompt
    try {
      parsed = await callClaude(client, userPrompt, true);
      validated = claudeAnalysisResponseSchema.parse(parsed);
    } catch (retryError) {
      throw new AnalysisError(
        'ANALYSIS_FAILED',
        retryError instanceof Error
          ? retryError.message
          : 'Failed to parse Claude response',
      );
    }
  }

  const scoredPrs = prs.map((pr) => {
    const score = validated.scores.find((s) => s.prNumber === pr.number);
    const impact = score?.impact ?? 50;
    const aiLeverage = score?.aiLeverage ?? 50;
    const quality = score?.quality ?? 50;
    const totalScore = Math.round(
      impact * 0.2 + aiLeverage * 0.4 + quality * 0.4,
    );

    return {
      id: pr.number,
      title: pr.title,
      author: pr.author,
      additions: pr.additions,
      deletions: pr.deletions,
      changedFiles: pr.changedFiles,
      impact,
      aiLeverage,
      quality,
      totalScore,
      summary: score?.summary ?? 'No analysis available for this PR.',
    };
  });

  const avg = (field: 'impact' | 'aiLeverage' | 'quality' | 'totalScore') =>
    Math.round(
      scoredPrs.reduce((sum, pr) => sum + pr[field], 0) / scoredPrs.length,
    );

  return {
    repo,
    totalScore: avg('totalScore'),
    impact: avg('impact'),
    aiLeverage: avg('aiLeverage'),
    quality: avg('quality'),
    prs: scoredPrs,
    recommendations: validated.recommendations,
  };
}
