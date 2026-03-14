# Design Rule Engine

Use this skill when the task involves designing, implementing, or reviewing UI in this repository.

## Goal

Apply the repository's shared design judgment layer without freezing unresolved project choices too early.

## Read First

- `specs/design-rule-engine/README.md`
- `specs/design-rule-engine/design-principles.md`
- `specs/design-rule-engine/core-reference-stack.md`
- `specs/design-rule-engine/design-tokens.template.json`
- `specs/design-rule-engine/layout-rules.json`
- `specs/design-rule-engine/ux-heuristics.md`
- `specs/design-rule-engine/aesthetic-profile.json`
- `specs/design-rule-engine/allowed-patterns.json`
- `specs/design-rule-engine/banned-patterns.json`
- `specs/design-rule-engine/design-review-rubric.json`
- `specs/design-rule-engine/dsl/design-spec.template.json`

## Operating Rules

- Keep hard rules, heuristics, and aesthetic judgment separate.
- Treat core references, tokens, layout math, and DSL as first-class system inputs.
- Do not lock in library, token, or aesthetic choices unless the user or an approved spec has decided them.
- When context is missing, preserve placeholders and open questions in structured fields.
- Treat `screen-types/*.json` as starting templates, not rigid final specs.

## By Role

### Design Agent

- Use `contexts/design-agent-context.template.json` as the input shape.
- When a screen is non-trivial, draft a DSL object before finalizing `design.json`.
- Output `design.json` with explicit state coverage, builder constraints, and review targets.

### Builder

- Use `contexts/builder-context.template.json` to translate design intent into implementation constraints.
- Record deviations instead of silently redesigning.

### Design Critic

- Use `design-review-rubric.json` and emit JSON conforming to `.ai/schemas/design-review.schema.json`.
- Judge aesthetic quality against profile fit and anti-patterns, not vague adjectives alone.
