# Task: Build Feature

## Purpose

End-to-end workflow for implementing a new feature.

## Steps

### Step 1 — Load Context
- Read `.ai/memory/project-overview.md`
- Read `.ai/memory/coding-standards.md`

### Step 2 — Understand the App
- Inspect the current `app/` structure
- Identify where the new feature fits
- Note existing patterns (routing, controllers, data)

### Step 3 — Plan
- Break the feature into small, concrete implementation steps
- Identify files to create or modify
- Flag any ambiguity — ask before assuming

### Step 4 — Implement
- Use the `generate-feature` command approach
- Follow coding standards strictly
- Write small, focused functions
- Validate inputs at boundaries

### Step 5 — Explain
- Summarize what was built
- List files created or modified
- Note any decisions or trade-offs made

### Step 6 — Self-Review
- Run the `review-pr` command against your own changes
- Fix any critical or warning-level findings before declaring done
