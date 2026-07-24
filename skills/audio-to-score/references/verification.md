# Verification

## Review Order

Review in dependency order:

1. source integrity and evidence coverage,
2. tempo, meter, pickup, and measure map,
3. form hypotheses and approved form,
4. principal melody and lyrics,
5. bass and harmony,
6. complete linear score,
7. generated accompaniment,
8. compressed written form and export,
9. publication handoff when requested.

Do not approve a downstream layer while an upstream artifact is reopened.

## Form Checks

- Every linear measure belongs to one approved section.
- Section occurrences and bar-in-section positions are continuous.
- Recurrence peers are aligned or explicitly marked as altered.
- Meter and pickup decisions agree with measure duration.
- Semantic labels include evidence.
- Written repeats reproduce the full linear performance order.

## Transcription Checks

- Notes and rests remain inside their measures.
- Melody events do not overlap within a monophonic layer.
- Raw and quantized timing remain traceable.
- Low-confidence events keep alternatives or review notes.
- Chord and bass events use approved form coordinates.
- Rests, tacet, and unresolved harmony remain representable.

## Arrangement Checks

- Every arrangement layer has generated provenance.
- No generated note appears inside source transcription.
- Instrument range, density, hand span or fret reach, and voice leading are playable for the selected difficulty.
- Accompaniment leaves space for the principal melody.
- Arrangement approval is separate from transcription approval.

## Audition Checks

- Loop source audio by measure and phrase.
- Compare useful stems with the full mix.
- Audition melody, bass, chords, and accompaniment separately.
- Compare recurrence peers at the same bar-in-section position.
- Render the tempo map rather than auditioning at one fixed BPM when tempo drifts.

## Publication Checks

- The form digest is visible before the notation and matches the approved performance order.
- Four-measure systems are preferred for readable 4/4 songbook layouts; section boundaries remain authoritative and the final system may be shorter.
- Every requested part is present, and generated accompaniment remains labeled as generated.
- MusicXML, MIDI, and any other declared assets load from their published paths.
- The first, middle, and final systems render without missing measures, duplicate titles, or repeated tempo marks.
- Representative desktop and mobile widths avoid horizontal overflow and unreadably compressed notation.
- Consumer-facing notes preserve uncertainty, omitted content, simplifications, and approval state.
- Playback duration and track selection agree with the exported score.

## Evaluation

Prefer a small reference corpus with trusted MIDI or MusicXML and annotated form.

Track:

- beat, downbeat, meter, and pickup accuracy,
- form boundary and recurrence-group accuracy,
- melody pitch, onset, duration, and rest accuracy,
- chord and bass accuracy by form slot,
- written-to-linear playback equivalence,
- human playability and readability judgments,
- correction count and time per approved minute of music.

Passing JSON validation proves structural consistency only.
