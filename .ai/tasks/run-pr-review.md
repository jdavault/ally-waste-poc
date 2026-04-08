# Task: Run PR Review

## Purpose

End-to-end workflow for reviewing code changes using the PR review agent.

## Steps

### Step 1 — Get the Diff
- Run `git diff` for unstaged changes, or
- Run `git diff --staged` for staged changes, or
- Run `git diff main...HEAD` for all changes on the current branch

### Step 2 — Load the Agent
- Read `.ai/agents/pr-review-agent.md` for personality and rubric

### Step 3 — Execute Review
- Apply the PR review agent rubric to the diff
- Evaluate every changed file

### Step 4 — Report Findings
- Group by severity:
  - 🔴 **Critical** — bugs, security issues, data loss risks
  - 🟡 **Warning** — edge cases, maintainability, unclear logic
  - 💡 **Suggestion** — naming, structure, minor improvements
  - ✅ **What looks good** — acknowledge solid work
- Every finding must reference a specific file and line
- Every finding must be actionable — no vague complaints

### Step 5 — Summary
- One-line verdict: approve, request changes, or needs discussion
- Count of findings by severity
