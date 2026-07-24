# Repo-Local Skills

This directory is reserved for reusable decision frameworks that support the multi-agent system.

Suggested skills:

- `ai-team-supervisor`
- `website-workflow`
- `decompose-requirements`
- `design-rule-engine`
- `internal-tool-ux`
- `shadcn-selection`
- `supabase-guardrails`
- `code-review-rubric`

Repository skill directories are the source of truth. Installed copies under the Codex skill
directory are generated deployments and must not be edited directly.

## Supervisor

Use `ai-team-supervisor` as the active routing skill for AI-team runs. It owns the judgment for which agent and skill should run next. `scripts/ai-team` remains as a deterministic helper for run initialization, work-package printing, schema validation, and legacy advisory checks.

## Website Work

Use `website-workflow` for rendered web surfaces, Next.js page work, shadcn/ui component work, layout, styling, visual verification, and web design reviews.

Use `design-rule-engine` as the local source of design judgment before applying external guidance. `website-workflow` binds that local design system to the Vercel skill stack and Anthropic public design-skill references.

## Audio to Score

Use `audio-to-score` as the form-first orchestrator for turning recorded audio into melody,
harmony, a verified linear score, optional generated accompaniment, and written-form notation.

Use `audio-chord-recognition` as its downstream form-aware harmony module or for standalone
estimated chord-chart requests.

Check or install one explicit skill with:

```bash
npm run skill:check -- audio-to-score
npm run skill:install -- audio-to-score
```
