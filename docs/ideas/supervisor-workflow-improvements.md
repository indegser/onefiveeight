# Supervisor Workflow Improvements

## Problem

- The supervisor protocol manages state correctly, but several high-value workflow steps are still manual.
- Design refinements can happen without browser evidence, which weakens design review quality.
- Verification output does not clearly separate changed-file status from existing repository warnings.
- Refinement loops are not modeled explicitly, so later iterations are hard to trace.

## Goals

- Add small, repo-local action wrappers for common workflow steps.
- Require screenshot evidence in design review outputs.
- Extend design artifacts with explicit visual constraints.
- Make the workflow rules in `AGENTS.md` stricter for design tasks.
- Add lightweight refinement tracking so later revisions remain explainable.

## Constraints

- Keep the current MVP supervisor architecture intact.
- Prefer additive changes over a full orchestration rewrite.
- Preserve JSON-schema validation for protocol files.

## Immediate Deliverables

- `actions/capture-screenshot`
- `actions/run-lint-changed`
- `actions/route-and-validate`
- Updated schemas and agent instructions for screenshot evidence and visual constraints
- Updated workflow documentation and refinement tracking support
