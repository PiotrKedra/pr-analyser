# PhotoAID Recruitment Task — Implementation Plan

**Role:** Senior AI-First Frontend Developer  
**Stack:** Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui, Claude API (Anthropic SDK), Zod, Vitest, Yarn, Vercel  
**Time budget:** 5–7 hours  
**Deadline:** 7 days from brief receipt

---

## Step 1 — Project Init & Tooling Setup

### Description

Bootstrap the Next.js project, configure all tooling, establish dev rules via `CLAUDE.md`, set up the GitHub repo with branch protection, and connect to Vercel for continuous deployment from the start. This step sets the foundation — everything else builds on top of it.

**Deliverables:**

- `yarn create next-app` with TypeScript, Tailwind v4, App Router, ESLint
- shadcn/ui initialized (`yarn dlx shadcn@latest init`) — customized to match passport-photo.online tokens, not default theme
- `CLAUDE.md` with dev rules (naming conventions, file structure, commit style, AI usage tags `[cc]`/`[ai]`, PR format)
- Claude Code skill: `code-review` skill in `.claude/skills/code-review/SKILL.md` (instructs AI to review diffs, flag issues, suggest improvements)
- GitHub repo created, `dev` branch as the primary working branch (PRs merged to `dev`; `main` reserved for production releases)
- Vercel project connected to repo → auto-deploy on push to `dev`
- `.env.example` with `ANTHROPIC_API_KEY`, `GITHUB_TOKEN` (optional, for higher rate limits)
- Vitest + `@testing-library/react` configured, smoke test passing
- Base folder structure established:
  ```
  /app
    /api
      /analyze/route.ts         ← SSE endpoint
    /results/[owner]/[repo]/
      page.tsx                  ← dashboard route
    page.tsx                    ← landing page
  /components                   ← common components (ui primitives, table)
    /ui/                        ← shadcn/ui + custom primitives
  /features
    /landing/                   ← LP section components
    /results/                   ← dashboard components
  /lib
    /github.ts                  ← GitHub API client
    /analyzer.ts                ← Claude scoring logic
    /schemas.ts                 ← Zod schemas
  /.claude
    /skills
      /code-review/SKILL.md
  ```

### Potential Problems

- Tailwind v4 config syntax differs from v3 — use `@import "tailwindcss"` in CSS, not `tailwind.config.js`; double-check PostCSS setup
- shadcn/ui init generates a `components.json` — commit this, it drives all future `add` commands; ensure `baseColor` and `cssVariables: true` are set correctly before adding any components
- Vercel environment variable injection — set `ANTHROPIC_API_KEY` in Vercel dashboard immediately, not just locally
- `dev` branch: set Vercel to deploy from `dev` (not `main`) in project settings → Production Branch
- `CLAUDE.md` too verbose slows down Claude Code context — keep it under ~150 lines, use sections not prose

### Validation

- [ ] `yarn dev` starts without errors
- [ ] `yarn test` runs Vitest and smoke test passes
- [ ] Vercel preview URL is live (even for a blank page), deploying from `dev`
- [ ] GitHub repo has `dev` as default branch
- [ ] `CLAUDE.md` committed and readable by Claude Code
- [ ] `.claude/skills/code-review/SKILL.md` committed

---

## Step 2 — Full-Stack Prototype (Walking Skeleton)

### Description

Build the thinnest possible version of the entire system end-to-end: landing page with URL input, results route, mocked API returning 3 PRs with the full response schema, and SSE streaming plumbing in place. The goal is **zero unknown unknowns** — every integration point proven before any polish.

**Deliverables:**

- Landing page (`/`) with a single `<input>` for GitHub URL and a submit button → redirects to `/results/{owner}/{repo}`
- Results page (`/results/[owner]/[repo]`) that calls the API and renders raw JSON
- `POST /api/analyze` or `GET /api/analyze?repo=...` as a **Server-Sent Events** (SSE) route in Next.js App Router
- Zod schema for the full API response (used in both backend output validation and frontend consumption):
  ```ts
  // Key shapes — not exhaustive
  PRScore: { id, title, author, additions, deletions, changedFiles, impact: 0-100, aiLeverage: 0-100, quality: 0-100, totalScore: 0-100, summary: string }
  RepoAnalysis: { repo, totalScore, impact, aiLeverage, quality, prs: PRScore[], recommendations: string[] }
  ```
