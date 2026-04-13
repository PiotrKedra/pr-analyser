import type { RepoAnalysis } from '@/lib/schemas';

export const dynamic = 'force-dynamic';

function createSSEStream() {
  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  return {
    readable,
    sendEvent: async (event: string, data: unknown) => {
      await writer.write(
        encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
      );
    },
    close: async () => {
      await writer.close();
    },
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  if (!owner || !repo) {
    return new Response(JSON.stringify({ error: 'Missing owner or repo' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { readable, sendEvent, close } = createSSEStream();

  (async () => {
    try {
      const prs: RepoAnalysis['prs'] = [
        {
          id: 1,
          title: 'Add user authentication',
          author: 'alice',
          additions: 450,
          deletions: 30,
          changedFiles: 12,
          impact: 90,
          aiLeverage: 75,
          quality: 85,
          totalScore: Math.round(90 * 0.3 + 75 * 0.35 + 85 * 0.35),
          summary:
            'Implements JWT-based authentication with login, signup, and session management.',
        },
        {
          id: 2,
          title: 'Fix typo in README',
          author: 'bob',
          additions: 1,
          deletions: 1,
          changedFiles: 1,
          impact: 5,
          aiLeverage: 10,
          quality: 40,
          totalScore: Math.round(5 * 0.3 + 10 * 0.35 + 40 * 0.35),
          summary: 'Corrects a single typo in the project README file.',
        },
        {
          id: 3,
          title: 'Refactor database queries',
          author: 'carol',
          additions: 200,
          deletions: 150,
          changedFiles: 8,
          impact: 60,
          aiLeverage: 70,
          quality: 75,
          totalScore: Math.round(60 * 0.3 + 70 * 0.35 + 75 * 0.35),
          summary:
            'Replaces raw SQL with parameterized queries and adds connection pooling.',
        },
      ];

      await sendEvent('progress', {
        step: 1,
        message: 'Fetching PRs from GitHub...',
      });
      await sleep(1000);

      for (let i = 0; i < prs.length; i++) {
        await sendEvent('progress', {
          step: i + 2,
          message: `Analyzing PR #${prs[i].id}: ${prs[i].title}`,
        });
        await sleep(3000);
      }

      const result: RepoAnalysis = {
        repo: `${owner}/${repo}`,
        totalScore: 68,
        impact: 70,
        aiLeverage: 65,
        quality: 70,
        prs,
        recommendations: [
          'Consider adding tests for the authentication module.',
          'README-only PRs could be batched to reduce noise.',
          'Database refactors should include migration scripts.',
        ],
      };

      await sendEvent('result', result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      await sendEvent('error', { message });
    } finally {
      await close();
    }
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
