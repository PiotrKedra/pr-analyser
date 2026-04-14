Co-authored-by: Claude <claude@anthropic.com>

in result page when useSse is steraming events and analysis is not rdy, we want to display full page overlay showing that AI is working. 

It should have white bg, on top we will place LottiFiels animation (for now use gray div mock)
Belowe there should be event stream with checks (similiar to current implmentation). But to achive nice visula effect place progress steram in a coniatenr of hiegh 300px, on top and bottom of the conaater add abolsute dives with white/transparetn gradient to achive effect where progress steps shows and disapear
When steram finishes show on result page JSON result as it is done now


Now we are moving to cerate a proper api that gets PR's from github and analysiy it using claude. YOu need to update our prortype

key points:
- Endpoint: GET /repos/{owner}/{repo}/pulls?state=closed&per_page=30 → filter merged_at !== null
- analysy up to 20 merged PR to fit in 60sec timout (vercel)
- For each PR fetch: GET /repos/{owner}/{repo}/pulls/{pull_number}/files → changed files, additions, deletions
- FOr each PR also fetch commit names and send them to claude for analysis
- Model: claude-sonnet-4-20250514
- Strategy: batch prompt — send all PRs in a single message with structured output instructions (faster, cheaper than per-PR calls)
- Prompt structure:
  System: You are a senior engineering manager evaluating pull requests...
  User: Analyze these {n} pull requests and return ONLY a JSON array...
  [PR data: title, description, author, additions, deletions, changed files list]
- Use Zod to validate Claude's JSON output — if malformed, retry once with a stricter prompt
- Scoring weights (document in README): Impact 20%, AI-Leverage 40%, Quality 40%
  Reasoning: AI-Leverage slightly elevated — this tool targets AI-first teams where that signal is most diagnostic; Quality and Impact weighted equally as the two pillars of engineering health
- we need to steream events while analysing, steram: PR downliadn -> how much PR downloaded -> PR filed/PR commits for each PR steram an event -> when starting claude analysis steram event "Analysing code"
- Error handling:
  - 404 from GitHub → INVALID_REPO (repo doesn't exist or is private)
  - 0 merged PRs → NO_PRS error event with message + suggestion
  - GitHub 403 / 429 → RATE_LIMIT with suggestion to add a token
  - Claude API error → surface as generic ANALYSIS_FAILED
  - Claude API -> rate limit

We are working on landing page secitons now. We already have implemented hero and social proof. 
- For each seciton i will provide u a basic instruction and ui guidelines.
- each section need to be responsive and seo friendly
- if i dont provide pls generate a copy if needed
- each section besieds footer should have a h2 title
- each seciton should matche and reuses alredy defined styles/components

Sections:
1. **How It Works** - 3 steps with icons: (1) Paste GitHub URL → (2) AI analyzes pull requests → (3) View detailed scores. Each step should have h3 title and short description. Above the h3 pls add a squere graphics with the step in left top corner - graphis should be done using html and css, for step 1 - some filled input with github url, step 2: loading icon from tabler icons (spinner animation - tailwind) and few PR's with check ejomji Anylising PR 1: Landing page, Analysing PR 2..., step 3: some scoring/table preview
2. **What We Score** - 3 cards: Impact / AI-Leverage / Quality; each with icon, name, description - icon should be from tabler icons and placed insied circle div - icon itslef should have primary color
3. **Example Dashboard Preview** - 4 cards with example preview showing mock result - desktop layout: 2 rows, first row splits 66/33, and second row splits 33/66. On mobile we have one column and each card has same width. Each card should be transapren color but with neutral border around it - each card should have graphic (for now it can be a gray color), h3 title and short description. Whole section should be on conainer with white bg so it cuts from the rest of the page - white bg should be from one side of the screen to another, without any spacing
4. **Footer** - regular footer, on desktop it should have 4 columns: first one about the product with procut logo (same as in the header), rest of the columns should be a mocked links that naviaget to /mocked-page (create a basic mocked page - very simple). At the bottom of the footer we should have copyrigh info


Need to apply few changes to the landing page
1. **How It Works** -> justify h2 to the left. Make the height of the grafhics smaller ~200px. Each graphic is too boring, make a URL graphic (input and button larger, so it overflows left and right from the card, but to the card itsefl add overflow hidden to get a nice effect). For AI analyses every PR make a graphic overflows the right border and loading animation should be shown only when user hovers on this graphic. For "Get your scorecard" -> alos make the table wider so it overflows to the right border.
2. **What We Score** -> justify to the left icon and texts and h2. Remove card wrapper - it should be just a icon, text, description. Remove percentage info from each title
3. **Example Dashboard Preview** -> make the seciton max width 764px and add description below h2. Each graphic should be touching top and right border of the card
4. General fixes: increas spacing between section to 6.5rem, each h2 should have m-b 45px (if there is a description belowe, then h2 and description both should have 45px margin at the bottom - combine them into 1 div)

- file naming convention
- input styling and error state
- logo seciton 5 by 2 (visible directly belwoe hero seciotn without scrolling)


Create a design system setup using tailwind, belowe u have basic info about the colors. Pls then addjust Button.tsx component and build Link.tsx commponent using next Link

4D42E0 - btn bg primary color
FFFFFF - btn color text
3D35AC - btn bg hover color
F3F9FB - bg color of whole page
1D243A - regular text color

regular link <a> tags should user regular text color and a:hover {
opacity: 0.6;
text-decoration: underline;
}



based on plan.md file and zadanie_rekrutacyjne_photoaid.md create a CLAUDE.md rules for the project

pls add a code reivew skill to .claude/skills/code-review/SKILL.md it should verifys provided code. first step is to detect the pice fo code ## Step 1: Scope Detection - branch,  
feature, single file, second step ## Step 2: Review Axes -> based on /Users/piotrkedra/development/projects/web/pr-analyser/plan.md pls preapre ther reviing axes, ## Step 3: Output  
Format

For each finding, report using these severity levels:  
**CRITICAL** — violates a hard rule that will cause bugs or breaks established contracts  
**WARNING** — deviates from target patterns; should be addressed in new code  
**SUGGESTION** — improvement opportunity, non-blocking

### Output template:

```
## Code Review: {path reviewed}

### Findings

#### CRITICAL
- **[Axis N — Category]** Description of the issue.
  - File: `path/to/file.ts:lineNumber`
  - Expected: what it should look like
  - Reference: canonical file path

#### WARNING
- **[Axis N — Category]** Description of the issue.
  - File: `path/to/file.ts:lineNumber`
  - Why: explanation of why the target pattern is preferred

#### SUGGESTION
- **[Axis N — Category]** Description of the improvement.
  - File: `path/to/file.ts:lineNumber`

### Summary
{1-2 sentence summary: X critical, Y warnings, Z suggestions}
```
