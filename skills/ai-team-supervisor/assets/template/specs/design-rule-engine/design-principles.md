# Design Principles

## Purpose

This system is not a design generator. It is a shared layer for guidance, constraints, and review.

## Stable Principles

- Separate `hard rules`, `ux heuristics`, and `aesthetic judgment`; do not collapse them into one checklist.
- Treat `design tokens`, `layout rules`, `component grammar`, and `aesthetic references` as separate inputs into those judgment layers.
- Default to reusable structure first and project-specific styling second.
- Prefer explicit tradeoffs over hidden taste assumptions.
- Keep unresolved design choices visible as profile options or open questions.
- Require screen-level state coverage: loading, empty, error, success, and edge states when relevant.
- Ensure each interactive surface has a clearly dominant next action or explicitly no primary action.
- Destructive actions must be spatially and visually differentiated, confirmable, and recoverable when possible.
- Favor scanability, hierarchy, and workflow throughput over ornamental novelty for operator-facing surfaces.
- Treat aesthetic review as comparative judgment against profile references and anti-patterns, not as absolute truth.
- Remove duplicated local labels or headings when they do not add new information and only consume working space.
- Prefer width-aware layouts that fit the intended working pane before introducing forced minimum widths or overflow.

## Decision Boundaries

Hard rules are appropriate when:

- The condition can be checked directly from design tokens, component structure, or metadata.
- A violation is almost always a bug, regression, or unnecessary inconsistency.

UX heuristics are appropriate when:

- The quality can be reviewed with a structured checklist.
- Tradeoffs exist, but weak outcomes are still easy to identify.

Aesthetic judgment is appropriate when:

- Multiple correct solutions may exist.
- The question is about composition quality, restraint, tone, rhythm, density, or balance.
- Comparison against references is more reliable than a literal pass/fail rule.

## Change Strategy

- Keep core file shapes stable.
- Prefer evolving tokens, layout rules, and DSL contracts over stuffing more prose into prompts.
- Add new profile values and screen templates without rewriting the whole system.
- Promote a repeated review observation into a hard rule only after repeated evidence.
- Keep framework and library bindings in adapter fields or implementation notes, not in the core principle layer.

## Initial Defaults

- Project context defaults to `prosumer utility`.
- Frontend binding defaults to `Next.js App Router`.
- UI library binding defaults to `current repo primitives`, currently `shadcn/ui + Radix + Tailwind CSS`.
- Design token source defaults to `current repo styling layer`, currently `Tailwind CSS v4` until a dedicated token system is chosen.
- Aesthetic profile defaults to `warm restrained editorial utility`, derived from the current reference set.
- Screen-type priority is `undecided`.
- If a future project picks a concrete stack or visual direction, record it in profile fields and agent context, not by editing every rule file.
