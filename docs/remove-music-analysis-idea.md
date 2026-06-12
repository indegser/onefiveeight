# Remove Music Analysis

Remove the repository-local music-analysis system and related artifacts.

Scope:

- Delete the reusable `packages/music-analysis` package.
- Delete the `music-harmony-analysis` skill and related references.
- Delete music-analysis planning/result docs and run artifacts.
- Remove TypeScript aliases for the deleted package.
- Remove app seed data that depends on audio-derived music-analysis output.
- Keep unrelated app surfaces, the quiz page, and ordinary song library behavior intact.
