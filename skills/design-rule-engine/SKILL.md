---
name: design-rule-engine
description: Apply this repository's design judgment system for UI design, implementation, browser verification, and design review. Use when Codex works on rendered web surfaces, layout, spacing, typography, color, components, shadcn/ui composition, Next.js pages, visual QA, design artifacts, or any agent handoff that must reference specs/design-rule-engine before relying on prose taste.
---

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
- For website tasks, also read `skills/website-workflow/SKILL.md` before selecting external design or implementation guidance.
- Use Vercel skills for implementation-specific guidance when available: `vercel:nextjs`, `vercel:shadcn`, `vercel:geist`, `vercel:v0-dev`, `vercel:react-best-practices`, and `vercel:agent-browser-verify`.
- Treat Anthropic public design skills such as `frontend-design`, `theme-factory`, `brand-guidelines`, `canvas-design`, `web-artifacts-builder`, and `webapp-testing` as external references unless they are installed in the active Codex skill registry.

## By Role

### Design Agent

- Use `contexts/design-agent-context.template.json` as the input shape.
- When a screen is non-trivial, draft a DSL object before finalizing `design.json`.
- Output `design.json` with explicit state coverage, builder constraints, and review targets.
- For web redesigns, cite the chosen Vercel/Anthropic reference guidance in builder constraints or review targets.

### Builder

- Use `contexts/builder-context.template.json` to translate design intent into implementation constraints.
- Record deviations instead of silently redesigning.
- For Next.js or shadcn/ui implementation, use relevant Vercel skill guidance before inventing local patterns.

### Design Critic

- Use `design-review-rubric.json` and emit JSON conforming to `.ai/schemas/design-review.schema.json`.
- Judge aesthetic quality against profile fit and anti-patterns, not vague adjectives alone.
- For web UI implementation review, require browser-backed evidence and check whether the intended Vercel/browser verification guidance was followed.
