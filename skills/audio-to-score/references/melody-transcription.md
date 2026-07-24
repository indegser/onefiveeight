# Melody Transcription

## Principal Melody

Identify the intended principal melody before note segmentation.

- Prefer the lead vocal or lead instrument named by the user.
- Separate backing vocals, doubles, harmonies, fills, and ad-libs into optional layers.
- Mark overlap or voice ambiguity instead of merging multiple lines into one impossible melody.
- Preserve instrumental principal melody in vocal rests when it functions as the song's lead line.

## Evidence to Notes

Keep pitch contours and onset evidence separate from notated notes.

For each note or rest record:

- stable event ID,
- source start and end seconds,
- onset beat and duration in the approved measure,
- written pitch and sounding pitch when transposition applies,
- confidence and alternatives,
- source evidence references,
- tie state,
- ornament or grace-note role,
- lyric syllable and syllabic state when available,
- simplification notes.

Represent rests explicitly. Do not extend the preceding note merely because pitch tracking becomes unvoiced.

## Rhythm and Quantization

- Derive note timing from the approved tempo and meter map.
- Preserve pickup notes, anticipations, syncopation, ties across barlines, tuplets, and meter changes.
- Compare equivalent phrases before quantization; use the cleanest recurrence as evidence while preserving real variants.
- Prefer the least complex rhythm that explains the performance without erasing phrase-defining syncopation.
- Keep raw timing alongside quantized timing so human corrections remain reversible.

## Pitch and Spelling

- Estimate and record tuning reference before rounding pitch.
- Distinguish slides, vibrato, scoops, and passing pitch from separate notes.
- Choose enharmonic spelling from local key, harmony, voice leading, and melodic direction.
- Preserve octave, not only pitch class.
- Lower confidence when the melody is polyphonic, doubled, heavily processed, or masked.

## Lyrics

Treat lyric transcription and alignment as optional evidence layers.

- Keep text confidence separate from note confidence.
- Support melisma, elision, pickup syllables, and notes without lyrics.
- Do not invent lyrics to fill uncertain spans.

## Review

Loop every low-confidence phrase against the source and useful stems. Audition the symbolic melody with the tempo map. Compare pitch contour, phrase starts, phrase endings, rests, and recurrence peers before approval.
