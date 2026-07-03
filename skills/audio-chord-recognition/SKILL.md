---
name: audio-chord-recognition
description: Estimate chord progressions, key, tempo, section-aware chord charts, timestamped chords, confidence values, ambiguity notes, Roman numerals, and simplified or guitar-friendly charts from audio files. Use when Codex is asked to analyze a song recording, MP3/WAV/M4A/FLAC/audio file, detect chords like Moises-style chord recognition, transcribe harmony, estimate key or BPM from audio, or produce a musician-friendly chord chart from recorded music.
---

# Audio Chord Recognition

## Core Rule

Treat every result as estimated unless a human has verified it. Automatic chord recognition is probabilistic, especially with dense mixes, distorted guitars, unclear bass, vocals, or unstable tempo.

## Workflow

1. Create a task run directory next to the input audio, or in the user-provided output directory.
2. Preprocess the audio with `scripts/preprocess_audio.py` when `ffmpeg` and `ffprobe` are available. Keep the original file untouched.
3. Dispatch expert roles as subagents when multi-agent tools are available. If not available, perform the roles sequentially and save each role's JSON artifact separately.
4. Run independent work in parallel when possible: stem separation, tempo/beat tracking, global key estimation, and chroma extraction.
5. Merge evidence into chord candidates, refine with harmonic context, segment sections, then run a music-theory review.
6. Validate final JSON artifacts with `scripts/validate_analysis.py` before writing the final answer.
7. Return a readable musician-facing chart and explicitly describe uncertainty.

## Expert Roles

Load `references/agent-contracts.md` before assigning or emulating expert roles. It contains the role responsibilities, JSON output shapes, and merge order for:

- Audio Preprocessing Agent
- Stem Separation Agent
- Tempo and Beat Tracking Agent
- Pitch and Chroma Extraction Agent
- Chord Candidate Agent
- Harmonic Context Agent
- Section Segmentation Agent
- Music Theory Reviewer Agent
- Final Chart Writer Agent

Keep each role's output as valid JSON in the run directory. Do not let expert roles overwrite each other's artifacts.

## Analysis Guidance

Use the best available local tools and libraries. Prefer deterministic local tools before adding dependencies:

- `ffprobe`/`ffmpeg` for validation, metadata, conversion, downmixing, and sample-rate normalization.
- `librosa`, `essentia`, `madmom`, `aubio`, or similar local MIR packages when present for tempo, beat, chroma, CQT/STFT, and onset analysis.
- `demucs`, `spleeter`, or existing separated stems only when available; ask before installing large packages or downloading models.

Load `references/chord-heuristics.md` before chord naming, context refinement, or theory review. Prefer bar-level smoothing and musically readable labels over frame-by-frame complexity.

## Retry Strategy

If confidence is low:

1. Retry using the full mix.
2. Retry using the harmonic stem only.
3. Retry using a coarser chord vocabulary: major, minor, dominant 7, maj7, m7, sus, diminished.
4. Retry with bar-level smoothing instead of frame-level changes.
5. Preserve alternatives and report uncertainty instead of forcing precision.

## Final Output

Include these sections unless the user asks for a different format:

```md
# Estimated Chord Analysis

Audio: {filename}
Duration: {duration}
Estimated Key: {key} ({confidence})
Estimated BPM: {bpm} ({confidence})

## Summary

## Section Chart

## Timestamped Chords

## Simplified Guitar Chart

## Ambiguities

## Verification Notes
This is an AI-estimated chord chart. For performance, transcription, or publishing, manually verify the bass notes and extensions.
```

Use tables for section charts and timestamped chords. Include Roman numerals when requested or when they clarify the harmony.

## Bundled Resources

- `scripts/preprocess_audio.py`: Validate an audio file, extract metadata, and optionally create a normalized WAV working copy.
- `scripts/validate_analysis.py`: Validate final analysis JSON for required fields and common shape errors.
- `references/agent-contracts.md`: Expert role contracts and artifact schemas.
- `references/chord-heuristics.md`: Practical MIR and music-theory heuristics for chord labeling and confidence.
