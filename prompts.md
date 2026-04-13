Co-authored-by: Claude <claude@anthropic.com>

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
