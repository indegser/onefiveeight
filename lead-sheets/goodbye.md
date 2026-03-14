---
song_id: goodbye
title: Goodbye
artist: Air Supply
source_type: audio
source_files:
  - /Users/indegser/Downloads/Goodbye [h_pF0my1GP4].mp3
status: draft
reviewed_at: null
published_at: null
key_center: "Eb major with a late F#/Gb lift and final F coda"
feel: "Power ballad"
meter: "4/4"
tempo_text: "Approx. 66 BPM from full-track Demucs/librosa analysis"
confidence: 0.74
---

# Goodbye

## Notes

- This lead sheet keeps the existing practical chart and adds full-track MP3 validation.
- The audio pass returned 65 inferred bars and 57 merged chord spans.
- Meter was inferred as 4/4, but bar-boundary confidence remained only moderate.
- Treat passing dominants and suspended bars as review candidates rather than engraved facts.
- The comparison below adds musically cleaned 7th candidates by ballad idiom; these are theory-guided upgrades, not direct MIR facts.

## Sections

### Verse 1

| System | Measures | Directives |
| ------- | ------- | ---------- |
| gb-v1 | `Eb \| Gm \| Cm \| Fm Bb` | Verse 1 |
| gb-v2 | `Eb \| Gm \| Cm \| Fm Bb` | |

### Pre-Chorus

| System | Measures | Directives |
| ------- | ------- | ---------- |
| gb-p1 | `Eb \| Cm \| Ab \| Bb` | Pre-Chorus |
| gb-p2 | `Eb \| Cm \| Ab \| Bb` | |

### Chorus

| System | Measures | Directives |
| ------- | ------- | ---------- |
| gb-c1 | `Eb \| Ab \| Fm \| C Fm Bb` | Chorus |
| gb-c2 | `Eb \| Ab \| Fm \| C Fm Bb Eb` | resolve |

### Verse 2 Lift

| System | Measures | Directives |
| ------- | ------- | ---------- |
| gb-v3 | `F# \| Bbm \| Ebm \| Abm C#` | Verse 2 |
| gb-v4 | `F# \| Ebm \| B \| C#` | |

### Chorus Return

| System | Measures | Directives |
| ------- | ------- | ---------- |
| gb-c3 | `Eb \| Ab \| Fm \| C Fm Bb` | Chorus |
| gb-c4 | `Eb \| Ab \| Fm \| C Fm Bb` | hold for lift |

### Final Chorus

| System | Measures | Directives |
| ------- | ------- | ---------- |
| gb-f1 | `F \| Bb \| Gm \| D Gm C` | Final Chorus |
| gb-f2 | `F \| Bb \| Gm \| D Gm C F` | Goodbye |

## 7th Comparison

| Section | Practical chart | 7th-aware candidate |
| ------- | ------- | ---------- |
| Verse 1 | `Eb \| Gm \| Cm \| Fm Bb` | `Ebmaj7 \| Gm7 \| Cm7 \| Fm7 Bb7` |
| Pre-Chorus | `Eb \| Cm \| Ab \| Bb` | `Ebmaj7 \| Cm7 \| Abmaj7 \| Bb7` |
| Chorus | `Eb \| Ab \| Fm \| C Fm Bb` | `Ebmaj7 \| Abmaj7 \| Fm7 \| C7 Fm7 Bb7` |
| Chorus resolve | `Eb \| Ab \| Fm \| C Fm Bb Eb` | `Ebmaj7 \| Abmaj7 \| Fm7 \| C7 Fm7 Bb7 Ebmaj7` |
| Verse 2 Lift | `F# \| Bbm \| Ebm \| Abm C#` | `F#maj7 \| Bbm7 \| Ebm7 \| Abm7 C#7` |
| Verse 2 return | `F# \| Ebm \| B \| C#` | `F#maj7 \| Ebm7 \| Bmaj7 \| C#7` |
| Chorus Return | `Eb \| Ab \| Fm \| C Fm Bb` | `Ebmaj7 \| Abmaj7 \| Fm7 \| C7 Fm7 Bb7` |
| Final Chorus | `F \| Bb \| Gm \| D Gm C` | `Fmaj7 \| Bbmaj7 \| Gm7 \| D7 Gm7 C7` |
| Ending | `F \| Bb \| Gm \| D Gm C F` | `Fmaj7 \| Bbmaj7 \| Gm7 \| D7 Gm7 C7 Fmaj7` |

## Review Notes

- Full-track audio analysis agreed with the opening Eb area, the lifted F#/Gb section, and the final F ending.
- Some intermediate MIR labels leaned toward sus or altered dominant spellings, so the current chart remains a musically cleaned working draft.
- The 7th-aware column is intentionally conservative: tonic and subdominant majors become `maj7`, minor-function bars become `m7`, and dominant approach bars become `7`.
- Publish a final approved chart only after a human bar-by-bar check against the audio or a symbolic source.
