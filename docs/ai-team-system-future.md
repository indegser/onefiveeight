# Codex Multi-Agent App Builder

## Goal
Build a small AI development team that accepts `idea.md` or natural-language requirements and coordinates multiple specialized agents to plan, design, implement, verify, and refine an app.

## Target Architecture

```text
requirements -> intake -> supervisor
  -> planner
  -> design agent
  -> human approval (conditional)
  -> builder
  -> verifier
  -> design critic
  -> code critic
  -> supervisor decision
       -> done
       -> refine
       -> replan
       -> human checkpoint
```

## Core Principles
- Role separation over free-form collaboration
- Shared state over hidden conversation context
- Structured JSON outputs over prose handoffs
- Explicit permissions over implicit autonomy
- Repeatable Plan -> Build -> Verify -> Refine loops

## Agent Model
- `Planner`: requirement decomposition, task graph, acceptance criteria
- `Design Agent`: information architecture, UI structure, UX rules
- `Builder`: implementation
- `Verifier`: checks and evidence
- `Design Critic`: UX quality review
- `Code Critic`: architecture and maintainability review
- `Supervisor`: orchestration, escalation, completion

## Shared State Contract
- `run.json`: run envelope, phase, status, routing, approvals
- `plan.json`: task decomposition and acceptance criteria
- `memory.json`: run-scoped snapshot of reusable patterns selected from the knowledge base
- `design.json`: screens, UX rules, component map
- `build.json`: changed files, implementation notes, incomplete tasks
- `verify.json`: command results, failures, evidence
- `reviews/*.json`: design and code review outputs

## AGENTS.md vs Agent Prompt Split

Put in `AGENTS.md`:
- Global protocol
- Stack defaults
- Repo-level quality gates
- Shared state locations
- Human approval policy
- Global UX principles
- Cross-agent permissions

Put in individual agent prompts:
- Single-agent mission
- Allowed inputs and writable outputs
- Required JSON schema
- Agent-specific review rubric
- Stop conditions
- Escalation triggers

## Skill vs Action Split

Use `skills` for:
- Requirement decomposition heuristics
- Internal-tool UX review checklists
- shadcn/ui selection rules
- Supabase guardrails
- Review rubrics

Use `actions` for:
- Running build/lint/typecheck/test
- Capturing screenshots
- Launching previews
- Collecting diffs
- Applying migrations

## Human Checkpoints
- Requirement ambiguity with material business risk
- Brand-defining or external-facing surface approval
- Auth/RBAC design confirmation
- Data model or migration review
- Destructive workflow approval
- Release readiness sign-off

## Expansion Path

### MVP
- Local Codex + file-based shared state
- Sequential supervisor
- Prompt files per role
- JSON schema validation

### V1
- Agent invocation wrappers
- Screenshot-backed design review
- Persistent run history
- Task-level retries

### V2
- MCP-backed tools
- Agents SDK handoffs and traces
- Parallel work scheduling
- Cost/latency-aware routing

### V3
- Human approval UI
- Reusable skills registry
- Multi-project orchestration
- Full replay and audit trail