- Mock backend returns 3 hardcoded PRs matching the schema — no GitHub API, no Claude yet
- SSE sends progress events: `{ event: "progress", data: { step, message } }` then `{ event: "result", data: RepoAnalysis }`
- **Results page loading state** — the results page must consume SSE events from the start and render a live progress UI:
  - A `useSSE(url)` hook that opens an `EventSource`, collects `progress` events into state, and resolves on `result`
  - Loading view: progress steps displayed sequentially as each `progress` event arrives (e.g. checkmark ticks through "Fetching PRs… → Sending to AI… → Building results…")
  - Transitions to dashboard view once `result` event is received
  - This loading UI is functional in this step even though data is mocked
- GitHub URL validation with Zod on both client and server: `https://github.com/{owner}/{repo}`

### Potential Problems

- SSE in Next.js App Router requires `TransformStream` + `ReadableStream` — do not use `res.write()`; use the `new Response(stream)` pattern
- SSE and Vercel: streaming works on Vercel with Edge Runtime or Node runtime with `dynamic = 'force-dynamic'` — confirm this early
- URL parsing edge cases: trailing slashes, `.git` suffix, `github.com/owner/repo/tree/branch` — Zod `transform` to normalize
- Results page needs to handle the loading state before SSE completes — set up a basic `useSSE` hook skeleton now even if unused yet

### Validation

- [ ] Navigating to `/?repo=https://github.com/vercel/next.js` redirects to `/results/vercel/next.js`
- [ ] Results page shows loading state with progress steps ticking through SSE events before rendering data
- [ ] Results page displays the 3 mocked PRs once `result` event arrives
- [ ] SSE stream sends `progress` then `result` events (verify in browser DevTools → Network → EventStream)
- [ ] Zod rejects `https://github.com/onlyone` (no repo segment) and returns a 400
- [ ] `yarn test` still passes

---

## Step 3 — Design System

### Description

Extract the exact visual identity from passport-photo.online and codify it as Tailwind CSS variables and shadcn/ui theme overrides. Every subsequent step pulls from this token set — no ad-hoc colors or font sizes after this point. Light theme only — passport-photo.online does not have dark mode.

**Deliverables:**

- Color tokens (inspect passport-photo.online via DevTools):
  - Primary blue: `#0057FF` (approx) → `--color-primary`
  - Dark backgrounds for contrast sections, white text on dark
  - Neutral grays for cards/borders
- Typography:
  - Heading font: likely **Inter** or a geometric sans — confirm via DevTools (`font-family` on `<h1>`)
  - Body: Inter or system-ui
  - Load via `next/font` (zero layout shift, self-hosted)
- Spacing scale: confirm base unit (likely 4px or 8px grid) — use Tailwind defaults
- shadcn/ui theme configured in `globals.css` CSS variables to match the passport-photo.online palette
- Custom primitive components on top of shadcn where needed:
  - `ScoreRing` — circular progress SVG for single score display (not in shadcn, build from scratch)
  - `Badge` variant extensions — score level labels (Excellent / Good / Fair / Poor)
- Global CSS: CSS variables, base `body` styles, scroll behavior

### Potential Problems

- passport-photo.online may use a licensed font — use the closest free equivalent (Inter is almost identical to their brand usage); do NOT embed their actual font files
- Tailwind v4 uses CSS-native variables (`@theme`) instead of `tailwind.config.js` — syntax: `@theme { --color-primary: #0057FF; }` — shadcn's generated CSS variables may need manual alignment with v4 syntax
- `ScoreRing` SVG animation via CSS `stroke-dashoffset` — test on Safari (webkit prefix may be needed)

### Validation

- [ ] Colors match passport-photo.online within visual tolerance (eyeball + hex comparison in DevTools)
- [ ] Font loads correctly on mobile (no fallback flash — check in slow 3G throttle)
- [ ] shadcn Button, Input, Card, Badge render with correct brand colors (not shadcn defaults)
- [ ] `ScoreRing` renders a circle with correct fill percentage for a given score prop
- [ ] All custom primitives have Vitest snapshot tests (1 test each)

---

## Step 4 — Landing Page (All Sections)

### Description

