# Form Analysis

## Evidence Order

Use all available evidence without letting one feature own the form:

1. beat, downbeat, meter, pickup, and tempo alignment,
2. repeated melodic contour and lyric phrase shape,
3. harmonic recurrence and cadence position,
4. timbre, instrumentation, vocal activity, energy, and onset density,
5. self-similarity and novelty boundaries,
6. user charts, corrections, rehearsal marks, or known structural references.

Treat user-provided symbolic form evidence as high priority, but record conflicts with the audio timeline.

## Hypothesis Pass

Create measure-aligned neutral regions before semantic naming.

For each candidate region record:

- stable `section_candidate_id`,
- start and end measure IDs,
- neutral label such as `A`, `A'`, or `B`,
- recurrence-group candidates,
- boundary confidence and evidence references,
- phrase length,
- similarity links and arrangement-difference notes,
- alternative boundaries.

Generate more than one complete form hypothesis when a boundary decision changes performance order, measure count, or recurrence grouping.

## Evidence Feedback Pass

Use preliminary melody, harmony, bass, lyrics, and groove events to challenge the hypotheses.

- Split regions when melodic or cadential closure consistently disagrees with a proposed boundary.
- Merge regions when novelty is superficial and recurrence evidence supports one phrase.
- Align corresponding measures inside recurrence groups.
- Preserve genuine altered repeats, extensions, reharmonizations, and final-chorus lifts.
- Do not treat silence, a drum fill, or a single texture change as a section by itself without phrase evidence.

## Adjudicated Form

The approved form map must contain:

- ordered measures with stable IDs,
- per-measure time signature, duration, pickup state, and audio interval,
- section IDs, neutral labels, optional semantic labels, occurrences, recurrence groups, and bar-in-section positions,
- tempo and meter changes,
- linear performance order,
- form events and their evidence,
- rejected form hypotheses and reasons,
- approval status and review notes.

Semantic labels require evidence. Use `Section A` or another neutral label when function is unclear.

## Change Control

After form approval, downstream modules may emit `form_change_requests` but must not rewrite measure IDs or section membership.

A form change request must name affected measures, conflicting evidence, downstream impact, and a proposed replacement. Reopen form approval before regenerating dependent artifacts.

## Written Form

Create compressed written form only after the complete linear score is verified.

- Map every linear measure to exactly one written measure for a given pass.
- Preserve pass numbers for repeats and alternate endings.
- Do not merge recurrence peers that contain performance-significant melody, harmony, meter, or arrangement differences.
- Require explicit targets for D.S., D.C., segno, coda, and fine.
- Keep the uncompressed linear timeline authoritative for audio synchronization.
