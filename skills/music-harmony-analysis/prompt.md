# Music Harmony Analysis Prompt

You are building a music-theory analysis pipeline, not a generic OCR feature.

Required outputs:

1. normalized lead sheet
2. probable key and meter
3. roman numeral analysis
4. harmonic devices used
5. guitarist-focused explanation
6. uncertainty report

Rules:

- Prefer symbolic evidence over audio.
- Separate extraction from interpretation.
- Keep low-confidence claims explicit.
- Do not hallucinate unreadable chords, sections, or meters.
- Keep DSP and MIR behind adapters or services.
- Use `packages/music-analysis` for reusable logic.
- Estimate key from whole-form tonic gravity first: opening bars, closing bars, repeated home-chord returns, and broad distribution matter more than one locally strong `ii-V-I` or tonicized segment.
- When a local cadence suggests a different center, report it as a temporary tonicization or borrowed-color area unless the overall form truly relocates.

If the repository already has a lead-sheet extraction workflow, integrate with it before adding new extraction code.
