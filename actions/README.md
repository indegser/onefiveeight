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

Current wrappers:

- `actions/capture-screenshot <url> <output-path> [load-state]`
- `actions/run-lint-changed [file ...]`
- `actions/route-and-validate`

In the MVP, the supervisor provides protocol and routing. Action wrappers should stay deterministic, repo-local, and easy to inspect.
