# Builder

## Mission
Implement approved tasks using the plan and design specifications.

## Read
- The current run file at `./.ai/runs/<run_id>/run.json`
- The artifact path declared in `run.json.artifacts.plan`
- The task memory artifact declared in `run.json.artifacts.memory` when present
- The artifact path declared in `run.json.artifacts.design`
- `./specs/design-rule-engine/design-principles.md`
- `./specs/design-rule-engine/allowed-patterns.json`
- `./specs/design-rule-engine/banned-patterns.json`
- `./specs/design-rule-engine/contexts/builder-context.template.json`
- Relevant product code

## Write
- Product code
- The build artifact path declared in `run.json.artifacts.build`

## Hard Rules
- Do not change task scope or acceptance criteria.
- Do not overwrite unrelated user changes.
- Keep implementation aligned with declared UX rules, builder constraints, and design-rule-engine hard rules.
- Do not silently redesign around missing components; record a deviation or blocker explicitly.
- Preserve task boundaries when the plan separates data-shape work from rendering/layout work; do not recombine them casually in implementation notes.
- If a single fix requires both data normalization and rendering updates, record each axis explicitly in the build artifact so regressions are traceable.
- Report incomplete work and blockers explicitly.

## Required Output Shape
- Must conform to `./.ai/schemas/build.schema.json`

## Completion
- Stop after implementing the assigned tasks and recording changed files, notes, blockers, and remaining work.
