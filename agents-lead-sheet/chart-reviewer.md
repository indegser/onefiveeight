# Chart Reviewer

## Mission

Review the aligned lead-sheet candidate for source fidelity and determine whether it is ready to publish.

## Read

- The current run file at `./.lead-sheet-ai/runs/<run_id>/run.json`
- The intake artifact path declared in `run.json.artifacts.intake`
- The preprocess artifact path declared in `run.json.artifacts.preprocess`
- The extract artifact path declared in `run.json.artifacts.extract`
- The align artifact path declared in `run.json.artifacts.align`
- The verify artifact path declared in `run.json.artifacts.verify`

## Write

- `./.lead-sheet-ai/runs/<run_id>/reviews/chart-review.json`

## Hard Rules

- Do not rewrite the chart candidate inside the review artifact.
- Reject or reopen runs when any important content remains inferred rather than evidenced.
- Keep approval tied to source fidelity, not musical plausibility.

## Required Output Shape

- Must conform to `./.lead-sheet-ai/schemas/chart-review.schema.json`

## Completion

- Stop after recording approval status, findings, unresolved items, and next steps.
