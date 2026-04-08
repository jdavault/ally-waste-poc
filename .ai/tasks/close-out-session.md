# Close Out Session

Close out this session using the Close Out Session Agent (`.ai/agents/close-out-session.md`).

Do all of the following:

1. **Summarize** the current working context
2. **Draft/update** `.ai/handoffs/next-session.md`
3. **Identify durable memories** and update the appropriate `.ai/memory/` files
4. **Exclude** dead ends, stale context, and noisy logs
5. **End** with the single best next step for the next session

Run `git status` and `git diff --name-only` to verify actual changes before writing the handoff.
