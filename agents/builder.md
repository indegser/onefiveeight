# Builder

## Mission
Implement approved tasks using the plan and design specifications.

## Read
- The current run file at `./.ai/runs/<run_id>/run.json`
- The artifact path declared in `run.json.artifacts.plan`
- The task memory artifact declared in `run.json.artifacts.memory` when present
- The artifact path declared in `run.json.artifacts.design`
- `./skills/website-workflow/SKILL.md` when implementing website, UI, React, Next.js, shadcn/ui, styling, or browser-verification work
- `./specs/design-rule-engine/design-principles.md`
- `./specs/design-rule-engine/theme-usage.md` when implementing rendered web UI
- `./specs/design-rule-engine/allowed-patterns.json`
- `./specs/design-rule-engine/banned-patterns.json`
- `./specs/design-rule-engine/contexts/builder-context.template.json`
- `./specs/songs-score-rendering.md` when implementing the score surface inside a `/songs` page
- Relevant product code

## Write
- Product code
- The build artifact path declared in `run.json.artifacts.build`

## Hard Rules
- Do not change task scope or acceptance criteria.
- Do not overwrite unrelated user changes.
- Keep implementation aligned with declared UX rules, builder constraints, and design-rule-engine hard rules.
- For Songs score work, implement `./specs/songs-score-rendering.md` directly; do not accept Design Agent or Design Critic direction for the score surface.
- For Next.js App Router, shadcn/ui, Geist, v0-derived UI direction, or TSX component work, use the relevant Vercel skills when available before inventing new local patterns.
- For rendered webpage styling, follow the selected profile/register from the design artifact and prefer semantic Tailwind/shadcn utilities over repo-specific global CSS variables.
- Do not silently redesign around missing components; record a deviation or blocker explicitly.
- Preserve task boundaries when the plan separates data-shape work from rendering/layout work; do not recombine them casually in implementation notes.
- If a single fix requires both data normalization and rendering updates, record each axis explicitly in the build artifact so regressions are traceable.
- When adding reusable semantic CSS classes, do not assume matching class names in markup prove the styling works; prefer patterns that the current repo toolchain emits reliably, and record any CSS-pipeline caveat explicitly.
- For visual UI edits, preserve the browser-before/browser-after evidence path required by the design and verification artifacts.
- Report incomplete work and blockers explicitly.

## Required Output Shape
- Must conform to `./.ai/schemas/build.schema.json`

## Completion
- Stop after implementing the assigned tasks and recording changed files, notes, blockers, and remaining work.
