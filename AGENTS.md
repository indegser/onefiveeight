# AI Team Operating Manual

## Purpose

- This repository includes an MVP Codex-based multi-agent app building system.
- The system turns `idea.md` or natural-language requirements into a structured build loop.
- The current product code and the AI team system must stay isolated unless a build task explicitly targets the app.

## Global Protocol

- Shared state is the source of truth. Agents must read from and write to the active run directory under `./.ai/runs/<run_id>`.
- Supervisor commands that operate on an existing run must require an explicit `run_id`; do not rely on any repo-global active-run pointer.
- Repo-local helper scripts and action wrappers must also require an explicit `run_id`; do not infer a target run from global or recent state.
- Agent outputs must be valid JSON that conforms to a schema in `./.ai/schemas`.
- The system uses a strict phase loop: `plan -> design -> build -> verify -> review -> refine/done`.
- The `Supervisor` is the only agent allowed to route work to another agent.
- Any task that changes product code must be executed through the `Supervisor` workflow first. Create or resume an active run, produce the required state artifacts for each phase, and only then apply or update code as `Builder` work.
- Visual UI tasks, including layout, spacing, typography, color, component styling, and other rendered-surface changes, must be checked in the browser before edits and after edits; code-only judgment is not sufficient.
- Free-form prose is allowed inside prompt files and docs, but agent handoffs must stay structured.

## Role Boundaries

- `Planner`: decomposes requirements, defines tasks and acceptance criteria, never writes code.
- `Design Agent`: defines UX structure, component map, and interface rules, never writes code.
- `Builder`: writes code only for approved tasks and must not redefine scope.
- `Verifier`: runs checks and reports failures, never edits code.
- `Design Critic`: reviews UX quality and consistency, never edits code.
- `Code Critic`: reviews implementation quality and maintainability, never edits code.
- `Supervisor`: manages state, routing, escalation, and completion, never writes product code.

## Repository Locations

- Per-run state: `./.ai/runs/<run_id>`
- Schemas: `./.ai/schemas`
- Agent prompts: `./agents`
- Design rule engine specs: `./specs/design-rule-engine`
- Supervisor runtime: `./scripts/ai-team`
- Long-form design docs: `./docs`
- Optional repo-local skills: `./skills`
- Optional repo-local action wrappers: `./actions`

## Stack Defaults

- Frontend: Next.js App Router
- UI: shadcn/ui
- Language: TypeScript
- Backend: Supabase when the target app needs persistence/auth
- Validation: JSON schema at the protocol level, TypeScript and app checks at the code level

## Internal Tool UX Rules

- Prioritize information density without losing scanability.
- Primary actions must be visually obvious and unique per surface.
- Empty, loading, success, and error states are required for operator-facing flows.
- Destructive actions require confirmation and visible recovery guidance.
- Table, filter, search, and bulk-action patterns should favor repeat operational tasks over marketing-style layouts.
- Remove redundant local labels when a nearby heading already establishes the context.
- Fit dense working layouts to the available pane width before introducing avoidable overflow or hard minimum widths.

## Design Rule Engine

- Repository-wide design judgment must be read from `./specs/design-rule-engine`, not reconstructed ad hoc in each task.
- Keep `hard rules`, `ux heuristics`, and `aesthetic judgment` as separate assets and review layers.
- Project-specific choices that are not yet settled must remain as profile options, placeholders, or open questions.
- Agent handoffs should reference structured design assets and schemas before relying on prose summaries.
- Aesthetic evaluation must use profile fit, anti-pattern checks, and rubric scoring rather than vague style adjectives alone.
- Design changes are not complete until browser evidence has been captured and referenced in design review output.

## Human Approval Policy

- Human approval is required for brand-critical screens.
- Human approval is required before destructive workflow finalization.
- Human approval is recommended after auth/RBAC or data-model decisions.
- The supervisor must stop routing into implementation if a required approval is missing.

## Quality Gates

- No task is complete until its acceptance criteria are satisfied.
- `build`, `lint`, `typecheck`, and tests must pass when applicable.
- Major design issues must be resolved before final completion.
- Major code quality issues must be resolved before final completion.
- Visual UI tasks are not complete until browser evidence has been captured after the change and referenced by verification or review artifacts.
- For UI changes, visual verification must explicitly check representative layout rows for redundant labels and pane-width fit, not just generic screenshots.
- For UI changes that introduce reusable semantic CSS classes, verification must confirm the rendered page and the served CSS both contain the intended rules; do not treat markup-only class presence as sufficient evidence.

## Editing Rules

- Keep the AI team system additive and isolated from unrelated app code.
- When extending the MVP, update schemas before changing inter-agent message formats.
- Prefer small composable scripts over one large orchestrator.
- For every code edit, route the work through `Supervisor`, keep the run artifacts in sync with the actual implementation, and re-run `route` and `validate` before considering the task complete.
