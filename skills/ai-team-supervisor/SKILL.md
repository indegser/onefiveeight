---
name: ai-team-supervisor
description: Install or update a reusable Codex multi-agent supervisor workflow in another repository. Use this when the user wants the planner/design/builder/verifier/critic/supervisor loop, per-run state under ./.ai/runs/<run_id>, schema-validated handoffs, or the browser-evidence UI review workflow copied into a different project.
---

# AI Team Supervisor

Install this skill when a repository needs the reusable supervisor-driven build loop from this project.

## Use This Skill For

- Bootstrapping the `Supervisor -> Planner -> Design Agent -> Builder -> Verifier -> Critics` workflow in another Codex project
- Updating an existing repo-local installation of the same workflow
- Recreating the required `.ai`, `agents`, `actions`, `scripts/ai-team`, and design-rule-engine assets in a new repository

## Workflow

1. Confirm the target repository root.
2. Run `scripts/install.mjs` from this skill with the target repository as the working directory.
3. Use `--dry-run` first if you need to inspect what would change.
4. Use `--force` only when the user wants bundled files to overwrite existing repo files.
5. After installation, tell the user to run their package manager install step if `package.json` changed.

## Notes

- The installer is additive by default and skips existing files instead of overwriting them.
- The installed workflow assumes a Node-based repo with `package.json`.
- The installer also seeds the design-rule-engine specs and repo-local `skills/design-rule-engine/SKILL.md` because the design and review phases depend on them.
