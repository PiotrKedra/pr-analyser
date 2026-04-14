# PR Analyser — Claude Code Rules

## Project Overview

GitHub PR quality analyzer: landing page + AI backend + results dashboard.
Style reference: [passport-photo.online](https://passport-photo.online). Light theme only.

## Stack

- **Framework:** Next.js 16 (App Router), TypeScript, React 19
- **Styling:** Tailwind CSS v4 (CSS-native `@theme` syntax, NOT `tailwind.config.js`), shadcn/ui (customized to passport-photo.online brand)
- **AI:** Claude API via `@anthropic-ai/sdk`, model: `claude-sonnet-4-20250514`
- **Validation:** Zod for all schemas (API boundaries, GitHub URLs, Claude responses)
- **Testing:** Vitest + `@testing-library/react`
- **Package manager:** Yarn (never use `npm`)
- **Deploy:** Vercel (deploy from `dev` branch)

## File Structure

```
src/
  app/
    api/analyze/route.ts       # SSE endpoint
    results/[owner]/[repo]/
      page.tsx                  # Dashboard route
    page.tsx                    # Landing page
  components/
    ui/                         # shadcn/ui + custom primitives
  features/
    landing/                    # LP section components
    results/                    # Dashboard components
  lib/
    github.ts                   # GitHub API client
    analyzer.ts                 # Claude scoring logic
    schemas.ts                  # Zod schemas (shared client/server)
```

## Coding Conventions

- **Imports:** Use `@/*` path alias (maps to `./src/*`)
- **Components:** Functional components with TypeScript. Props as inline types for simple components, extracted `type` for complex ones.
- **No `any` types.** Use `unknown` + Zod parse or proper types.
- **Naming:** `PascalCase` for components, types, and their files (`SomeComponent.tsx`). `camelCase` for everything else — variables, functions, objects, schema fields, file names (`useSomeHook.ts`).
- **Exports:** Named exports for components. Default exports only for Next.js pages/layouts.
- **Server vs Client:** Default to Server Components. Add `"use client"` only when needed (hooks, event handlers, browser APIs).
- **Error handling:** Zod validation at API boundaries. Try/catch around external calls (GitHub API, Claude API). Surface user-friendly error messages.
- **No unused imports, no unused variables.** ESLint must pass.

## Tailwind v4 Rules

- Use `@import "tailwindcss"` in CSS, NOT the v3 directives.
- Theme tokens via `@theme { --color-primary: #0057FF; }` in `globals.css`.
- shadcn/ui CSS variables must align with v4 syntax.
- No `tailwind.config.js` — all configuration in CSS.

## SSE (Server-Sent Events)

- Use `TransformStream` + `ReadableStream` pattern (NOT `res.write()`).
- Return `new Response(stream)` with `Content-Type: text/event-stream`.
- Set `dynamic = 'force-dynamic'` on the route.
- Events: `progress` (step updates), `result` (final data), `error` (failures).

## Scoring Model

- **Impact** (20%): Real value of PR changes — functionality, architecture, performance.
- **AI-Leverage** (40%): Evidence of AI-generated code — patterns, co-authored-by, tags, size/coherence ratio.
- **Quality** (40%): Engineering quality — focused PRs, clean code, descriptions, tests, refactoring.
- `totalScore = impact * 0.20 + aiLeverage * 0.40 + quality * 0.40`

## Git Workflow

- **Branches:** `dev` is primary working branch. `main` for production. PRs merge to `dev`.
- **Branch naming:** `feat/step-N-description` (e.g., `feat/step-2-prototype`)
- **Commits:** `feat: add ScoreRing component [cc]` (AI-assisted) or `fix: correct SSE close logic` (manual)
- **Tag `[cc]` or `[ai]`** on AI-assisted commits. All commits should have appropriate tags.
- **One PR per step.** Title + 1–2 sentence description.
- **Never squash, never rebase -i, never amend published commits.** Raw history is intentional.
- **Reverts are welcome** — they show review of AI output.

## Performance Requirements

- **PageSpeed mobile ≥ 90** on all 4 metrics (Performance, Accessibility, Best Practices, SEO).
- All images via `next/image` with explicit `width`/`height`.
- Icons as inline SVG (no icon fonts).
- Fonts via `next/font` (self-hosted, zero layout shift).
- No render-blocking resources.
- No Framer Motion (adds ~40KB). Use CSS transitions + `IntersectionObserver` for animations.

## Key Technical Decisions

- **Max 20 merged PRs** analyzed per repo (balances cost, speed, rate limits).
- **Batch prompt** to Claude — all PRs in one request (faster, cheaper than per-PR).
- **In-memory cache** with 10-minute TTL keyed by `{owner}/{repo}`.
- **GitHub token optional** — unauthenticated 60 req/h, authenticated 5000 req/h.
- **Truncate** large PR file lists to top 30 files by lines changed.

## Error Codes

| Code              | Trigger                                       |
| ----------------- | --------------------------------------------- |
| `INVALID_REPO`    | GitHub 404 — repo doesn't exist or is private |
| `NO_PRS`          | 0 merged PRs found                            |
| `RATE_LIMIT`      | GitHub 403/429                                |
| `ANALYSIS_FAILED` | Claude API error                              |

## Testing

- Run tests: `yarn test`
- Run dev server: `yarn dev`
- Run build: `yarn build`
- Run lint: `yarn lint`
- Vitest for unit tests. `@testing-library/react` for component tests.
- Snapshot tests for custom primitives (ScoreRing, Badge variants).

## Do NOT

- Use `npm` (use `yarn`)
- Use `tailwind.config.js` (Tailwind v4 uses CSS-native config)
- Use `res.write()` for SSE (use ReadableStream pattern)
- Use Framer Motion or heavy animation libraries
- Use icon font libraries (use inline SVG)
- Add dark mode (passport-photo.online is light-only)
- Use default shadcn theme (must match passport-photo.online brand)
- Commit `.env` or API keys
