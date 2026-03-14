# AI Team MVP

## What This Adds
- A repo-level `AGENTS.md` for system-wide operating rules
- Prompt files for each agent under `./agents`
- Shared state schemas under `./.ai/schemas`
- A lightweight supervisor CLI under `./scripts/ai-team`

## MVP Boundaries
- The supervisor does not yet spawn Codex sub-agents automatically.
- It prepares and validates the protocol: run state, next step, and agent work packages.
- This keeps the first version simple while preserving a clean upgrade path to automated handoffs.

## Commands

```bash
npm run ai:init -- docs/idea.md
npm run ai:route
npm run ai:work -- planner
npm run ai:validate
```

## Expected Workflow
1. Write requirements in `docs/idea.md` or another markdown file.
2. Run `npm run ai:init -- path/to/idea.md`.
3. Read the generated routing decision in `./.ai/runs/<run_id>/run.json`.
4. Generate the next agent package with `npm run ai:work -- <agent>`.
5. Use that package to run the corresponding Codex session manually.
6. Save the agent JSON output into the expected state file.
7. Run `npm run ai:route` again and continue until done.

## State Files
- `./.ai/state/current-run.json`
- `./.ai/runs/<run_id>/run.json`
- `./.ai/runs/<run_id>/plan.json`
- `./.ai/runs/<run_id>/memory.json`
- `./.ai/runs/<run_id>/design.json`
- `./.ai/runs/<run_id>/build.json`
- `./.ai/runs/<run_id>/verify.json`
- `./.ai/runs/<run_id>/reviews/design-review.json`
- `./.ai/runs/<run_id>/reviews/code-review.json`

## Task Memory
- Reusable project patterns live under `./.ai/knowledge/patterns`
- `npm run ai:init` snapshots the most relevant patterns into `./.ai/runs/<run_id>/memory.json`
- Agents should treat `memory.json` as the shared, run-specific source of truth instead of reading the knowledge base directly

## Next Upgrade
- Wrap each agent package in a Codex CLI invocation script
- Add preview screenshot capture for design review
- Add automatic command execution for verifier actions
