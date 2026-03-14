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
npm run ai:refine -- --run-id <run_id> builder "follow-up note"
npm run ai:route -- --run-id <run_id>
npm run ai:work -- planner --run-id <run_id>
npm run ai:validate -- --run-id <run_id>
```

## Expected Workflow

1. Write requirements in `docs/idea.md` or another markdown file.
2. Run `npm run ai:init -- path/to/idea.md`.
3. Capture the printed `run_id` from init and use it explicitly in every later command.
4. Read the generated routing decision in `./.ai/runs/<run_id>/run.json`.
5. Generate the next agent package with `npm run ai:work -- <agent> --run-id <run_id>`.
6. Use that package to run the corresponding Codex session manually.
7. Save the agent JSON output into the expected state file.
8. For design work that touches implementation, capture screenshot evidence before final design review.
9. When UI changes are involved, verify representative screenshots against a short checklist: no redundant local labels, pane-width fit before forced overflow, and stable representative rows or grids.
10. Run `npm run ai:route -- --run-id <run_id>` again and continue until done.
11. If follow-up feedback arrives after completion, reopen the run with `npm run ai:refine -- --run-id <run_id> <agent> <note>`.

## State Files

- `./.ai/runs/<run_id>/run.json`
- `./.ai/runs/<run_id>/plan.json`
- `./.ai/runs/<run_id>/memory.json`
- `./.ai/runs/<run_id>/design.json`
- `./.ai/runs/<run_id>/build.json`
- `./.ai/runs/<run_id>/verify.json`
- `./.ai/runs/<run_id>/reviews/design-review.json`
- `./.ai/runs/<run_id>/reviews/code-review.json`
- `run.json.revision` and `run.json.refinement_notes` for lightweight iteration tracking

## Task Memory

- Reusable project patterns live under `./.ai/knowledge/patterns`
- `npm run ai:init` snapshots the most relevant patterns into `./.ai/runs/<run_id>/memory.json`
- Agents should treat `memory.json` as the shared, run-specific source of truth instead of reading the knowledge base directly
- There is no repo-global active run pointer. Parallel work should use explicit `run_id` values.

## Current Quick Wins

- Repo-local actions can wrap screenshot capture, changed-file linting, and validate-plus-route.
- Design review now expects screenshot evidence for implementation-facing critique.
- Runs can be reopened for refinement without creating a brand new run.
- Planner and Builder should separate data-shape changes from rendering changes when both are involved in the same feature.
