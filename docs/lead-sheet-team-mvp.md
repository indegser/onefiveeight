# Lead Sheet Team MVP

## Purpose

- `lead-sheet-team` is a separate orchestration system for converting photographed or scanned lead sheets into structured chart data.
- It is intentionally separate from the existing development-oriented AI team.

## Separation

- Development AI team state lives under `./.ai/runs`
- Lead-sheet-team state lives under `./.lead-sheet-ai/runs`
- The first shared handoff layer is `./lead-sheets/*.md`, with one Markdown file per approved song
- The two teams can later communicate through shared database models, but their orchestration contracts remain independent

## Commands

```bash
npm run lead-sheet:init -- <source-ref>
npm run lead-sheet:refine -- --run-id <run_id> <agent> <note>
npm run lead-sheet:route -- --run-id <run_id>
npm run lead-sheet:work -- <agent> --run-id <run_id>
npm run lead-sheet:validate -- --run-id <run_id>
```

## Workflow

1. Initialize a run from a concrete source reference such as a local image path, uploaded batch, or score identifier.
2. Record source facts in `intake.json`.
3. Produce corrected source assets in `preprocess.json`.
4. Extract visible tokens into `extract.json`.
5. Align tokens into chart structure in `align.json`.
6. Run deterministic checks into `verify.json`.
7. Review source fidelity in `reviews/chart-review.json`.
8. Publish only approved chart data into `publish.json` and the target Markdown file under `./lead-sheets`.

## First Storage Layer

- Approved output is stored as one Markdown file per song in `./lead-sheets`
- This acts as the temporary database layer before any future Supabase migration
- The Markdown contract should remain structured enough to map directly into relational tables later

## Team Roles

- `intake-supervisor`
- `preprocessor`
- `extractor`
- `aligner`
- `verifier`
- `chart-reviewer`
- `publisher`

## Design Principle

- The lead-sheet-team exists to maximize extraction accuracy.
- The system should prefer uncertainty flags and human review over musical guesswork.
- The publish step should target Markdown files first, not direct database writes.
