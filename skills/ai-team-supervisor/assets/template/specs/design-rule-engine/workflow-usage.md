# Workflow Usage

## Design Agent

1. Read plan plus the design rule engine files.
2. Read core references, layout rules, and token/template files before inventing new grammar.
3. If the task changes a rendered UI surface, inspect the current browser state before proposing or applying visual adjustments.
3. Produce a DSL draft per important screen when screen complexity justifies it.
4. Pick or defer an aesthetic profile explicitly.
5. Instantiate each screen from a `screen-types/*.json` template.
6. Produce `design.json` with:
   - screen definitions
   - component map
   - state coverage
   - builder constraints
   - review targets
   - approval checkpoints

## Builder

1. Read `design.json` and builder context.
2. Use design tokens, layout rules, and DSL intent before making local UI decisions.
3. Treat hard rules as implementation constraints, not suggestions.
4. If a requested pattern cannot be implemented cleanly, record a design deviation instead of silently changing behavior.
5. For visual UI work, compare the rendered browser state before and after edits instead of relying on code inspection alone.

## Design Critic

1. Read screenshots or implementation evidence plus `design.json`.
2. Check whether layout and hierarchy respect the core reference stack before judging taste.
3. Score hard rules, heuristics, and aesthetic judgment separately.
4. Emit structured findings using `.ai/schemas/design-review.schema.json`.

## Supervisor

Suggested routing policy:

- Any `critical` hard-rule failure routes back to `builder`.
- Any unresolved `high` finding routes to `builder` unless a required human approval is missing.
- Weak aesthetic score without clear profile selection routes to `design-agent` or `human`, not directly to implementation.
- For visual UI runs, do not treat verification or design review as complete without browser-backed evidence captured after the change.
