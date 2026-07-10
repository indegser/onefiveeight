---
name: ai-team-supervisor
description: Operate this repository's Supervisor workflow for AI-team runs. Use when Codex needs to create or resume a run, inspect ./.ai/runs/RUN_ID state, decide the next agent, route work to Planner, Design Agent, Builder, Verifier, Design Critic, or Code Critic, enforce worktree and approval rules, call repo-local skills such as website-workflow and design-rule-engine, or mark a run done, refine, blocked, or needs_human without relying on script-owned routing decisions.
---

# AI Team Supervisor

## Overview

Use this skill as the active Supervisor brain for this repository. The Supervisor is an agent/skill workflow, not a script-owned decision engine.

`scripts/ai-team/supervisor.mjs` may initialize runs, validate JSON, print work packages, and perform deterministic state checks. It must not be treated as the source of judgment for routing, refinement, approval, or completion. This skill owns that judgment.

## Required Reads

- `AGENTS.md`
- `agents/supervisor.md`
- `./.ai/runs/<run_id>/run.json`
- Existing artifacts in `./.ai/runs/<run_id>/`
- The next candidate agent prompt under `agents/*.md`
- Relevant repo-local skills for the task, especially `skills/website-workflow/SKILL.md` and `skills/design-rule-engine/SKILL.md` for web work

## Operating Loop

1. Require an explicit `run_id` for any existing run. Do not infer a current run.
2. Inspect `run.json`, phase artifacts, reviews, blockers, approvals, and refinement notes.
3. Confirm non-trivial edit work is in an appropriate task-specific worktree unless the user explicitly chose another checkout.
4. Decide the next minimal role needed.
5. Call or emulate that role by loading its prompt and required skills.
6. Require the role to write the schema-valid artifact for its phase.
7. Validate artifacts with `npm run ai:validate -- --run-id <run_id>` after state changes.
8. Continue routing until the run is `done`, `needs_human`, or blocked by a concrete missing input.

## Routing Rules

- If `plan.json` is missing, route to `Planner`.
- If `design.json` is missing, route to `Design Agent`.
- If the run is brand-critical and brand approval is missing, set `needs_human` before Builder.
- If `build.json` is missing, route to `Builder`.
- If `verify.json` is missing, route to `Verifier`.
- If `verify.passed` is false, route to `Builder` with the blocking issues.
- If `reviews/design-review.json` is missing, route to `Design Critic`.
- If design review is not approved, route to `Builder` or `Design Agent` based on whether the issue is implementation or design spec.
- If `reviews/code-review.json` is missing, route to `Code Critic`.
- If code review is not approved, route to `Builder`.
- If all required artifacts pass and no approvals or blockers remain, mark the run `done`.

## Agent and Skill Dispatch

The Supervisor calls agents by role, then each agent reads the skills it needs:

- `Planner`: read `agents/planner.md`; for website work also read `website-workflow`.
- `Design Agent`: read `agents/design-agent.md`, `design-rule-engine`, and website/Vercel/Anthropic references when applicable.
- `Builder`: read `agents/builder.md`, approved plan/design artifacts, and implementation skills such as `website-workflow`, `vercel:nextjs`, and `vercel:shadcn`.
- `Verifier`: read `agents/verifier.md`; use browser verification guidance for visual UI changes.
- `Design Critic`: read `agents/design-critic.md` and `design-rule-engine`; require browser evidence for rendered UI.
- `Code Critic`: read `agents/code-critic.md`; use React/Next.js quality guidance for TSX work.

Sub-skills do not route the run. They provide domain instructions to the current role.

## State Writes

Update `run.json` only after a routing decision is clear. Record:

- `phase`
- `status`
- `next_agent`
- `blockers`
- `history`

Do not write product code as Supervisor. Do not silently skip required approvals. Do not mark done while verification, design review, or code review is missing.

## Script Boundary

Use scripts as deterministic helpers:

- `npm run ai:init -- <idea-file>` to create a run skeleton.
- `npm run ai:work -- <agent> --run-id <run_id>` to print a role package.
- `npm run ai:validate -- --run-id <run_id>` to validate JSON shape.
- `npm run ai:refine -- --run-id <run_id> <agent> <note>` to clear downstream artifacts for a refinement.

Do not let `npm run ai:route` replace this skill's routing judgment. If used, treat it as a legacy sanity check and reconcile its output with this skill before proceeding.
