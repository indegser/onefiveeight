---
name: website-workflow
description: Route website, web app, Next.js, shadcn/ui, page redesign, layout, styling, typography, browser-verification, and UI implementation work through the repo design-rule-engine plus relevant Vercel skills. Use when Codex is asked to design, redesign, implement, verify, or review rendered web surfaces, especially pages under app/ or src/app/, React components, CSS/Tailwind styling, frontend workflows, or visual polish tasks.
---

# Website Workflow

## Overview

Use this skill as the routing contract for rendered web work in this repository. It does not replace `skills/design-rule-engine`; it binds that local design judgment layer to the external Vercel and Anthropic design/build skill stack.

## Required Local Reads

- `AGENTS.md`
- `skills/ai-team-supervisor/SKILL.md`
- `skills/design-rule-engine/SKILL.md`
- `specs/design-rule-engine/README.md`
- `specs/design-rule-engine/design-principles.md`
- `specs/design-rule-engine/ux-heuristics.md`
- `specs/design-rule-engine/aesthetic-profile.json`
- `specs/design-rule-engine/theme-usage.md`
- Relevant `agents/*.md` prompt for the current phase

## Skill Stack

Use these Vercel skills when available in the active Codex environment:

- `vercel:nextjs`: Next.js App Router structure, routing, server/client component boundaries, and build behavior.
- `vercel:shadcn`: shadcn/ui composition, component installation, theming, and Tailwind integration.
- `vercel:geist`: Geist typography setup and Vercel-style type rhythm.
- `vercel:v0-dev`: UI exploration and component direction before implementation.
- `vercel:react-best-practices`: React/TSX quality review after meaningful component edits.
- `vercel:agent-browser-verify`: Browser verification after starting a dev server or changing rendered UI.

Use Anthropic public design skills as external references or inspiration unless they are installed locally:

- `frontend-design`: frontend layout and interface direction.
- `theme-factory`: theme exploration and token direction.
- `brand-guidelines`: brand-system application.
- `canvas-design`: visual composition and exploratory canvas work.
- `web-artifacts-builder`: web artifact assembly patterns.
- `webapp-testing`: rendered web app testing patterns.

If an Anthropic skill is requested but not installed, state that it is not available in the current Codex skill registry, then use the public `anthropics/skills` repository as reference material only when browsing or local copies are available.

## Workflow

1. Confirm the task is non-trivial. If it will edit repository files, work in a task-specific worktree unless the user explicitly provides a different path or the task is a trivial read-only answer.
2. Create or resume the required `./.ai/runs/<run_id>` supervisor workflow before product-code changes, then let `$ai-team-supervisor` own routing decisions.
3. For visual UI tasks, inspect the current rendered page in a browser before proposing or editing layout, spacing, typography, color, or component styling.
4. Design Agent: read `skills/design-rule-engine` first, select the active profile/register from `aesthetic-profile.json`, apply `theme-usage.md`, then define component map, states, visual constraints, and browser review targets.
5. Builder: implement with existing repo patterns and relevant Vercel skills. Prefer shadcn/Radix/lucide/Geist conventions and semantic Tailwind/shadcn utilities before adding new UI abstractions or runtime tokens.
6. Verifier: run deterministic checks and browser verification. Record screenshot-backed evidence for visual changes, including representative rows/grids, redundant labels, available-width fit, and served CSS when styling infrastructure changes.
7. Critics: review against the repo design-rule-engine first, then use external skill guidance to identify missed frontend, React, or browser-verification risks.

## Guardrails

- Do not treat external Anthropic design skills as installed local tools unless they appear in the active skill registry.
- Do not skip browser evidence for visual UI changes.
- Do not let v0-style ideation override local design-rule-engine hard rules or user-approved constraints.
- Do not introduce a new component library when shadcn/Radix primitives cover the interaction.
- Keep marketing-page composition out of operator tools unless the task explicitly asks for a landing page.
- Do not reintroduce repository-specific global theme variables in `globals.css` without an approved token task and browser evidence.
