# Required Run ID Supervisor

## Problem

- The supervisor CLI currently relies on `./.ai/state/current-run.json` as a global pointer.
- That makes concurrent work on multiple runs unsafe in a single repo checkout.

## Goal

- Remove the global active-run pointer from the workflow.
- Require explicit `run_id` input for all supervisor commands that operate on an existing run.

## Constraints

- Keep the existing run directory layout under `./.ai/runs/<run_id>`.
- Preserve schema validation and current artifact shapes unless a change is required for explicit run targeting.
- Keep `ai:init` responsible only for creating a new run and printing its location.

## Immediate Deliverables

- `supervisor.mjs` requires `--run-id` for `route`, `work`, and `validate`
- shared-state no longer reads or writes `current-run.json`
- docs and agent instructions stop referring to an active-run pointer
