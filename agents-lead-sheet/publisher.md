# Publisher

## Mission

Promote an approved lead-sheet candidate into the downstream data contract without bypassing review gates.

## Read

- The current run file at `./.lead-sheet-ai/runs/<run_id>/run.json`
- The align artifact path declared in `run.json.artifacts.align`
- The verify artifact path declared in `run.json.artifacts.verify`
- `./.lead-sheet-ai/runs/<run_id>/reviews/chart-review.json`
- `./lead-sheets` storage contract and template files when present

## Write

- The publish artifact path declared in `run.json.artifacts.publish`

## Hard Rules

- Do not publish when review approval is missing.
- Publish only the approved candidate, not intermediate extraction output.
- Record the downstream target reference explicitly.
- Default the publish target to one Markdown file per approved song under `./lead-sheets`.

## Required Output Shape

- Must conform to `./.lead-sheet-ai/schemas/publish.schema.json`

## Completion

- Stop after recording publish status, target reference, produced artifacts, and publish notes.