Build the complete landing page using the design system. Every section from the spec, responsive on all breakpoints. Focus entirely on layout quality, responsiveness, and Lighthouse score — animations are deferred to Step 7. This is the highest-visibility part of the submission — treat it as the main portfolio piece.

**Sections:**

1. **Hero** — tagline, GitHub URL input (with validation), CTA button "Analyze Repository", optional: token input for private repos / higher rate limits
2. **Social Proof / "As seen in"** — mock logos: TechCrunch, Product Hunt, GitHub Blog, The Verge, Hacker News (SVG inline logos, grayscale → color on hover)
3. **How It Works** — 3 steps with icons: (1) Paste GitHub URL → (2) AI analyzes pull requests → (3) View detailed scores; static step connector line
4. **What We Score** — 3 cards: Impact / AI-Leverage / Quality; each with icon, name, description, example signals
5. **Example Dashboard Preview** — static screenshot or CSS-only mock of the dashboard using real-looking fake data; CSS scroll-snap mini carousel on mobile
6. **Footer** — logo, tagline, links (GitHub, Docs, Privacy — all `href="#"`), copyright

**No JS animations in this step** — scroll-triggered effects, transitions, and micro-interactions are handled in Step 7 (Nice-to-Haves). Keeping this step animation-free ensures Lighthouse scores are clean before adding complexity.

**Performance requirements (PageSpeed mobile ≥ 90):**

- All images as `next/image` with explicit `width`/`height`
- Icons as inline SVG (no icon font, no sprite sheet HTTP request)
- No render-blocking resources
- Use `next/font` for self-hosted fonts (eliminates Google Fonts round-trip)
- Target: 4 × 90+ on PageSpeed Insights mobile — test at **https://pagespeed.web.dev/** on the Vercel preview URL
- `<head>`: title, meta description, og:image, canonical URL

### Potential Problems

- PageSpeed Performance on mobile is sensitive to: LCP image not preloaded, unused JS, layout shift from fonts — run PageSpeed immediately after deploying this step, not at the end
- Safari: `gap` on flex containers, `aspect-ratio` — test in Safari early (use BrowserStack or a real device)
- Hero input and the results page URL structure must stay in sync — use a shared `parseGitHubUrl` utility from `lib/schemas.ts`
- "Social proof" logos: use simple wordmark text with styled fonts if SVGs are hard to source quickly; still looks clean

### Validation

- [ ] All 6 sections render correctly at 375px, 768px, 1280px, 1440px
- [ ] Tested in Chrome, Firefox, Safari
- [ ] PageSpeed Insights mobile score at **https://pagespeed.web.dev/**: all 4 metrics ≥ 90 on the Vercel preview URL
- [ ] URL input validates on submit: shows inline error for invalid GitHub URLs
- [ ] Submit navigates to `/results/{owner}/{repo}`
- [ ] `<title>` and meta description set correctly

---

## Step 5 — Backend Integration (GitHub API + Claude Analyzer)

### Description

Replace the mock backend with real logic: fetch merged PRs from the GitHub REST API, send them to Claude for scoring, stream progress back via SSE. This is the functional core of the product.

**GitHub API integration (`lib/github.ts`):**

- Endpoint: `GET /repos/{owner}/{repo}/pulls?state=closed&per_page=30` → filter `merged_at !== null`
- For each PR fetch: `GET /repos/{owner}/{repo}/pulls/{pull_number}/files` → changed files, additions, deletions
- Use `GITHUB_TOKEN` env var if present (60 req/h unauthenticated → 5000 req/h authenticated)
- Cap analysis at **20 most recent merged PRs** (decision: balances cost, speed, rate limits — document in README)

**Claude analyzer (`lib/analyzer.ts`):**

- Model: `claude-sonnet-4-20250514` (or `claude-haiku-4-5-20251001` for cost — decide based on quality test)
- Strategy: **batch prompt** — send all PRs in a single message with structured output instructions (faster, cheaper than per-PR calls)
- Prompt structure:
  ```
  System: You are a senior engineering manager evaluating pull requests...
  User: Analyze these {n} pull requests and return ONLY a JSON array...
  [PR data: title, description, author, additions, deletions, changed files list]
  ```
- Use Zod to validate Claude's JSON output — if malformed, retry once with a stricter prompt
- **Scoring weights** (document in README): Impact 30%, AI-Leverage 35%, Quality 35%
  - Reasoning: AI-Leverage slightly elevated — this tool targets AI-first teams where that signal is most diagnostic; Quality and Impact weighted equally as the two pillars of engineering health

