# Artifact Contracts

## Artifact Flow

Use stable names and never overwrite evidence with later judgments:

| Artifact | Purpose |
| --- | --- |
| `00_job.json` | requested output mode, target instrument, difficulty, and user references |
| `01_source.json` | immutable source identity and working-copy metadata |
| `02_evidence.json` | stems and low-level observed features |
| `03_form_hypotheses.json` | competing neutral form and recurrence hypotheses |
| `04_preliminary_events.json` | provisional melody, bass, harmony, lyric, and groove evidence |
| `05_form_map.json` | adjudicated form and measure authority |
| `06_transcription.json` | approved-form-aligned source transcription |
| `07_linear_score.json` | complete uncompressed performance timeline |
| `08_accompaniment.json` | optional generated arrangement |
| `09_written_form.json` | compressed notation form and pass mappings |
| `10_review.json` | approval gates, findings, and reopened dependencies |
| `11_final_score.json` | validated final package |

Every artifact must include `schema_version`, stable IDs, evidence references, confidence where relevant, warnings, and provenance.

## Identity and Coordinates

Use these coordinates consistently:

- `measure_id`: stable linear performance measure ID.
- `measure_index`: one-based linear performance order.
- `section_id`: stable adjudicated section occurrence ID.
- `occurrence`: one-based occurrence of a semantic or neutral section family.
- `recurrence_group`: ID shared by structurally corresponding sections.
- `bar_in_section`: one-based position inside the section occurrence.
- `source_start` and `source_end`: seconds in the original audio.
- `onset_beat`: one-based position inside the measure; subdivisions may be fractional.

Do not derive IDs from mutable semantic labels.

## Provenance

Use:

- `observed`: raw or deterministic evidence from the source.
- `adjudicated`: a reviewed musical interpretation of evidence.
- `generated`: accompaniment or notation content created from approved transcription.
- `user`: a user-provided correction or reference.

Generated events may use `derived_from_refs` but must not use `source_refs` to claim direct observation.

## Form Map

The adjudicated form owns measure identity:

```json
{
  "status": "approved",
  "measures": [
    {
      "measure_id": "m1",
      "measure_index": 1,
      "source_start": 0.4,
      "source_end": 2.2,
      "time_signature": "4/4",
      "beats": 4,
      "is_pickup": false,
      "section_id": "sec-a-1",
      "occurrence": 1,
      "recurrence_group": "rg-a",
      "bar_in_section": 1,
      "confidence": 0.87,
      "evidence_refs": ["ev-downbeat-1", "ev-repeat-a1"]
    }
  ],
  "sections": [
    {
      "section_id": "sec-a-1",
      "neutral_label": "A",
      "semantic_label": "Verse",
      "label_status": "inferred",
      "occurrence": 1,
      "recurrence_group": "rg-a",
      "start_measure_id": "m1",
      "end_measure_id": "m8",
      "boundary_confidence": 0.82,
      "label_confidence": 0.7,
      "evidence_refs": ["ev-repeat-a1", "ev-vocal-entry"]
    }
  ],
  "form_events": [],
  "rejected_hypotheses": [],
  "warnings": []
}
```

## Melody Events

Represent notes and rests explicitly:

```json
{
  "event_id": "mel-m1-1",
  "type": "note",
  "onset_beat": 1.5,
  "duration_beats": 0.5,
  "source_start": 0.65,
  "source_end": 0.88,
  "pitch": "Eb4",
  "sounding_pitch": "Eb4",
  "tie": "none",
  "ornament": null,
  "lyric": {
    "text": "good",
    "syllabic": "single",
    "confidence": 0.8
  },
  "confidence": 0.84,
  "alternatives": ["D4"],
  "source_refs": ["ev-f0-19", "stem-vocals"]
}
```

A rest uses `"type": "rest"` and omits `pitch`, `sounding_pitch`, and lyric text. A note requires scientific pitch notation. Use `tie` values `none`, `start`, `continue`, or `stop`.

## Harmony Events

Allow unresolved harmony:

```json
{
  "event_id": "harm-m1-1",
  "onset_beat": 1,
  "duration_beats": 4,
  "chord": "Ebmaj7",
  "bass": "Eb2",
  "confidence": 0.76,
  "alternatives": ["Eb"],
  "source_refs": ["ev-chroma-m1", "ev-bass-m1"],
  "form_position": {
    "section_id": "sec-a-1",
    "occurrence": 1,
    "recurrence_group": "rg-a",
    "bar_in_section": 1
  }
}
```

Set `chord` to `null` for N.C., tacet, or unresolved harmony and explain the state in `notes`. Do not encode multiple beat-positioned changes in one chord string.

## Linear Score

The linear score contains every performed measure in audio order. Each measure repeats its authoritative form coordinates and contains separate `melody_events`, `harmony_events`, and optional `bass_events`.

An event must remain inside the measure. Monophonic principal-melody events must not overlap.

## Accompaniment

Use:

```json
{
  "status": "approved",
  "provenance": "generated",
  "instrument": "piano",
  "difficulty": "intermediate",
  "layers": [
    {
      "layer_id": "piano-rh",
      "provenance": "generated",
      "measures": [
        {
          "measure_id": "m1",
          "events": [
            {
              "event_id": "arr-m1-1",
              "onset_beat": 1,
              "duration_beats": 2,
              "pitches": ["Eb3", "Bb3", "D4"],
              "derived_from_refs": ["harm-m1-1"]
            }
          ]
        }
      ]
    }
  ]
}
```

Use `"status": "omitted"` with empty layers when no arrangement was requested.

## Written Form

The written score may compress the timeline, but mappings must reproduce it:

```json
{
  "status": "ready",
  "written_measures": [
    {
      "written_measure_id": "w1",
      "time_signature": "4/4"
    }
  ],
  "linear_to_written": [
    {
      "linear_measure_id": "m1",
      "written_measure_id": "w1",
      "pass": 1
    }
  ],
  "form_events": []
}
```

Every linear measure must have one mapping entry. Multiple linear measures may map to the same written measure on different passes.

## Final Artifact

`11_final_score.json` uses:

```json
{
  "schema_version": "1.0",
  "source": {
    "audio_path": "song.wav",
    "duration_seconds": 180,
    "sha256": "64-lowercase-hex-characters",
    "provenance": "observed"
  },
  "evidence": {
    "artifact_refs": ["02_evidence.json"],
    "warnings": []
  },
  "form": {},
  "transcription": {
    "provenance": "adjudicated",
    "linear_measures": []
  },
  "arrangement": {},
  "written_score": {},
  "approvals": {
    "form": {
      "status": "approved",
      "reviewed_by": "human-or-agent-id",
      "notes": []
    },
    "transcription": {
      "status": "approved",
      "reviewed_by": "human-or-agent-id",
      "notes": []
    },
    "arrangement": {
      "status": "not_required",
      "reviewed_by": null,
      "notes": []
    }
  },
  "uncertainty": []
}
```

Use approval statuses `pending`, `approved`, `rejected`, or `not_required`. Form and transcription must be `approved` for a final score. Arrangement must be `approved` when present and `not_required` when omitted.
