---
name: audio-chord-recognition
description: Estimate chord progressions, key, tempo, section-aware chord charts, measure-based charts, timestamped chords, confidence values, ambiguity notes, Roman numerals, and simplified or guitar-friendly charts from audio files. Use when Codex is asked to analyze a song recording, MP3/WAV/M4A/FLAC/audio file, detect chords like Moises-style chord recognition, transcribe harmony, estimate key or BPM from audio, or produce a musician-friendly chord chart from recorded music, especially dense mixes with vocals, piano, guitar, strings, bass, or drums.
---

# Audio Chord Recognition

## Core Rule

Treat every result as estimated unless a human has verified it. Scripts, MIR libraries, stem separators, chroma features, bass detectors, and template scores produce evidence, not chord answers. The final chord chart must be chosen by musical judgment over all evidence; candidate scores are inputs, never a ranking to accept automatically.

## Orchestration Principles

- Keep the original audio untouched and write every artifact to the task run directory.
- Use deterministic tools for preprocessing, stem separation, feature extraction, candidate generation, and validation.
- Delegate musical judgment to the agent role, not to code. The agent must compare candidates the way a musician would: bass motion, harmonic rhythm, phrase function, key center, neighboring chords, repeated sections, cadence, section role, voicing evidence, and readable chart conventions.
- Preserve candidate evidence. Do not collapse uncertainty into one confident label when evidence conflicts.
- Separate detected sonority from chart label. Dense audio may contain color tones that should be reported as ambiguity rather than forced into an over-specific chord symbol.
- Make the advanced chart primary. Include a simplified chart only as a secondary musician convenience.

## Workflow

1. Create a task run directory next to the input audio, or in the user-provided output directory.
2. Preprocess the audio with `scripts/preprocess_audio.py` when `ffmpeg` and `ffprobe` are available.
3. Load `references/agent-contracts.md` before assigning or emulating expert roles.
4. Prefer stem separation when available. For dense mixes, prioritize `other` or harmonic stem plus bass stem; exclude or downweight vocals and drums for harmony decisions.
5. Run independent evidence extraction in parallel when possible: stems, tempo/bar grid, key estimate, chroma, bass pitch, and section repetition.
6. Generate multiple chord candidates per bar or segment. Keep source-specific evidence, bass evidence, extension evidence, rejected alternatives, and uncertainty.
7. Load `references/chord-heuristics.md`, then run a required Musician Judgment Pass. This pass may override top-scoring candidates when musical context supports another label.
8. Segment sections and create advanced section, measure-based, timestamped, and simplified charts.
9. Validate final JSON shape with `scripts/validate_analysis.py`. Passing validation means the artifact is well-formed, not that the harmony is correct.
10. Return a readable musician-facing chart and explicitly describe uncertainty.

## Expert Roles

Use subagents when available and permitted by the current environment; otherwise perform the roles sequentially. Save each role's JSON artifact separately and never let roles overwrite each other's output.

- Audio Preprocessing Agent
- Stem Separation Agent
- Tempo and Bar Grid Agent
- Pitch and Chroma Evidence Agent
- Chord Candidate Agent
- Section Segmentation Agent
- Musician Judgment Agent
- Final Chart Writer Agent

The Musician Judgment Agent is mandatory. It is the final harmonic adjudicator and must choose, revise, downgrade, or reject machine-generated candidates before `09_final_analysis.json` is written.

## Tool Guidance

Use the best available local tools and libraries, but keep them in their lane:

- `ffprobe`/`ffmpeg`: validation, metadata, conversion, downmixing, and sample-rate normalization.
- `demucs`, `spleeter`, or existing stems: vocal/drum exclusion and bass/harmonic source separation.
- `librosa`, `essentia`, `madmom`, `aubio`, or similar MIR packages: tempo, beat, chroma, CQT/STFT, bass pitch, and candidate evidence.
- Validation scripts: shape, timestamp, confidence, and artifact consistency checks only.

Do not use any script as the authoritative final chord judge. If a scoring helper is used, it must output candidates and evidence for the Musician Judgment Agent.

## Retry Strategy

If confidence is low or dense-mix evidence conflicts:

1. Retry with separated `other` or harmonic stem plus bass stem.
2. Retry with full mix as a comparison source, not the sole authority.
3. Retry with bar-level or half-bar-level smoothing.
4. Compare repeated sections and reuse the interpretation with stronger evidence.
5. Use a coarser label only when richer tones are unstable, ornamental, or not useful to a musician.
6. Preserve alternatives and report uncertainty instead of forcing precision.

## Final Output

Include these sections unless the user asks for a different format:

```md
# Estimated Chord Analysis

Audio: {filename}
Duration: {duration}
Estimated Key: {key} ({confidence})
Estimated BPM: {bpm} ({confidence})

## Summary

## Advanced Section Chart

## Measure Chart

## Timestamped Chords

## Simplified Chart (Secondary)

## Ambiguities

## Verification Notes
This is an AI-estimated chord chart. For performance, transcription, or publishing, manually verify the bass notes and extensions.
```

Use measure labels such as `m.1`, `m.2`, and `m.67-68` when beat tracking supports a bar grid. State the pickup/pre-roll rule, first-bar timestamp, and downbeat confidence when known.

## Bundled Resources

- `scripts/preprocess_audio.py`: Validate an audio file, extract metadata, and optionally create a normalized WAV working copy.
- `scripts/validate_analysis.py`: Validate final analysis JSON for required fields and common shape errors.
- `references/agent-contracts.md`: Expert role contracts, artifact schemas, candidate evidence flow, and Musician Judgment requirements.
- `references/chord-heuristics.md`: Dense-mix and human-style harmonic judgment heuristics.
