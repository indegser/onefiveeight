# Chord Recognition Heuristics

## Evidence Priority

1. Treat bass evidence as highly influential for chord naming, inversions, and slash chords.
2. Use harmonic stems and full mix chroma as complementary evidence.
3. Downweight vocals because melodic non-chord tones can dominate short windows.
4. Ignore drums for harmonic decisions.
5. Prefer bar-level or half-bar-level smoothing when beat tracking is reliable.

## Chord Naming

- Prefer readable musician labels over exhaustive sonority labels.
- Use extensions such as 9, 11, and 13 only when the extension is stable and harmonically meaningful.
- If C-E-G-B-D is detected, write `Cmaj9` only when D is stable; otherwise prefer `Cmaj7` or `C`.
- If a complex dominant such as `G13b9` appears plausible but uncertain, write `G7` and mention unclear extensions.
- Use slash chords when the bass note is stable and different from the chord root.
- When unsure between `C` and `Am7/C`, use bass stability, phrase function, and surrounding progression.
- When unsure between `G7sus4` and `Dm7/G`, choose the functionally clearer label for the local context.

## Context Refinement

- Favor progressions that are coherent in the estimated key over isolated high-scoring frames.
- Recognize common cadences such as ii-V-I, IV-V-I, I-V-vi-IV, vi-IV-I-V, twelve-bar blues, and modal loops.
- Preserve secondary dominants and borrowed chords when they explain strong chroma and local resolution.
- Reuse harmonic interpretation across repeated sections when one pass has higher confidence.
- Mark modulations, tonicizations, or key ambiguity instead of forcing one global key.

## Confidence

Use confidence values as rough reliability signals:

- `0.85-1.00`: clear bass, stable chroma, coherent context.
- `0.65-0.84`: likely chord with minor ambiguity.
- `0.45-0.64`: plausible but alternatives should be shown.
- `<0.45`: uncertain; simplify the chord or report no confident estimate.

Lower confidence for dense mixes, distortion, heavy effects, unstable tuning, tempo drift, unclear bass, and chroma dominated by vocals.

## Final Chart Tone

Say "estimated", "likely", "appears", and "possibly" where appropriate. Do not claim exact transcription unless the user provides manual verification.
