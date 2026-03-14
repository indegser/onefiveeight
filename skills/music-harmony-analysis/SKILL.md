---
name: music-harmony-analysis
description: Use when a task involves harmonic analysis from a score image, chord-chart image, PDF lead sheet, or audio file. This skill uses the reusable music-analysis package to normalize chords, estimate key and meter, produce roman numeral analysis, identify harmonic devices, explain the harmony for guitarists, and report uncertainty explicitly.
---

# Music Harmony Analysis

Use this skill when the user wants music-theory analysis rather than plain OCR, transcription, or chord detection.

## Goals

- Convert source material into a structured lead sheet.
- Analyze harmony without hiding ambiguity.
- Keep extraction logic separate from theory interpretation.
- Prefer symbolic evidence over audio when both exist.

## Workflow

1. Inspect the existing repository structure before adding anything new.
2. For score images, chord-chart images, or PDFs, prefer existing symbolic extraction or alignment artifacts if they already exist.
3. Put reusable implementation in `packages/music-analysis`.
4. Keep DSP or MIR code behind adapters. Do not mix it with LLM reasoning modules.
5. Validate every intermediate artifact with schemas before continuing.
6. Surface uncertainty, low confidence, and retry recommendations in the final output.

## Package Boundaries

- `packages/music-analysis/src/orchestrator`: entrypoints and top-level routing
- `packages/music-analysis/src/pipelines/symbolic`: symbolic extraction adapters and normalization flow
- `packages/music-analysis/src/pipelines/audio`: audio adapter contracts and confidence-aware draft flow
- `packages/music-analysis/src/theory`: key, meter, roman numeral, and harmonic-device analysis
- `packages/music-analysis/src/critic`: consistency checks and retry guidance
- `packages/music-analysis/src/schemas`: zod contracts and shared types

## Symbolic First

- Treat symbolic inputs as the highest-confidence path.
- Reuse existing symbolic alignment output when possible.
- Preserve unreadable measures as unresolved instead of guessing.
- Estimate the main key from the whole chart, not from the single most convincing local cadence. Opening bars, closing bars, repeated returns, and long-range tonic gravity outrank one strong detour.
- If a section briefly points elsewhere, prefer labeling it as tonicization, modal mixture, or borrowed color before claiming a full modulation.

## Audio Guardrails

- Audio adapters may provide stems, tempo, beats, bars, and chord candidates.
- Audio-derived chords stay probabilistic unless cross-checked by stronger evidence.
- Keep TODO markers for repo-specific service or Python wiring.

## Deliverables

- Normalized lead sheet
- Probable key and meter
- Roman numeral analysis
- Harmonic devices used
- Guitarist-focused explanation
- Uncertainty report

## Files To Read On Demand

- Read [prompt.md](prompt.md) when drafting orchestration prompts or structured outputs.
- Read [examples/symbolic-analysis.md](examples/symbolic-analysis.md) for a symbolic-first task pattern.
- Read [examples/audio-analysis.md](examples/audio-analysis.md) before wiring audio adapters.
- Read [recipes/integration-checklist.md](recipes/integration-checklist.md) when integrating this skill into another repository area.
