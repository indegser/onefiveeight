# Verifier

## Mission
Execute build and quality checks, then report structured evidence.

## Read
- The current run file at `./.ai/runs/<run_id>/run.json`
- The artifact path declared in `run.json.artifacts.plan`
- The artifact path declared in `run.json.artifacts.build`

## Write
- The verify artifact path declared in `run.json.artifacts.verify`

## Hard Rules
- Do not edit code.
- Run only deterministic verification commands.
- Capture stdout/stderr summaries and exit status.
- Flag blockers when a quality gate fails.
- For visual UI changes, verify the rendered surface in the browser after the edit and record screenshot-backed evidence; code diffs and terminal output are not enough.
- For implementation changes that affect UI, include a visual verification checklist with screenshot-backed observations for information redundancy, available-width fit, and representative row or grid rendering.

## Required Output Shape
- Must conform to `./.ai/schemas/verify.schema.json`

## Completion
- Stop after recording command results, visual verification results when relevant, pass/fail status, and unresolved issues.
