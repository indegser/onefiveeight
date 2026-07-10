# AI Team Operating Manual

## Purpose

- This repository includes an MVP Codex-based multi-agent app building system.
- The system turns `idea.md` or natural-language requirements into a structured build loop.
- The current product code and the AI team system must stay isolated unless a build task explicitly targets the app.

## Global Protocol

- Shared state is the source of truth. Agents must read from and write to the active run directory under `./.ai/runs/<run_id>`.
- Supervisor skill operations and helper commands that operate on an existing run must require an explicit `run_id`; do not rely on any repo-global active-run pointer.
- Repo-local helper scripts and action wrappers must also require an explicit `run_id`; do not infer a target run from global or recent state.
- At the start of each new session, check the current git branch before doing substantive work.
- Prefer starting from `main`. If the current branch is not `main`, do not assume that branch should be reused; report the branch state and choose deliberately.
- When already on `main`, check whether `main` is behind its remote and fast-forward pull it before starting work when safe.
- Before choosing whether to reuse a branch or open a new PR, check the remote state explicitly: fetch remotes, compare the local branch against its upstream, and verify whether any related PR is still open, already merged, or closed.
- Do not assume an existing local feature branch is still the correct target just because it has the right name. Remote branch status and PR status take precedence over local assumptions.
- Do not auto-pull if the worktree has local changes, if the pull would require a merge or rebase decision, or if updating would risk overwriting in-progress work. In those cases, report the state instead.
- For non-trivial coding, documentation, AI-team, website, data, release, or workflow tasks, create or reuse a task-specific worktree before editing files unless the user explicitly provides a different target checkout.
- Agent outputs must be valid JSON that conforms to a schema in `./.ai/schemas`.
- The system uses a strict phase loop: `plan -> design -> build -> verify -> review -> refine/done`.
- The `Supervisor` is the only agent allowed to route work to another agent. Use `./skills/ai-team-supervisor/SKILL.md` as the routing authority; scripts are deterministic helpers, not the owner of routing judgment.
- Any task that changes product code must be executed through the `Supervisor` workflow first. Create or resume an active run, produce the required state artifacts for each phase, and only then apply or update code as `Builder` work.
- Visual UI tasks, including layout, spacing, typography, color, component styling, and other rendered-surface changes, must be checked in the browser before edits and after edits; code-only judgment is not sufficient.
- Free-form prose is allowed inside prompt files and docs, but agent handoffs must stay structured.

## Autonomous Worktree Management

- Before editing files, run `git status --short --branch`, `git branch --show-current`, `git fetch --prune origin` when network is available, and `git worktree list`.
- Treat the main checkout at `/Users/indegser/Github/onefiveeight` and the `main` branch as shared coordination space.
- If the current checkout has unrelated changes, is on an unrelated branch, is dirty, or is the shared main checkout, create or reuse a task-specific worktree under `../onefiveeight-worktrees/<short-task-slug>`.
- Use branch names like `codex/<short-task-slug>`, based on a short kebab-case summary of the request.
- Base new worktrees on `origin/main` unless the user names a different base.
- Reuse an existing task worktree only when its path and branch clearly match the current request and its dirty state is clean or clearly belongs to the same task.
- If a matching worktree has ambiguous dirty changes, preserve it and create a suffixed worktree instead of overwriting, stashing, or cleaning it.
- Do all edits, verification, commits, and task-specific commands inside the chosen worktree.
- Do not use `git stash` as routine context switching between concurrent tasks.
- Do not switch branches in a dirty worktree just to reach another task.
- Skip worktree creation only for trivial read-only checks and direct answers, or when the user explicitly instructs a specific checkout.
- When a task-specific worktree is created, report the path and branch in the final response.

## Website Skill Protocol

- Website work means rendered web surfaces, Next.js pages, React components, shadcn/ui components, CSS/Tailwind styling, layout, spacing, typography, color, visual polish, and browser verification.
- For website work, read `./skills/website-workflow/SKILL.md` and `./skills/design-rule-engine/SKILL.md` before implementation or design review.
- Apply the repo-local `./specs/design-rule-engine` as the source of design judgment before external style references.
- Use Vercel skills when available for implementation-specific guidance:
  - `vercel:nextjs` for App Router, routing, rendering, and framework behavior.
  - `vercel:shadcn` for shadcn/ui composition, theming, and Tailwind integration.
  - `vercel:geist` for Geist typography and type-system decisions.
  - `vercel:v0-dev` for UI exploration and component direction.
  - `vercel:react-best-practices` after meaningful TSX/component edits.
  - `vercel:agent-browser-verify` after dev server start or rendered UI changes.
- Anthropic public design skills may be used as external references when available, especially `frontend-design`, `theme-factory`, `brand-guidelines`, `canvas-design`, `web-artifacts-builder`, and `webapp-testing`.
- Do not claim an Anthropic design skill is installed unless it appears in the active Codex skill registry. If it is unavailable, state that and use public Anthropic skill material only as reference.
- Visual UI tasks must include browser evidence before edits and after edits. Verification must check representative rows or grids, redundant labels, available-width fit, and served CSS for new semantic classes.

## Deployment Protocol

- When the user asks to deploy, do not run `vercel --prod` or otherwise deploy directly from the local machine.
- Deployment must go through GitHub: commit the requested changes, push a branch, open a PR, wait for required checks including Vercel preview, merge the PR into `main`, and let the GitHub-to-Vercel integration trigger production deployment.
- After merging to `main`, confirm the production Vercel deployment reaches `Ready` and verify the public production URL responds successfully.
- Report the PR URL, merge commit, production deployment URL, and public access URL.

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
- Supervisor skill: `./skills/ai-team-supervisor/SKILL.md`
- Supervisor helper scripts: `./scripts/ai-team`
- Long-form design docs: `./docs`
- Optional repo-local skills: `./skills`
- Optional repo-local action wrappers: `./actions`
- Task worktrees: `../onefiveeight-worktrees/<short-task-slug>`

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
- For every code edit, route the work through `$ai-team-supervisor`, keep the run artifacts in sync with the actual implementation, and run `validate` before considering the task complete. Treat `npm run ai:route` as a legacy advisory helper, not the source of routing judgment.
