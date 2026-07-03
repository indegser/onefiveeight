# Chord Recognition Heuristics

These heuristics guide the Musician Judgment Agent. They are not a scoring formula.

## Human-Style Judgment

- Treat scripts as measuring instruments. Use them to gather evidence, then decide like a musician.
- Never accept the top chroma or template candidate without context.
- Choose the chart label that best explains what a player needs to know: bass motion, function, harmonic rhythm, phrase role, cadence, repetition, and stable color tones.
- Distinguish detected sonority from chart label. A dense mix can contain many pitch classes without requiring an over-specific chord name.
- When evidence conflicts, preserve alternatives instead of inventing certainty.

## Dense Mix Evidence Priority

1. Bass stem or stable low-register evidence.
2. `other` or harmonic stem after vocals/drums are removed.
3. Full mix chroma as comparison evidence.
4. Vocals only as a warning source for possible melodic non-chord tones.
5. Drums never for harmonic decisions.

Lower confidence when vocals dominate chroma, bass is masked, strings or pads sustain non-functional color tones, guitars are distorted, tuning is unstable, or sections contain rubato/tempo drift.

## Candidate Review

For each low- or medium-confidence segment:

1. Compare at least two plausible candidates.
2. Ask which candidate explains the bass note and its motion into the next chord.
3. Ask which candidate fits the local key, cadence, and phrase function.
4. Ask whether repeated sections support the same interpretation.
5. Choose the most useful musician-facing label.
6. Preserve the rejected plausible labels in ambiguities.

## Extension Policy

Preserve sevenths, suspensions, slash basses, secondary dominants, borrowed chords, and stable extensions when they affect function, voice leading, or performance.

Do not label every detected pitch-class as an extension. Use `add9`, `9`, `11`, `13`, altered tones, and compound slash labels only when the tone is:

- stable across the segment or repeated sections,
- present in the harmonic source, not only vocals,
- supported by voicing or bass context,
- useful to the musician reading the chart.

If the tone is plausible but not stable, choose the simpler chart label and mention the color tone in notes or ambiguities.

## Simplification Policy

Simplify only when the added tones are unstable, ornamental, low-confidence, or not useful to the chart.

Examples:

- Write `C7` rather than `C13b9` when altered extensions are unclear.
- Write `Cmaj7` rather than `Cmaj9` when 9 is present but not stable.
- Write `Bbadd9` rather than `Bb` when the 9 is stable and affects the color.
- Write `A7/C#` rather than `Dmaj7/C#` when it better explains a resolution to `Dm`.

## Slash Chords and Bass

- Use slash chords when the bass note is stable, segment-level, and functionally meaningful.
- Do not infer slash chords from a single noisy low-register frame.
- When unsure between inversion and alternate-root labels, prefer the one that best explains phrase function and resolution.
- `G7sus4` vs `Dm7/G`: choose the label that best explains dominant function or predominant color in context.
- `C` vs `Am7/C`: use bass stability, surrounding harmony, and phrase role.

## Repeated Sections

- Compare verse/chorus repeats before finalizing.
- Reuse the interpretation with better evidence when repeated sections are harmonically equivalent.
- Allow meaningful variation between repeats, but do not let local noise create fake reharmonizations.

## Context Patterns

Use context to override isolated scores when appropriate:

- ii-V-I, IV-V-I, I-V-vi-IV, vi-IV-I-V, and common pop-ballad loops.
- Secondary dominants such as `A7 -> Dm` in F major.
- Borrowed iv such as `Bbm -> F`.
- Pedal bass or slash colors such as `Bbadd9/C`.
- Modal mixture, tonicization, and key-center ambiguity.

## Confidence Language

- `0.85-1.00`: clear bass, stable harmonic evidence, coherent context.
- `0.65-0.84`: likely chord with minor ambiguity.
- `0.45-0.64`: plausible but alternatives should be shown.
- `<0.45`: uncertain; choose a readable label only if necessary and document alternatives.

Use "estimated", "likely", "appears", and "possibly" where appropriate. Do not claim exact transcription unless manually verified.
