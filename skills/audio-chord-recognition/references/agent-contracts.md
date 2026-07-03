# Agent Contracts

Use these contracts when dispatching subagents or when performing the roles sequentially. Save each artifact as JSON in the run directory.

## Artifact Flow

- `01_preprocessing.json`
- `02_stems.json`
- `03_tempo_bars.json`
- `04_pitch_chroma_evidence.json`
- `05_chord_candidates.json`
- `06_sections.json`
- `07_harmonic_context.json`
- `08_musician_judgment.json`
- `09_final_analysis.json`

The flow is evidence first, judgment second. `05_chord_candidates.json` is not a chord chart. It is the evidence packet consumed by the Musician Judgment Agent.

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

Separate or locate useful stems. For dense mixes, prioritize `other` or harmonic stem plus bass stem. Do not use vocals or drums as primary harmonic evidence.

```json
{
  "method": "demucs|spleeter|existing_stems|hpss|none",
  "stem_quality": {
    "bass": 0.0,
    "other_or_harmonic": 0.0,
    "vocals": 0.0,
    "drums": 0.0
  },
  "preferred_harmony_source": "other|harmonic|full_mix",
  "preferred_bass_source": "bass|full_mix_low_register",
  "stems": {
    "bass": "path_or_null",
    "other": "path_or_null",
    "harmonic": "path_or_null",
    "vocals": "path_or_null",
    "drums": "path_or_null",
    "full_mix": "path"
  },
  "warnings": []
}
```

## Tempo and Bar Grid Agent

Estimate BPM, beats, downbeats, bars, pickup/pre-roll, and confidence. Bar numbering is part of the contract because the final chart should support measure labels.

```json
{
  "bpm": 0,
  "time_signature": "4/4",
  "beats": [],
  "bar_starts": [],
  "pickup_seconds": 0.0,
  "first_bar_start": 0.0,
  "bar_numbering_rule": "m.1 starts at first_bar_start; earlier audio is pickup/pre-roll",
  "downbeat_confidence": 0.0,
  "confidence": 0.0,
  "warnings": []
}
```

## Pitch and Chroma Evidence Agent

Extract evidence, not chord answers. Separate source-specific observations so the reviewer can judge conflicts between full mix, harmonic source, bass, and vocals.

```json
{
  "source_priority": ["other", "bass", "harmonic", "full_mix"],
  "segments": [
    {
      "start": 0.0,
      "end": 2.0,
      "measure": "m.1",
      "chroma_by_source": {
        "other": {"C": 0.0},
        "harmonic": {"C": 0.0},
        "full_mix": {"C": 0.0}
      },
      "bass_evidence": {
        "bass_note": "C",
        "stability": 0.0,
        "source": "bass"
      },
      "extension_evidence": [
        {
          "tone": "D",
          "role": "possible_9",
          "stability": 0.0,
          "source": "other",
          "could_be_melody_or_color": true
        }
      ],
      "warnings": []
    }
  ]
}
```

## Chord Candidate Agent

Generate multiple plausible candidates per segment from the evidence packet. Do not select the final chord. Candidate scores are evidence quality signals, not decisions.

Required behavior:

- Keep at least three candidates when evidence permits.
- Include source-specific support and conflicts.
- Include bass evidence and extension evidence separately.
- Mark when a high-scoring candidate may be a dense sonority rather than a useful chart label.
- Never discard musically plausible alternatives only because they are not top-scoring.

```json
{
  "segments": [
    {
      "start": 0.0,
      "end": 2.0,
      "measure": "m.1",
      "do_not_select_automatically": true,
      "top_candidates": [
        {
          "chord": "Bbadd9/C",
          "score": 0.82,
          "bass": "C",
          "function_guess": "IV over V pedal",
          "supporting_notes": ["Bb", "C", "D", "F"],
          "source_support": {
            "other": 0.81,
            "bass": 0.74,
            "full_mix": 0.69
          },
          "extension_evidence": [
            {
              "tone": "D",
              "role": "add9",
              "stability": 0.73
            }
          ],
          "conflicts": ["full_mix also supports C7 because of vocal or passing tone"],
          "explanation": "Stable Bb-F-D color over C bass; could function as IV/V or suspended dominant color."
        }
      ],
      "uncertainty": "medium",
      "warnings": []
    }
  ]
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
      "measure_start": 5,
      "measure_end": 12,
      "repeated_with": ["Verse 2"],
      "confidence": 0.0,
      "warnings": []
    }
  ]
}
```

