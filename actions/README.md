# Repo-Local Actions

This directory is reserved for deterministic action wrappers used by the multi-agent system.

Suggested actions:

- `run-build`
- `run-lint`
- `run-typecheck`
- `run-tests`
- `run-e2e`
- `capture-screenshot`
- `run-lint-changed`
- `route-and-validate`

Current rule:

- If an action operates on a run or writes run-scoped output, it must require `--run-id <run_id>`.

Recommended wrappers:

- `actions/capture-screenshot --run-id <run_id> <url> [output-path]`
- `actions/run-lint-changed --run-id <run_id> [file ...]`
- `actions/route-and-validate --run-id <run_id>`

In the MVP, the supervisor provides protocol and routing. Action wrappers should stay deterministic, inspectable, and explicit about which run they target.