**SSE stream events:**

```
event: progress  data: { step: 1, total: 4, message: "Fetching pull requests..." }
event: progress  data: { step: 2, total: 4, message: "Found 18 merged PRs" }
event: progress  data: { step: 3, total: 4, message: "Analyzing with Claude AI..." }
event: progress  data: { step: 4, total: 4, message: "Building results..." }
event: result    data: { ...RepoAnalysis }
event: error     data: { code: "RATE_LIMIT" | "PRIVATE_REPO" | "NO_PRS" | "INVALID_REPO", message: string }
```

**Error handling:**

- 404 from GitHub → `INVALID_REPO` (repo doesn't exist or is private)
- 0 merged PRs → `NO_PRS` error event with message + suggestion
- GitHub 403 / 429 → `RATE_LIMIT` with suggestion to add a token
- Claude API error → surface as generic `ANALYSIS_FAILED`

**Caching:**

- Cache analysis results in-memory (Map) keyed by `{owner}/{repo}` with 10-minute TTL
- On Vercel: use `unstable_cache` or `revalidate` for route-level caching (in-memory doesn't persist across serverless invocations — document this limitation in README)

### Potential Problems

- Claude returns malformed JSON despite instructions — wrap parse in try/catch, retry with `"Return ONLY valid JSON, no markdown fences"` appended
- GitHub API diff data: very large PRs (1000+ file changes) will exceed Claude's context — truncate file list to top 30 changed files by lines, note this in prompt
- SSE timeout on Vercel: default 10s timeout on Hobby plan — switch to Pro or use edge runtime with `maxDuration = 60`; alternatively use polling (`/api/status/[jobId]`) as fallback
- Rate limiting GitHub API: unauthenticated = 60/hr per IP — on Vercel all requests share Vercel's IPs; set `GITHUB_TOKEN` immediately
- `claude-sonnet` latency for 20 PRs: ~10-20s — acceptable, but add a loading animation (see Step 6)

### Validation

- [ ] `https://github.com/vercel/next.js` returns real scores for real merged PRs
- [ ] SSE stream shows 4 progress events then `result` event (verify in DevTools)
- [ ] Private repo URL returns `PRIVATE_REPO` error event
- [ ] URL with 0 merged PRs returns `NO_PRS` error with suggestion
- [ ] Rate limit exceeded returns `RATE_LIMIT` error with actionable message
- [ ] Claude's JSON output is validated by Zod — tested with a unit test using a fixture response
- [ ] Vitest unit tests: `parseGitHubUrl`, Zod schema validation, score calculation (`totalScore` weighted average)

---

## Step 6 — Dashboard

### Description

Build the results dashboard: repository-level scores, per-PR breakdown table, filtering/sorting, and loading/error states. Visually consistent with the landing page — same tokens, same component primitives.

**Layout:**

```
[Repo header: owner/repo + total score ring]
[3 dimension cards: Impact / AI-Leverage / Quality — aggregated avg]
[Radar chart OR 3 horizontal bar charts for dimension breakdown]
[PR table with filters]
```

**Repository header:**

- `{owner}/{repo}` with GitHub link
- Large `ScoreRing` with total score + label (Excellent ≥ 80 / Good ≥ 60 / Fair ≥ 40 / Poor < 40)
- PR count analyzed, date of analysis

**Dimension cards (3):**

- Average Impact / AI-Leverage / Quality across all PRs
- Mini trend indicator (highest / lowest PR for that dimension)

**Chart:**

- Recommendation: **Radar chart** using `recharts` (already common in Next.js ecosystem, small bundle with tree-shaking) — 3 axes, repo average vs. optional benchmark
- Fallback: 3 horizontal `<progress>` bars if time is tight

**PR table:**

- Columns: Title (link to GitHub PR), Author, Size (±lines / files), Impact, AI-Leverage, Quality, Total Score
- Sortable: click column header toggles asc/desc
- Filterable: author multiselect, score range sliders (min/max per dimension), size filter
- Row expansion: click PR row → inline expanded view with PR summary text from Claude
- Pagination: 10 per page (or virtual scroll if 20 rows feels fine)

**Loading state:**

- Full-page animated loading screen while SSE streams — show progress steps from SSE events
- Skeleton loaders for cards/table while data arrives
- Creative option: animated score rings counting up from 0 on result arrival

**Error state:**

- Centered error card with icon, message, suggested action, "Try another repo" button

### Potential Problems

- `recharts` SSR — use `dynamic(() => import(...), { ssr: false })` to avoid hydration issues with SVG dimensions
- Table sort/filter state in URL params (nice-to-have) vs. local state — use local state for speed, document as future improvement
- PR title truncation: long titles break table layout — CSS `text-overflow: ellipsis` + `max-w` on cell
- Score rings counting-up animation: use `requestAnimationFrame` + `useEffect`, cancel on unmount
- Mobile table: standard table doesn't work on 375px — switch to card-per-row layout below `md` breakpoint

### Validation

- [ ] Dashboard renders correctly with the real API response from Step 5
- [ ] Sorting by each column works correctly (asc/desc toggle, numbers sort numerically not lexicographically)
- [ ] Filtering by author and score range updates the list in real-time
- [ ] Loading state displays with progress messages from SSE
- [ ] Error state renders correctly for each error code (`NO_PRS`, `RATE_LIMIT`, etc.)
- [ ] Mobile layout tested at 375px (table switches to card layout)
- [ ] `ScoreRing` animation runs on dashboard mount

---

## Step 7 — Review, Nice-to-Haves & Polish

### Description

Review the full product end-to-end, address rough edges, and selectively implement nice-to-haves based on remaining time. Prioritize in order listed.

**Priority 1 — Animations & Transitions (~45 min):**

- Scroll-triggered section fade-ups using `IntersectionObserver` (custom `useInView` hook — no library, no bundle weight)
- Hero URL input: subtle focus ring pulse on mount
- Dashboard: score rings count up from 0 on result arrival (`requestAnimationFrame` + `useEffect`)
- Dashboard cards: staggered entrance on mount
- Page transition landing → results: CSS View Transitions API (Chrome 111+) or simple opacity fade
- Re-check PageSpeed at **https://pagespeed.web.dev/** after adding animations — ensure no CLS regression

**Priority 2 — Shareable URL (high ROI, ~30 min):**

- Results already live at `/results/{owner}/{repo}` — this IS the shareable URL
- Add OG meta tags to the results page (og:title with repo name + score, og:description)
- Dynamic OG image via `next/og` (`ImageResponse`) showing repo name + total score
- "Copy link" button on dashboard header

**Priority 3 — AI Recommendations (~45 min):**

- Add a `recommendations: string[]` field to `RepoAnalysis` schema
- Include in Claude's prompt: "Also return 2–3 concrete recommendations to improve this team's PR quality"
- Render as a "Recommendations" card on the dashboard below the charts

**Priority 4 — Per-Author Aggregates (~45 min):**

- Group PRs by author, compute avg scores per author
- Add "By Author" tab to dashboard switching between PR list and author leaderboard table

**Priority 5 — Export (~30 min):**

- JSON export: `JSON.stringify(repoAnalysis)` → Blob download
- Badge PNG: `html-to-image` or `canvas` — render a score badge (repo name + total score) as PNG

**Code review pass:**

- Run Claude Code skill `.claude/skills/code-review/SKILL.md` on each modified file
- Check: no `any` types, Zod schemas cover all API boundaries, error boundaries on dashboard, no secrets in code
- Run `yarn build` — fix all TypeScript errors and warnings

### Potential Problems

- `IntersectionObserver` with SSR — wrap in `useEffect`, initial state `visible: false` to avoid hydration mismatch
- CSS View Transitions API: only Chrome 111+ — acceptable for a portfolio project, but document the browser support decision
- OG image via `next/og`: easy to forget; do this first in Priority 2; test with https://opengraph.xyz
- Framer Motion adds ~40KB to bundle — avoid it; use CSS transitions + `IntersectionObserver` instead
- `html-to-image` canvas taint from cross-origin images (GitHub avatars) — skip avatars in the badge render

### Validation

- [ ] Scroll animations work without CLS — re-run PageSpeed at **https://pagespeed.web.dev/** and confirm still ≥ 90
- [ ] Score rings animate from 0 on dashboard mount
- [ ] OG preview renders correctly (test at https://opengraph.xyz with the results page URL)
- [ ] "Copy link" button copies the current URL to clipboard
- [ ] Recommendations section renders on dashboard
- [ ] `yarn build` completes with 0 TypeScript errors
- [ ] No `console.error` in browser console on happy path

---

## Step 8 — README, Final Check & Video Preparation

### Description

Write the README, do a final end-to-end QA pass, record the required screen capture, and submit.

**README sections (per spec):**

1. **Local setup** — `npm install` → `cp .env.example .env.local` → `npm run dev` (3 commands max)
2. **Stack + rationale** — Next.js 15 App Router (SSE support, Vercel-native), Tailwind v4 + shadcn/ui (CSS-native tokens, customized to brand), Claude Sonnet (scoring quality), Vitest + Yarn (fast, modern toolchain)
3. **AI workflow** — describe Claude Code setup, `CLAUDE.md`, branch-level code reviews, prompt iteration patterns used
4. **Scoring weights rationale** — Impact 30% / AI-Leverage 35% / Quality 35% — reasoning documented
5. **Design decisions** — max 20 PRs analyzed, batch prompting strategy, in-memory cache TTL, mobile table layout choice
6. **What's next** — GitHub App integration (OAuth for private repos), real-time webhook analysis, team comparison, historical trend charts
7. **Recording link**
8. **Live demo link**

**Final QA checklist:**

- [ ] Happy path: `https://github.com/facebook/react` → full dashboard loads
- [ ] Error paths: private repo, no PRs, invalid URL all show correct error UI
- [ ] Mobile (375px): LP scrolls correctly, dashboard usable, table readable
- [ ] PageSpeed Insights at **https://pagespeed.web.dev/** on live Vercel URL: all 4 metrics ≥ 90 on LP mobile
- [ ] All PR history: each feature built as a separate PR merged to `dev`, with `[cc]` tags on AI-assisted commits
- [ ] `prompts.md` in repo root with 3–4 best prompts from the build

**Screen recording checklist:**

- Minimum 30 continuous minutes
- Show: Claude Code interaction, prompt iteration, reviewing AI output, fixing AI mistakes
- Narrate what you're doing and why
- Optional webcam PiP (bonus points)
- Upload to YouTube (unlisted) or Loom, add link to README

### Potential Problems

- PageSpeed on Vercel preview URL (not `*.vercel.app` — use a custom domain or confirm Vercel domains are not penalized by PageSpeed): Vercel's CDN is fast, should be fine
- Video recording setup: test OBS/Loom capture BEFORE starting — don't discover audio isn't recording 4 hours in
- README length: keep it scannable — use headers and short paragraphs, no walls of text

### Validation

- [ ] README covers all 8 required sections
- [ ] Live demo URL loads and works from an incognito window on mobile
- [ ] GitHub repo is public, `dev` is default branch, all work done via PRs (no direct commits to `dev`)
- [ ] Recording is accessible via shared link (test in incognito)
- [ ] Submission email drafted and ready to send to rafal.moch@photoaid.com

---

## Time Budget Estimate

| Step                             | Estimated Time |
| -------------------------------- | -------------- |
| 1 — Project Init & Tooling       | 25 min         |
| 2 — Walking Skeleton (prototype) | 35 min         |
| 3 — Design System                | 30 min         |
| 4 — Landing Page                 | 75 min         |
| 5 — Backend Integration          | 60 min         |
| 6 — Dashboard                    | 70 min         |
| 7 — Review & Nice-to-Haves       | 45 min         |
| 8 — README, QA, Video            | 30 min         |
| **Total**                        | **~6.5 hours** |

> **Triage rule:** If running over budget, cut in this order: nice-to-haves (Step 7 Priority 4–5), then per-author table, then export. Never cut: LP Lighthouse score, SSE streaming, error handling, or git history quality.

---

## Git Workflow

- Default branch: `dev` — all PRs merged here; `main` reserved for production tags
- Branch naming: `feat/step-1-init`, `feat/step-2-prototype`, `feat/step-3-design-system`, etc.
- Commit message format: `feat: add ScoreRing component [cc]` (AI-assisted) or `fix: correct SSE stream close logic` (manual)
- Each step = 1 PR to `dev` with title + 1–2 sentence description
- `prompts.md` updated progressively with notable prompts after Steps 3, 5, 6
- Use `yarn` for all package management — no `npm` commands in scripts or README