## Harmonic Context Agent

Summarize key center, local tonicizations, repeated-section relationships, cadences, and style assumptions. This agent informs final judgment but does not write the final chart.

```json
{
  "key": {
    "estimated_key": "F major",
    "confidence": 0.64,
    "alternatives": ["D minor", "Bb major"]
  },
  "context_notes": [
    {
      "range": "m.20-m.29",
      "observation": "A7 resolves to Dm, likely V7/vi."
    }
  ],
  "repeated_section_links": [],
  "warnings": []
}
```

## Musician Judgment Agent

This role is mandatory and is the final harmonic adjudicator. It must choose the chart label like a musician, not like a scoring algorithm.

Rules:

- Do not choose chords by highest candidate score alone.
- Compare at least two plausible interpretations for low- or medium-confidence segments.
- Prefer the label that best explains bass motion, harmonic rhythm, phrase function, key center, neighboring chords, repeated sections, cadence, and section role.
- Preserve sevenths, suspensions, slash basses, secondary dominants, borrowed chords, and stable extensions when they affect function, voice leading, or performance.
- Do not label every detected pitch-class as an extension. Use 9, 11, 13, altered tones, add chords, and compound slash labels only when the tone is stable across the segment and supported by bass, repetition, voicing, or function.
- If neither interpretation is clearly better, choose a readable chart label and preserve alternatives in ambiguities.
- Record rejected candidates and why they were rejected.

```json
{
  "decisions": [
    {
      "start": 0.0,
      "end": 2.0,
      "measure": "m.1",
      "chosen_chord": "A7/C#",
      "roman": "V7/vi",
      "confidence": 0.64,
      "accepted_candidate": "A7/C#",
      "rejected_candidates": [
        {
          "chord": "Dmaj7/C#",
          "reason": "Pitch set is plausible, but A7/C# better explains secondary-dominant function into Dm."
        }
      ],
      "musical_reasoning": "C# bass resolves upward to D while A7 functions as V7/vi in F major.",
      "bass_motion": "C# -> D",
      "function": "secondary dominant",
      "extension_policy": "Keep 7th because dominant function matters; do not add 9/13 without stable evidence.",
      "alternatives": ["A/C#", "Dmaj7/C#"]
    }
  ],
  "global_issues": [],
  "unresolved_ambiguities": []
}
```

## Final Chart Writer Agent

Write the final musician-facing result from `08_musician_judgment.json`, section data, and bar grid. Do not re-adjudicate from raw scores.

Include:

- Advanced section chart
- Measure chart
- Timestamped chord table
- Simplified chart as secondary
- Ambiguities and verification notes

## Final Analysis Artifact

Use this top-level shape for `09_final_analysis.json`.

```json
{
  "audio": {
    "path": "string",
    "duration_seconds": 0
  },
  "key": {
    "estimated_key": "F major",
    "confidence": 0.64,
    "alternatives": []
  },
  "tempo": {
    "bpm": 120,
    "time_signature": "4/4",
    "confidence": 0.8
  },
  "sections": [],
  "measure_chart": [
    {
      "measure": "m.1",
      "time": "0:00.3-0:04.4",
      "chord": "Dm7",
      "roman": "vi7",
      "confidence": 0.7,
      "notes": ""
    }
  ],
  "timestamped_chords": [
    {
      "start": 0.0,
      "end": 2.0,
      "chord": "Dm7",
      "roman": "vi7",
      "confidence": 0.8,
      "notes": ""
    }
  ],
  "advanced_chart": [],
  "simplified_chart": [],
  "ambiguities": [],
  "warnings": []
}
```
