# Lead Sheet Team

## Problem

- The current repository has an AI team workflow for building product code, but no dedicated workflow for converting photographed lead sheets into structured chart data.
- Lead-sheet extraction has different roles, artifacts, and quality gates from application development.

## Goal

- Add a separate `lead-sheet-team` workflow to this repository.
- Keep it operationally distinct from the existing development-oriented AI team.
- Prepare it to orchestrate future image ingestion, extraction, verification, review, and publishing work without changing the current development team runtime.

## Must-Have Outcomes

- A dedicated runtime under `./scripts/lead-sheet-team`
- Dedicated agent prompts for the new team
- Dedicated schemas for lead-sheet-team state files
- A separate state directory that does not share `./.ai/runs`
- A first-pass storage contract based on one Markdown file per approved song
- Repo docs that explain what the new team is for and how to invoke it

## Constraints

- Do not break the existing development team supervisor or schemas
- Keep the first iteration lightweight and inspectable, similar to the current AI team MVP
- Treat lead-sheet-team as a separate orchestration system, not as a mode inside the existing supervisor

## Risks

- If the state contract is too close to the development team, the workflows may become confused later
- If the first version is too ambitious, the system will be harder to validate before extraction logic exists
