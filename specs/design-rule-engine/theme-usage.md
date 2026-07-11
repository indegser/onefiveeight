# Theme Usage Protocol

## Purpose

Theme direction is a design decision layer, not a global CSS dump. Webpage work must consult the selected aesthetic profile before changing rendered UI, then record the chosen register and any deviations in run artifacts.

## Source of Truth

- Primary profile source: `specs/design-rule-engine/aesthetic-profile.json`
- Review support: `specs/design-rule-engine/allowed-patterns.json`, `specs/design-rule-engine/banned-patterns.json`, and `specs/design-rule-engine/design-review-rubric.json`
- Runtime CSS source: `src/app/globals.css` only for Tailwind/shadcn runtime variables, base styles, and framework-required theme hooks

Do not encode repository-specific theme baselines as custom globals such as `--tone-*`, `--space-*`, or one-off type classes. If a screen needs new tokens, create a design task that updates the token contract and browser-verifies the rendered result.

## Required Flow For Web Changes

1. Read `aesthetic-profile.json` and select the profile/register that matches the surface:
   - `product-craft-workbench` for app pages, editors, settings, and normal product workflows.
   - `brand-signal-editorial` for landing, public narrative, and first-impression brand surfaces.
   - `dense-ops-console` for tables, queues, diagnostics, and high-throughput expert workflows.
   - `music-visual-instrument` for scores, chords, fretboards, playback, and music-learning surfaces.
2. Record the selected profile in `design.json.design_rule_engine.profile_id`.
3. Record builder constraints that translate the profile into layout, type, color, density, and motion decisions for the specific screen.
4. Use Tailwind/shadcn semantic utilities first: `bg-background`, `text-foreground`, `bg-card`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-primary`, and `text-primary-foreground`.
5. Avoid raw hex values and arbitrary CSS variables in TSX unless the design artifact explicitly approves a one-off visual decision.
6. Browser-verify visual edits before and after implementation.

## Review Checks

Design review should check:

- The selected profile matches the surface type.
- The implementation avoids the selected profile's anti-patterns.
- Any deviation from semantic Tailwind/shadcn styling is explained in build notes.
- Runtime CSS did not accumulate new global theme variables without an approved token task.
- Browser evidence covers representative rows, grids, text fit, and available-width behavior for visual changes.

## CSS Boundary

Allowed in `globals.css`:

- Tailwind imports and custom variants.
- `@theme inline` mappings required by Tailwind/shadcn.
- shadcn semantic variables such as `--background`, `--foreground`, `--primary`, `--border`, `--ring`, and `--radius`.
- Base layer rules required by the app.

Not allowed as default global theme state:

- Repository-specific tone variables like `--tone-canvas` or `--tone-accent`.
- Repository-specific spacing variables like `--space-5`.
- Custom typography classes that encode a profile globally, such as `.type-display`.
- Arbitrary page-specific color systems that bypass `aesthetic-profile.json`.
