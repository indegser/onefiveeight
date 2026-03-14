# Design Rule Engine

This directory holds the reusable design judgment layer for the Codex multi-agent workflow.

The system is split into three independent judgment layers:

1. `hard-rules`: mechanically checkable constraints.
2. `ux-heuristics`: checklist-style usability guidance.
3. `aesthetic-judgment`: rubric and reference based critique, not fixed if/else logic.

The implementation stack that feeds those layers should be modeled separately:

1. `design-tokens`: spacing, type, color, radius, shadow, grid.
2. `layout-rules`: grid, alignment, grouping, rhythm.
3. `component-grammar`: reusable UI composition expectations.
4. `aesthetic references`: profile and anti-pattern guidance.

Design-specific values that may change by project should remain in profiles, token files, and templates, not hard-coded into agent prompts.

Core files:

- `design-principles.md`: stable operating principles and decision boundaries.
- `core-reference-stack.md`: foundational references that define the engine grammar.
- `design-tokens.template.json`: starter token model for future project binding.
- `layout-rules.json`: structured layout math and spacing rules.
- `ux-heuristics.md`: review checklist for usability and interaction quality.
- `aesthetic-profile.json`: draft profile candidates, anti-patterns, and unresolved choices.
- `allowed-patterns.json`: reusable UI patterns that are encouraged.
- `banned-patterns.json`: patterns that should be avoided or explicitly justified.
- `design-review-rubric.json`: structured scoring model for design review.
- `dsl/`: design spec language drafts for `idea -> DSL -> UI`.
- `screen-types/`: per-screen-type context templates and review focus areas.
- `contexts/`: agent-readable context shapes.

Workflow intent:

- Design Agent reads this directory before producing `design.json`.
- Builder reads design output plus builder context constraints derived from these specs.
- Design Critic scores against the rubric and emits structured review JSON.
- Supervisor can decide `refine` vs `done` from critic output severity, confidence, and gating flags.
