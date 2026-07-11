# Theme Profile Refresh

## Context

- The current design-rule-engine aesthetic profile candidates are being discarded.
- The replacement should be informed by public design-skill references rather than the existing warm restrained profile set.
- Relevant external references include Anthropic `frontend-design`, OpenAI `frontend-skill`, Impeccable, and UI UX Pro Max.

## Audience

- Agents and builders using this repository's design-rule-engine for website and product UI decisions.

## Goals

- Replace the current selected profile and candidate profiles with a new profile set.
- Keep the profile set useful for both brand-led surfaces and product/workflow surfaces.
- Preserve the repository's separation between aesthetic judgment, UX heuristics, hard rules, and runtime tokens.
- Document which external skills influenced the new profile model, without claiming unavailable Anthropic skills are installed locally.

## Non-Goals

- Do not change rendered product UI in this task.
- Do not change `src/app/globals.css` runtime tokens yet.
- Do not install external skills.

## Acceptance Criteria

- `specs/design-rule-engine/aesthetic-profile.json` no longer uses the old warm restrained candidate set.
- The selected profile reflects a product-first design register suitable for this repository.
- Candidate profiles include clear choices for product surfaces, brand/editorial surfaces, data-dense tools, and visual/music-led surfaces.
- Anti-patterns and open questions reflect the new model.
- AI-team run artifacts stay schema-valid and reference the external skill sources as references only.
