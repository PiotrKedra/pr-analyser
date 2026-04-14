import { fetchMergedPrs, GitHubError } from '@/lib/github';
import { analyzePrs, AnalysisError } from '@/lib/analyzer';

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

  let step = 0;
  const progress = async (message: string) => {
    step++;
    await sendEvent('progress', { step, message });
  };

  (async () => {
    try {
      await progress('Fetching PRs from GitHub...');

      const prs = await fetchMergedPrs(owner, repo, progress);

      await progress(`Downloaded ${prs.length}/${prs.length} PRs`);
      await progress('Analyzing code with Claude...');

      const result = await analyzePrs(`${owner}/${repo}`, prs);

      await sendEvent('result', result);
    } catch (error) {
      if (error instanceof GitHubError) {
        await sendEvent('error', { code: error.code, message: error.message });
      } else if (error instanceof AnalysisError) {
        await sendEvent('error', {
          code: 'ANALYSIS_FAILED',
          message: error.message,
        });
      } else {
        await sendEvent('error', {
          code: 'ANALYSIS_FAILED',
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
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
