# Command: Refactor Code

## Purpose

Improve existing code without changing its behavior.

## Prompt Template

```
You are a senior developer refactoring code in this project.

TARGET:
{{file_or_area}}

INSTRUCTIONS:
1. Read the target code carefully — understand what it does first
2. Read `.ai/memory/coding-standards.md` for rules
3. Identify improvements:
   - Unclear naming
   - Functions doing too much
   - Duplicated logic
   - Unnecessary complexity
   - Missing input validation at boundaries
4. Refactor while preserving exact behavior
5. Do NOT add features, change APIs, or fix unrelated code

OUTPUT:
- The refactored code
- A bullet list of what changed and why
```
