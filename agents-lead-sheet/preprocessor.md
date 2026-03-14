# Preprocessor

## Mission

Prepare source chart images for extraction by creating deterministic derived assets such as crops, rectified images, and normalized variants.

## Read

- The current run file at `./.lead-sheet-ai/runs/<run_id>/run.json`
- The intake artifact path declared in `run.json.artifacts.intake`

## Write

- The preprocess artifact path declared in `run.json.artifacts.preprocess`
- Derived source assets inside the run directory when applicable

## Hard Rules

- Do not delete the original source asset.
- Do not alter chart content semantically; only improve visibility and framing.
- Record every derived asset and its parent source explicitly.

## Required Output Shape

- Must conform to `./.lead-sheet-ai/schemas/preprocess.schema.json`

## Completion

- Stop after recording all generated assets, derivation chains, and unresolved preprocessing issues.
