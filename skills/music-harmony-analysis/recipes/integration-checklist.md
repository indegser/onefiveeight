# Integration Checklist

- Add or reuse one focused package for reusable music-analysis code.
- Keep symbolic and audio pipelines in separate modules.
- Validate intermediate artifacts with zod.
- Route harmony-analysis tasks to this skill in the root `AGENTS.md`.
- Mark repo-specific service, storage, or UI decisions with `TODO`.
- Avoid building a standalone app unless the repository truly lacks a host surface.
