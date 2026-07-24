# Remove Quiz and Chords pages

## Goal

Remove the website's standalone `/quiz` and `/chords` pages.

## Scope

- Remove the App Router route implementations for `/quiz` and `/chords`.
- Remove the `Quiz` and `Chords` links from the shared application navigation.
- Preserve unrelated pages, shared music utilities, historical documentation, and prior AI run artifacts.

## Acceptance criteria

- `/quiz` and `/chords` are no longer generated application routes.
- The shared navigation no longer advertises either removed page.
- No runtime source file retains a link or import that depends on either removed route.
- Lint, production build, and the AI run validation pass.
