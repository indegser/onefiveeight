---
name: audio-to-score
description: Turn MP3, WAV, M4A, FLAC, or other recorded music into a form-first symbolic score with melody, harmony, bass and groove evidence, a verified linear performance timeline, optional practical piano or guitar accompaniment, and a compressed written form. Use when Codex is asked to transcribe a song from audio, create melody sheet music, build a lead sheet, arrange accompaniment, recover song form, or prepare MusicXML/MIDI/notation-ready score data.
---

# Audio to Score

## Core Rules

Treat signal analysis as evidence, not notation truth.

Extract independent evidence in parallel, but make song form the first adjudicated musical artifact. Permit preliminary melody, bass, chord, lyric, and structural features to challenge a form hypothesis. Do not finalize notation-ready events until the form is approved.

Keep these layers separate:

1. observed source evidence,
2. linear source transcription,
3. generated accompaniment arrangement,
4. compressed written form.

Never present generated accompaniment as source transcription. Never compress repeats before every linear performance measure maps to a written-form measure.

## Select the Output Mode

- `transcription`: form, melody, harmony, bass cues, and linear score only.
- `lead-sheet`: transcription plus readable chord symbols and compressed form.
- `arrangement`: lead sheet plus a generated piano or guitar accompaniment layer.
- `source-faithful-arrangement`: request manual review; do not claim note-for-note recovery from a dense mix without adequate isolated evidence.

Record the selected mode in `00_job.json`.

## Required Workflow

1. Create a run directory and preserve the original audio.
2. Preprocess a working copy and record duration, channels, sample rate, checksum, tuning reference, and warnings in `01_source.json`.
3. Extract stems and low-level evidence independently: beats, downbeats, tempo curve, meter candidates, pitch contours, onsets, chroma, bass pitch, vocal activity, energy, timbre, lyrics when available, and self-similarity.
4. Save observations in `02_evidence.json`. Do not assign final notes, chords, or section labels here.
5. Build `03_form_hypotheses.json` from measure-aligned boundary and recurrence evidence. Use neutral labels such as `A`, `A'`, and `B` before semantic labels.
6. Produce preliminary melody, bass, harmony, lyric, and groove events in `04_preliminary_events.json`. Use them to test form hypotheses, not to create the final score.
7. Adjudicate `05_form_map.json`. Preserve alternate hypotheses and stop for human review when competing forms materially change measure numbering, recurrence groups, or performance order.
8. Require form approval before final transcription. Then align melody, bass, harmony, and lyrics to approved measure IDs and form coordinates in `06_transcription.json`.
9. Build the complete uncompressed performance timeline in `07_linear_score.json`. Keep pickup bars, meter changes, tempo changes, rests, ties, ornaments, and arrangement differences.
10. If arrangement mode is selected, generate `08_accompaniment.json` from the approved form and transcription. Keep generated provenance on every arrangement layer.
11. Create `09_written_form.json` only after the linear score passes review. Represent repeats, first/second endings, D.S./D.C., segno, coda, fine, and written-to-linear pass mappings.
12. Run transcription, arrangement, form, notation, and provenance review. Record approvals in `10_review.json`.
13. Assemble `11_final_score.json` and validate it with `scripts/validate_score.py`.
14. Export notation formats only from the validated final artifact. Prefer an internal JSON source of truth plus MusicXML for interchange and MIDI for audition.

## Form Authority

Load [form-analysis.md](references/form-analysis.md) before building or adjudicating form.

- Separate preliminary form hypotheses from the approved form map.
- Use recurrence groups, section occurrences, and bar-in-section positions as required coordinates.
- Derive semantic labels from evidence; do not infer Verse/Chorus order from elapsed time or common pop templates.
- Let melody and harmony evidence revise preliminary boundaries.
- After approval, do not let a downstream harmony or arrangement pass silently rewrite form. Emit a form-change request instead.

## Transcription

Load [melody-transcription.md](references/melody-transcription.md) before converting pitch evidence into notes.

Use the repository `audio-chord-recognition` skill as a downstream harmony module. Give it the approved form map when available. Chord output must remain subordinate to form coordinates and preserve alternatives for uncertain segments.

Build the linear score before written-form compression. The linear score is the authoritative record of what occurs at each time in the recording.

## Accompaniment

Load [accompaniment-arrangement.md](references/accompaniment-arrangement.md) when arrangement mode is selected.

Generate accompaniment only after form and transcription approval. Respect melody range, phrase breathing, harmonic rhythm, playable ranges, voice leading, groove, section density, and user-selected instrument and difficulty.

## Human Approval Gates

Stop at a gate when the corresponding decision is material:

1. `form`: required when measure boundaries, meter, recurrence grouping, or performance order remain disputed.
2. `transcription`: required for low-confidence principal melody, bass, harmony, lyric alignment, or notation rhythm.
3. `arrangement`: required before calling generated accompaniment approved or performance-ready.

An omitted arrangement uses `not_required`, not `approved`.

## Validation and Review

Load [verification.md](references/verification.md) before final review and [artifact-contracts.md](references/artifact-contracts.md) before writing JSON.

Run:

```bash
python3 scripts/validate_score.py 11_final_score.json
```

Schema validation does not prove musical correctness. Review low-confidence events by looping the corresponding source interval, comparing useful stems, auditioning the symbolic result, and checking recurrence peers.

## Failure Policy

- Preserve `unknown`, rests, tacet, and unresolved harmony instead of inventing content.
- Lower confidence for bleed, tuning drift, rubato, dense polyphony, masked bass, backing vocals, or poor stem quality.
- Keep multiple form hypotheses when evidence is genuinely tied.
- Prefer a simpler readable chord or melody rhythm only when the simplification is labeled.
- Request a cleaner source, isolated stem, reference chart, or human correction when the requested fidelity is unsupported.

## Bundled Resources

- `references/artifact-contracts.md`: artifact flow, IDs, provenance, and final JSON contract.
- `references/form-analysis.md`: boundary, recurrence, hypothesis, and form-adjudication rules.
- `references/melody-transcription.md`: principal melody, rhythm, lyric, and notation rules.
- `references/accompaniment-arrangement.md`: generated accompaniment constraints.
- `references/verification.md`: review gates, invariants, and evaluation checks.
- `scripts/validate_score.py`: deterministic final-artifact validator.
