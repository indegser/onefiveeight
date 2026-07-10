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

In the MVP, these remain lightweight documents rather than a fully wired Codex skill registry.

## Supervisor

Use `ai-team-supervisor` as the active routing skill for AI-team runs. It owns the judgment for which agent and skill should run next. `scripts/ai-team` remains as a deterministic helper for run initialization, work-package printing, schema validation, and legacy advisory checks.

## Website Work

Use `website-workflow` for rendered web surfaces, Next.js page work, shadcn/ui component work, layout, styling, visual verification, and web design reviews.

Use `design-rule-engine` as the local source of design judgment before applying external guidance. `website-workflow` binds that local design system to the Vercel skill stack and Anthropic public design-skill references.
