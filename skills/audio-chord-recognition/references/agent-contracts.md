# Harmony Agent Contracts

## Artifact Flow

Save roles separately:

1. `01_preprocessing.json`
2. `02_stems.json`
3. `03_form_context.json`
4. `04_harmony_evidence.json`
5. `05_chord_candidates.json`
6. `06_harmonic_context.json`
7. `07_musician_judgment.json`
8. `08_harmony_analysis.json`

Evidence producers do not choose final chords. The Musician Judgment role consumes candidates and form context.

## Form Context

Module mode requires:

```json
{
  "mode": "audio_to_score_module",
  "status": "approved",
  "source_artifact": "05_form_map.json",
  "measures": [
    {
      "measure_id": "m1",
      "measure_index": 1,
      "source_start": 0.4,
      "source_end": 2.2,
      "time_signature": "4/4",
      "beats": 4,
      "section_id": "sec-a-1",
      "occurrence": 1,
      "recurrence_group": "rg-a",
      "bar_in_section": 1
    }
  ]
}
```

Standalone mode uses `"status": "provisional"` and must not claim form approval.

## Harmony Evidence

Extract observations by form position:

```json
{
  "segments": [
    {
      "segment_id": "seg-m1-b1",
      "measure_id": "m1",
      "start": 0.4,
      "end": 1.3,
      "onset_beat": 1,
      "duration_beats": 2,
      "section_id": "sec-a-1",
      "occurrence": 1,
      "recurrence_group": "rg-a",
      "bar_in_section": 1,
      "chroma_by_source": {
        "harmonic": {},
        "full_mix": {}
      },
      "bass_evidence": {
        "pitch": "Eb2",
        "stability": 0.8,
        "source": "bass"
      },
      "extension_evidence": [],
      "warnings": []
    }
  ]
}
```

Do not include generated accompaniment notes as source evidence.

## Chord Candidates

Keep at least two plausible candidates for low- or medium-confidence segments:

```json
{
  "segments": [
    {
      "segment_id": "seg-m1-b1",
      "do_not_select_automatically": true,
      "candidates": [
        {
          "chord": "Ebmaj7",
          "score": 0.79,
          "bass": "Eb2",
          "function_guess": "Imaj7",
          "source_support": {
            "bass": 0.84,
            "harmonic": 0.76,
            "full_mix": 0.65
          },
          "conflicts": [],
          "evidence_refs": ["bass-m1", "chroma-m1"]
        }
      ],
      "uncertainty": "medium"
    }
  ]
}
```

Scores describe evidence support, not final decisions.

## Harmonic Context

Record global and local keys, cadence positions, bass motion, pedal tones, tonicizations, modulations, form roles, and recurrence relationships.

Use approved form coordinates. If evidence disputes the form, emit:

```json
{
  "form_change_requests": [
    {
      "affected_measure_ids": ["m16", "m17"],
      "evidence_refs": ["cadence-m16", "novelty-m17"],
      "reason": "Cadential closure and recurrence alignment support a boundary after m16.",
      "downstream_impact": "Recompute section IDs and recurrence slots from m17."
    }
  ]
}
```

Do not apply the request inside this skill.

## Musician Judgment

For each decision:

- compare candidates and bass motion,
- use local key, phrase function, cadence, and form role,
- compare the same `bar_in_section` across recurrence peers,
- preserve genuine altered repeats,
- choose a readable source-harmony label,
- record rejected candidates and reasons,
- preserve unresolved ambiguity.

```json
{
  "decisions": [
    {
      "segment_id": "seg-m1-b1",
      "chosen_chord": "Ebmaj7",
      "confidence": 0.76,
      "alternatives": ["Eb"],
      "rejected_candidates": [],
      "consensus_action": "kept",
      "musical_reasoning": "Stable tonic bass and major seventh recur at the same form slot.",
      "evidence_refs": ["bass-m1", "chroma-m1", "peer-m9"]
    }
  ]
}
```

## Final Module Artifact

`08_harmony_analysis.json` uses:

```json
{
  "mode": "audio_to_score_module",
  "audio": {
    "path": "song.wav",
    "duration_seconds": 180
  },
  "key": {
    "estimated_key": "Eb major",
    "confidence": 0.8,
    "alternatives": []
  },
  "tempo": {
    "bpm": 72,
    "time_signature": "4/4",
    "confidence": 0.75
  },
  "form_context": {
    "status": "approved",
    "source_artifact": "05_form_map.json"
  },
  "sections": [],
  "measure_chart": [],
  "timestamped_chords": [
    {
      "event_id": "harm-m1-1",
      "measure_id": "m1",
      "start": 0.4,
      "end": 2.2,
      "onset_beat": 1,
      "duration_beats": 4,
      "section_id": "sec-a-1",
      "occurrence": 1,
      "recurrence_group": "rg-a",
      "bar_in_section": 1,
      "chord": "Ebmaj7",
      "confidence": 0.76,
      "alternatives": ["Eb"],
      "evidence_refs": ["bass-m1", "chroma-m1"],
      "consensus_action": "kept"
    }
  ],
  "advanced_chart": [],
  "simplified_chart": [],
  "form_change_requests": [],
  "ambiguities": [],
  "warnings": []
}
```

Standalone output may omit `form_context`, form coordinates, `measure_chart`, and `form_change_requests` for backward compatibility. Treat missing `mode` as `standalone`.
