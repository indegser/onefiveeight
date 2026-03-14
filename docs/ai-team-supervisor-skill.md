# AI Team Supervisor Skill

`skills/ai-team-supervisor/` packages the repository's reusable multi-agent build workflow as a Codex skill that can be published from GitHub and installed into other repositories.

## Bundled Assets

- `agents/*.md`
- `actions/*`
- `scripts/ai-team/*`
- `.ai/schemas/*`
- `.ai/knowledge/patterns/*`
- `specs/design-rule-engine/*`
- `skills/design-rule-engine/SKILL.md`
- `docs/ai-team-mvp.md`
- `docs/idea.md`

## Install Into Another Repo

1. Install the skill through your Codex skill source.
2. From the target repository root, run the skill's installer:

```bash
node ~/.codex/skills/ai-team-supervisor/scripts/install.mjs --target .
```

Optional flags:

- `--dry-run`: report what would change without writing files
- `--force`: overwrite existing bundled files and script entries

## Publish Notes

- The publishable unit is the `skills/ai-team-supervisor/` folder.
- The folder already contains `SKILL.md`, `agents/openai.yaml`, an installer, and the bundled template assets.
- If the source supervisor system changes, refresh the copied assets in `skills/ai-team-supervisor/assets/template/` before publishing.
