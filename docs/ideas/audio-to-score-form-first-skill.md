# Form-First Audio-to-Score Skill

Create a repository-owned `audio-to-score` Codex skill whose final objective is a reviewable melody score plus practical accompaniment derived from an input audio file.

## Product Direction

- Treat song form as the first adjudicated musical artifact.
- Extract signal evidence in parallel, but do not finalize melody, harmony, or notation until a form hypothesis has been reviewed.
- Keep the full linear performance timeline separate from the compressed written form.
- Separate faithful source transcription from generated accompaniment arrangement.
- Keep `audio-chord-recognition` as a form-aware harmony sub-skill rather than the top-level orchestrator.

## Required Workflow

1. Preserve and preprocess the source audio.
2. Extract stems, tempo/downbeat/meter evidence, structural features, melody pitch evidence, bass evidence, chroma, groove, and vocal activity.
3. Produce neutral section and recurrence hypotheses before semantic labels.
4. Produce preliminary melody, bass, and chord events as evidence.
5. Re-adjudicate and freeze the song form before producing notation-like output.
6. Build a linear melody-and-harmony score.
7. Create a separate practical accompaniment arrangement when requested.
8. Compress the verified linear score into repeats, endings, D.S./D.C., coda, and fine only when supported.
9. Validate every artifact and expose uncertainty and human-review gates.

## Skill Architecture

- Add `skills/audio-to-score`.
- Add concise references for artifact contracts, form analysis, melody transcription, accompaniment arrangement, and verification.
- Add deterministic validation for the final analysis artifact.
- Update `skills/audio-chord-recognition` so it explicitly acts as a downstream form-aware harmony module and uses the repository contracts.
- Keep the repository skill directory as the sole source of truth.

## Synchronization

- Add a safe repo-local command that can check drift between a repository skill and the installed Codex skill directory.
- Add an explicit install/sync mode that copies a named repository skill into the installed directory and records the source content hash.
- Never infer a skill target; require an explicit skill name.
- Do not delete unrelated installed skills.
- Make check mode non-mutating and suitable for verification.

## Acceptance Criteria

- `audio-to-score` clearly distinguishes parallel evidence extraction from form-first adjudication.
- The workflow supports pickup bars, meter changes, recurrence groups, section occurrences, and bar-in-section positions.
- Melody events support pitch, onset, duration, rests, ties, ornaments, lyrics, alternatives, and confidence.
- Harmony events remain subordinate to the approved form map.
- Accompaniment arrangement is stored separately from source transcription.
- Linear and written-form scores have explicit mappings.
- Human approval gates exist for form, transcription, and arrangement.
- Validation rejects malformed form, melody, score mapping, or approval state.
- Both new and updated skills pass the Codex skill validator.
- The repository and installed copies can be checked and synchronized deterministically.
