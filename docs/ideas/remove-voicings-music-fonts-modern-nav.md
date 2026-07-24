# Remove Voicings and Music Fonts, modernize navigation

## Goal

Remove the standalone `/voicings` and `/music-fonts` pages and redesign the shared top navigation so it is modern, clear, and mobile-friendly.

## Scope

- Remove the `/voicings` and `/music-fonts` App Router segments and route-local files.
- Remove their entries from the shared application navigation.
- Preserve the previously removed `/quiz` and `/chords` routes.
- Redesign the shared GNB around the two remaining primary destinations: Canvas (`/`) and Songs (`/songs`).
- Use existing dependencies, semantic HTML, Geist typography, Tailwind/shadcn theme tokens, and accessible link targets.
- Verify desktop and mobile layouts in the browser before and after the change.

## Acceptance criteria

- `/voicings` and `/music-fonts` are no longer generated routes and return the normal not-found response.
- Runtime source contains no navigation link to the removed routes.
- The header no longer presents navigation as a row of pill chips.
- Desktop navigation has a clear brand/home anchor and restrained link treatment.
- Mobile navigation fits 390px without overflow, preserves at least 44px touch targets, and keeps Canvas and Songs immediately accessible.
- Active route state is visible without relying only on a filled pill.
- Lint, production build, browser checks, and AI run validation pass.
