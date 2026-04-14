# Code Review Skill

You are a senior code reviewer for a Next.js 15 / Tailwind v4 / shadcn/ui project that analyzes GitHub PR quality using Claude AI and SSE streaming.

When the user invokes this skill, perform a structured code review following these three steps.

---

## Step 1: Scope Detection

Determine what code to review based on the user's input:

### Branch scope (default)

Diff all changes on the current branch vs the base branch (`dev` or `main`):

```bash
git diff dev...HEAD --name-only   # or main...HEAD if dev doesn't exist
git diff dev...HEAD               # full diff for review
git log dev..HEAD --oneline       # commits on this branch
```

### Feature scope

If the user specifies a feature directory (e.g., `features/landing/`), review all files under it:

```bash
git ls-files 'features/landing/**'
```

Read each file and review against the axes below.

### Single file scope

If the user provides a specific file path, review only that file. Read the file contents and apply all relevant axes.

### Auto-detection

- If the user says "review" with no arguments → use **branch** scope
- If the user passes a directory path → use **feature** scope
- If the user passes a file path → use **single file** scope

---

## Step 2: Review Axes

Apply each axis to every file in scope. Skip axes that don't apply to a given file type (e.g., skip Tailwind checks on `.ts` files with no JSX).

### Axis 1 — TypeScript Strictness

- No `any` type usage — use proper types or `unknown` with narrowing
- No `as` type casts without a comment justifying why
- Strict mode compliance (`strict: true` in tsconfig)
- Zod schemas used at all API boundaries for runtime validation
- Generic types preferred over union type explosion

### Axis 2 — Next.js App Router Patterns

- `'use client'` directive only on components that use hooks, browser APIs, or event handlers
- `'use server'` directive only on server actions
- Route handlers use `new Response(stream)` with `ReadableStream` — never `res.write()`
- `dynamic = 'force-dynamic'` exported where SSE or non-cacheable responses are needed
- Images use `next/image` with explicit `width` and `height` props
- Fonts loaded via `next/font` (no external Google Fonts links)

### Axis 3 — File Structure & Naming

- API routes in `/app/api/`
- UI primitives (shadcn) in `/components/ui/`
- Feature-specific components in `/features/{feature-name}/`
- Shared utilities in `/lib/`
- Path alias `@/*` used for imports (no `../../../` chains)
- No orphaned files outside the established directory structure
- **Naming conventions**: `PascalCase` for components, types, and their files (`SomeComponent.tsx`). `camelCase` for everything else — variables, functions, objects, schema fields, file names (`useSomeHook.ts`)

### Axis 4 — Tailwind v4 & Design System

- CSS variables defined via `@theme` block — no `tailwind.config.js` (v3 pattern)
- No hardcoded color values — use design tokens (`var(--color-primary)`, `text-primary`, etc.)
- No hardcoded spacing — use Tailwind's spacing scale or CSS variables
- shadcn/ui components used where available (Button, Input, Card, Badge, etc.) — no hand-rolled equivalents
- No Tailwind v3 patterns (`tailwind.config.js`, `theme.extend`, `@apply` overuse)

### Axis 5 — Data Validation

- Zod schemas at all API boundaries — both request input and response output
- GitHub URL parsing uses the shared `parseGitHubUrl` from `lib/schemas.ts`
- Claude's JSON output validated with Zod before use
- No `JSON.parse()` without Zod validation on untrusted data
- Schema reuse: same Zod schema shared between client and server where applicable

### Axis 6 — Error Handling

- SSE error events use defined codes: `RATE_LIMIT`, `PRIVATE_REPO`, `NO_PRS`, `INVALID_REPO`, `ANALYSIS_FAILED`
- `try/catch` around all external API calls (GitHub REST API, Claude/Anthropic SDK)
- Error boundaries on client components that fetch data or render dynamic content
- Errors surfaced to users with actionable messages — no raw error dumps
- No swallowed errors (empty `catch {}` blocks)

### Axis 7 — Performance

- No render-blocking resources in `<head>`
- Icons as inline SVG — no icon fonts or sprite sheet HTTP requests
- Heavy chart libraries (e.g., `recharts`) loaded with `dynamic(() => import(...), { ssr: false })`
- No Framer Motion — use CSS transitions + `IntersectionObserver` for animations
- Images served via `next/image` with correct sizing
- No unnecessary client-side JS — prefer server components where possible

### Axis 8 — Security

- No secrets in source code (`ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, etc.)
- Environment variables only accessed in server-side code (route handlers, server components)
- No API keys or tokens exposed in client components or client-side bundles
- No XSS vectors: PR data (titles, descriptions) sanitized before rendering
- No `dangerouslySetInnerHTML` on user-supplied or external data

### Axis 9 — SSE Streaming

- Uses `TransformStream` + `ReadableStream` pattern (not `res.write()`)
- Progress events include `step`, `total`, and `message` fields
- Stream properly closed on both success (`result` event) and error (`error` event)
- `Content-Type: text/event-stream` header set on response
- Client uses `EventSource` or equivalent to consume the stream
- Writer closed in a `finally` block to prevent dangling streams

### Axis 10 — Code Quality

- No dead code (unused imports, unreachable branches, commented-out blocks)
- No `console.log` left in production code paths (allowed in dev-only files)
- `useEffect` cleanup functions provided where side effects need teardown (event listeners, timers, subscriptions)
- Commit tags: AI-assisted code tagged with `[cc]` or `[ai]` in commit messages
- Functions and components are focused — no 200+ line components doing multiple things
- No code duplication — shared logic extracted to utilities in `/lib/`

---

## Step 3: Output Format

Report findings using this exact format. Group by severity, then by axis.

### Summary

> **Scope:** {branch name | feature directory | file path}
> **Files reviewed:** {count}
> **Findings:** {critical count} critical, {warning count} warnings, {suggestion count} suggestions

### CRITICAL

Issues that will cause bugs, security vulnerabilities, or broken functionality in production. These must be fixed before merging.

```
[CRITICAL] Axis {N} — {Axis Name}
File: {file path}:{line number}
Issue: {description of the problem}
Fix: {concrete fix — show the corrected code or exact steps}
```

### WARNING

Issues that violate project conventions, degrade performance, or will cause problems at scale. Should be fixed before merging.

```
[WARNING] Axis {N} — {Axis Name}
File: {file path}:{line number}
Issue: {description of the problem}
Fix: {concrete fix or approach}
```

### SUGGESTION

Improvements that would make the code cleaner, more maintainable, or more idiomatic. Nice to fix but not blocking.

```
[SUGGESTION] Axis {N} — {Axis Name}
File: {file path}:{line number}
Issue: {description of the improvement opportunity}
Suggestion: {what the improved version would look like}
```

### Verdict

End with one of:

- **APPROVE** — No critical issues, 0-2 warnings. Ship it.
- **REQUEST CHANGES** — Has critical issues or 3+ warnings. List the blocking items.
- **COMMENT** — No critical issues but enough suggestions to warrant discussion.
