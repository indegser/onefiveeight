# Agent Contracts

Use these contracts when dispatching subagents or when performing the roles sequentially. Save each artifact as JSON in the run directory.

## Artifact Names

- `01_preprocessing.json`
- `02_stems.json`
- `03_tempo_beats.json`
- `04_chroma.json`
- `05_chord_candidates.json`
- `06_harmonic_context.json`
- `07_sections.json`
- `08_theory_review.json`
- `09_final_analysis.json`

## Audio Preprocessing Agent

Validate the input audio, convert a working copy to WAV when useful, normalize loudness only if it improves analysis, downmix as needed, and detect corrupted or unsupported files.

```json
{
  "audio_path": "string",
  "duration_seconds": 0,
  "sample_rate": 44100,
  "channels": 2,
  "warnings": []
}
```

## Stem Separation Agent

Separate or locate useful stems. Prioritize bass and harmonic stems. Do not rely on drums or vocals for harmonic decisions.

```json
{
  "stems": {
    "bass": "path_or_null",
    "harmonic": "path_or_null",
    "vocals": "path_or_null",
    "drums": "path_or_null",
    "full_mix": "path"
  },
  "warnings": []
}
```

## Tempo and Beat Tracking Agent

Estimate BPM, beats, downbeats, bars, time signature, and confidence. Mark uncertainty for rubato, tempo drift, missing drums, or bad transients.

```json
{
  "bpm": 0,
  "time_signature": "4/4",
  "beats": [],
  "bars": [],
  "confidence": 0.0,
  "warnings": []
}
```

## Pitch and Chroma Extraction Agent

Extract chroma from harmonic stems and full mix. Extract bass pitch separately when possible. Smooth noisy frame-level features.

```json
{
  "frames": [
    {
      "start": 0.0,
      "end": 0.5,
      "chroma": {
        "C": 0.0,
        "C#": 0.0,
        "D": 0.0,
        "D#": 0.0,
        "E": 0.0,
        "F": 0.0,
        "F#": 0.0,
        "G": 0.0,
        "G#": 0.0,
        "A": 0.0,
        "A#": 0.0,
        "B": 0.0
      },
      "bass_note": "string_or_null",
      "confidence": 0.0
    }
  ]
}
```

## Chord Candidate Agent

Generate multiple candidates per segment from chroma and bass evidence. Include major, minor, diminished, augmented, sus2, sus4, dominant 7, maj7, m7, m7b5, add9, 6, and slash chords. Prefer readable labels over excessively literal labels.

```json
{
  "candidates": [
    {
      "start": 0.0,
      "end": 1.0,
      "candidates": [
        {
          "chord": "Cmaj7",
          "bass": "C",
          "score": 0.92,
          "notes_detected": ["C", "E", "G", "B"],
          "explanation": "Strong C, E, G, B energy with C bass."
        }
      ]
    }
  ]
}
```

## Harmonic Context Agent

Refine chord choices using key center, diatonic function, secondary dominants, ii-V motion, modal interchange, common pop progressions, bass motion, and repeated sections.

```json
{
  "refined_chords": [
    {
      "start": 0.0,
      "end": 2.0,
      "chord": "Cmaj7",
      "roman": "Imaj7",
      "confidence": 0.9,
      "reasoning_summary": "Fits the local ii-V-I cadence in C major."
    }
  ],
  "key": {
    "estimated_key": "C major",
    "confidence": 0.85,
    "alternatives": ["A minor"]
  }
}
```

## Section Segmentation Agent

Detect repeated sections where possible. Label rough sections such as Intro, Verse, Pre-Chorus, Chorus, Bridge, Solo, and Outro. Align chord changes to bars when beat tracking is reliable.

```json
{
  "sections": [
    {
      "name": "Verse",
      "start": 12.0,
      "end": 42.0,
      "bars": [],
      "chords": []
    }
  ]
}
```

## Music Theory Reviewer Agent

Review the final chart for plausibility. Flag suspicious chords, suggest simpler alternatives, identify likely slash chords, identify likely extensions that were simplified, and explain uncertainty clearly.

```json
{
  "issues": [],
  "suggestions": [],
  "simplified_chart": [],
  "advanced_chart": []
}
```

## Final Analysis Artifact

Use this top-level shape for `09_final_analysis.json`.

```json
{
  "audio": {
    "path": "string",
    "duration_seconds": 0
  },
  "key": {
    "estimated_key": "C major",
    "confidence": 0.85,
    "alternatives": []
  },
  "tempo": {
    "bpm": 120,
    "time_signature": "4/4",
    "confidence": 0.8
  },
  "sections": [],
  "timestamped_chords": [
    {
      "start": 0.0,
      "end": 2.0,
      "chord": "C",
      "roman": "I",
      "confidence": 0.8,
      "notes": ""
    }
  ],
  "simplified_chart": [],
  "advanced_chart": [],
  "ambiguities": [],
  "warnings": []
}
```
