# Theme Reference Protocol

## Context

- Theme direction should not be hard-coded as repo-specific CSS variables in `globals.css`.
- Webpage changes should instead always consult the design-rule-engine aesthetic profile and theme usage protocol.
- Existing rendered surfaces currently reference `--tone-*`, `--space-*`, and related theme baseline variables directly from TSX.

## Goals

- Add a documented protocol that makes web work read and record the selected design profile before changing rendered surfaces.
- Connect that protocol to website workflow and agent prompts so future webpage edits consistently reference the theme profile.
- Remove the repo-specific theme baseline variables from `src/app/globals.css`.
- Replace existing TSX references to those variables with existing shadcn/Tailwind semantic utilities or local component classes that do not depend on a custom theme baseline.

## Non-Goals

- Do not redesign the pages visually beyond the minimal migration required to remove custom CSS variables.
- Do not remove shadcn/Tailwind runtime variables required by the UI system.
- Do not install external design skills.

## Acceptance Criteria

- `src/app/globals.css` no longer defines `--tone-*`, `--space-*`, `--leading-*`, `--tracking-*`, or `--font-body/display/code` theme baseline variables.
- No source TSX file references those removed variables.
- Website workflow and relevant agent prompts require reading the theme usage protocol for rendered web work.
- Browser verification captures before/after evidence for `/songs`, a song detail page, and `/quiz`.
- AI-team artifacts validate for the run.
