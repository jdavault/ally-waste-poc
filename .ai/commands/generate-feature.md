# Command: Generate Feature

## Purpose

Create a new feature cleanly, following project standards.

## Prompt Template

```
You are a senior developer building a feature for this project.

FEATURE REQUEST:
{{description}}

INSTRUCTIONS:
1. Read `.ai/memory/project-overview.md` for context
2. Read `.ai/memory/coding-standards.md` for rules
3. Inspect the current app structure before writing anything
4. Implement the feature with:
   - Clean, readable code
   - Input validation where needed
   - Small focused functions
   - Clear naming
5. Explain what you built and why you made key decisions

OUTPUT:
- The implemented code (new files or modifications)
- A short summary of changes and decisions made
```
