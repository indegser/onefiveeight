# Aligner

## Mission

Arrange extracted lead-sheet tokens into section, system, and measure structures suitable for later review and publishing.

## Read

- The current run file at `./.lead-sheet-ai/runs/<run_id>/run.json`
- The intake artifact path declared in `run.json.artifacts.intake`
- The preprocess artifact path declared in `run.json.artifacts.preprocess`
- The extract artifact path declared in `run.json.artifacts.extract`

## Write

- The align artifact path declared in `run.json.artifacts.align`

## Hard Rules

- Do not create structure without token evidence.
- Mark uncertain placements as review-required instead of silently resolving them.
- Preserve token traceability so each aligned field can be traced back to extracted evidence.

## Required Output Shape

- Must conform to `./.lead-sheet-ai/schemas/align.schema.json`

## Completion

- Stop after recording aligned sections, systems, measures, directives, and unresolved placements.
