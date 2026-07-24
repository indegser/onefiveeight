---
name: audio-chord-recognition
description: Extract non-authoritative harmony evidence and adjudicate form-aware chord progressions, bass motion, key, tempo, beat grids, confidence, alternatives, Roman numerals, and readable charts from MP3, WAV, M4A, FLAC, or other recorded audio. Use for standalone chord-chart requests or as the downstream harmony module inside the repository audio-to-score workflow, keeping deterministic measurement separate from agent musical judgment.
---

# Audio Chord Recognition

## Scope

Act as a harmony evidence and adjudication module. Do not own melody transcription, accompaniment generation, score engraving, or final song-form authority.

Treat every result as estimated until reviewed. Scripts, stem separators, chroma, bass detectors, and template scores provide evidence, not chord answers.

## Enforce the Script/Agent Boundary

- Use scripts to inspect audio, extract measurements, enumerate hypotheses, validate artifacts, and render already-adjudicated results.
- Use the agent to select metrical level and beat grid, propose standalone form, choose final chord labels, apply recurrence consensus, decide extensions or inversions, and preserve ambiguity.
- Never let an evidence script emit `chosen_chord`, decision confidence, final form, or a finished chart.
- Keep numeric `evidence_support` separate from the agent's final `confidence`.
- Treat external chord charts as optional corroboration with provenance. Never let them silently override source-audio evidence.

## Select the Mode

- `standalone`: estimate a chord chart when no upstream form map exists.
- `audio_to_score_module`: consume an approved form map from `audio-to-score` and return harmony events aligned to it.

In module mode, load [the audio-to-score artifact contract](../audio-to-score/references/artifact-contracts.md) and use its IDs and coordinates exactly.

## Form Rules

- In module mode, require approved measure IDs, section IDs, occurrences, recurrence groups, and bar-in-section positions before final chord decisions.
- In standalone mode, create a provisional measure and form hypothesis before writing a chart. Label it estimated and preserve alternatives.
- Use preliminary harmony as evidence that may request a form revision.
- After form approval, never change section membership, measure numbering, meter, or performance order. Emit a `form_change_request` with affected measures and evidence.
- Do not smooth harmony across section, ending, pickup, or irregular-meter boundaries.

## Workflow

1. Preserve the source audio and create a run directory.
2. Preprocess a working copy with `scripts/preprocess_audio.py`.
3. Load `references/evidence-contract.md` and `references/agent-contracts.md`.
4. In module mode, load the approved `05_form_map.json`. In standalone mode, create and mark provisional form context.
5. Extract or locate useful stems. Prefer stable bass evidence plus harmonic or `other` stems; use full mix for comparison and downweight vocals.
6. Run `scripts/extract_harmony_evidence.py` with separate full-mix, harmonic, and bass sources when available.
7. Validate `04_harmony_evidence.json` and `05_chord_candidates.json` with `scripts/validate_evidence.py`.
8. Select the metrical level and beat grid as an agent decision. In standalone mode, create the provisional form only after comparing grid, onset, cadence, and recurrence evidence.
9. Load `references/chord-heuristics.md` and adjudicate candidates using bass motion, phrase function, local key, cadence, form role, and recurrence peers.
10. Run recurrence-group consensus by `bar_in_section`. Preserve genuine altered repeats and reharmonization.
11. Return beat-positioned harmony events. Do not collapse multiple changes into one chord string; merge only adjacent identical decisions when no musical boundary intervenes.
12. Preserve unresolved harmony as `null`, N.C., tacet, or an explicit ambiguity.
13. Validate the final artifact with `scripts/validate_analysis.py`.

## Musician Judgment

Choose readable performance-relevant labels. Preserve sevenths, suspensions, slash basses, secondary dominants, borrowed chords, and stable extensions when they affect function or voice leading.

Do not accept the top numeric candidate automatically. Compare plausible alternatives for low- and medium-confidence segments. Record rejected candidates and reasons.

Resolve tempo octave ambiguity musically. Compare half-time, observed-pulse, and double-time hypotheses against harmonic rhythm, phrase length, pickups, cadence placement, and readable bar structure.

Keep generated accompaniment decisions out of harmony evidence. This skill describes or adjudicates the source harmony only.

## Output

Module mode must include:

- `mode: "audio_to_score_module"`,
- approved `form_context`,
- beat-positioned `timestamped_chords`,
- measure, section, occurrence, recurrence-group, and bar-in-section coordinates,
- confidence, alternatives, evidence references, and consensus action,
- form-change requests rather than silent form edits.

Standalone mode may also include section, measure, timestamped, advanced, Roman-numeral, and simplified charts. State that form and harmony remain estimated.

## Retry Policy

1. Compare half-time, observed-pulse, and double-time grids before fixing standalone bars.
2. Compare bass plus harmonic stem against full mix.
3. Retry low-confidence slots at beat, half-measure, and measure resolution.
4. Compare recurrence peers.
5. Retry with a coarser chord vocabulary.
6. Preserve alternatives or unresolved harmony instead of forcing precision.

## Bundled Resources

- `references/agent-contracts.md`: standalone and module artifact flow.
- `references/evidence-contract.md`: measurement-only script output and agent handoff.
- `references/chord-heuristics.md`: evidence priority and form-aware chord naming.
- `scripts/preprocess_audio.py`: source inspection and working-copy creation.
- `scripts/extract_harmony_evidence.py`: non-authoritative tempo, grid, key, chroma, bass, and chord candidates.
- `scripts/validate_evidence.py`: reject evidence artifacts that cross into final musical decisions.
- `scripts/validate_analysis.py`: standalone and module artifact validation.
