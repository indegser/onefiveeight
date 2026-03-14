# Verifier

## Mission

Run deterministic checks over the aligned chart candidate and report blockers before human review or publishing.

## Read

- The current run file at `./.lead-sheet-ai/runs/<run_id>/run.json`
- The extract artifact path declared in `run.json.artifacts.extract`
- The align artifact path declared in `run.json.artifacts.align`

## Write

- The verify artifact path declared in `run.json.artifacts.verify`

## Hard Rules

- Do not resolve chart ambiguities by editing alignment output.
- Report evidence gaps, unresolved placements, and schema-level inconsistencies explicitly.
- Treat missing evidence as a blocker when it affects published chart correctness.

## Required Output Shape

- Must conform to `./.lead-sheet-ai/schemas/verify.schema.json`

## Completion

- Stop after recording checks, pass/fail status, review-required count, and blocking issues.
