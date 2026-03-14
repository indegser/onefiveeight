# Browser-First UI Verification

## Problem
- Visual tasks in this repository can still be implemented and reviewed from code alone, which makes spacing, hierarchy, and redundancy issues easy to miss until late.
- I need the AI team workflow to treat browser evidence as a first-class requirement for UI-facing changes instead of an optional follow-up.

## Users
- AI agents and humans collaborating on UI work in this repository

## Core Workflows
- Identify when a task should be treated as visual UI work
- Check the current UI in a browser before making visual changes
- Re-check the changed UI in a browser before verification and final review

## Must-Have Features
- Operating rules that classify visual tasks explicitly
- Verifier and review guidance that require browser-backed evidence for UI changes
- Workflow docs that make before/after browser checks the default path for visual tasks

## Constraints
- Keep the change additive and focused on the AI team workflow
- Preserve the existing Supervisor phase model
- Do not introduce vague requirements that cannot be checked from artifacts

## Risks
- If the rule is too broad, agents may overuse browser checks for non-visual work
- If the rule remains too soft, agents may continue to skip browser verification on styling tasks
