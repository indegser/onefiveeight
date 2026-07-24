# Harmony Evidence Contract

## Boundary

Treat evidence scripts as measuring instruments. They may:

- inspect and normalize audio,
- enumerate tempo, beat-grid, key, bass, and chord hypotheses,
- aggregate source-specific measurements,
- calculate recurrence descriptors,
- validate artifact structure.

They must not:

- choose the final tempo level or downbeat,
- freeze standalone form,
- emit `chosen_chord`, decision confidence, or final form,
- force repeated positions to match,
- produce a finished chord chart.

The agent owns those decisions. Numeric `evidence_support` ranks measured fit only.
It is not the final musical `confidence`.

## Evidence Extraction

Run:

```bash
python3 scripts/extract_harmony_evidence.py FULL_MIX \
  --workdir RUN_DIR \
  --harmonic-source NO_VOCALS_OR_OTHER \
  --bass-source BASS_STEM
```

The harmonic and bass sources are optional. When omitted, preserve warnings and
lower the weight of affected evidence during adjudication. Keep stem separation
outside this script so callers can choose models and preserve provenance.

The extractor writes:

1. `04_harmony_evidence.json`
2. `05_chord_candidates.json`

Validate both with `scripts/validate_evidence.py` before agent adjudication.

## Harmony Evidence

```json
{
  "artifact_type": "harmony_evidence",
  "artifact_version": "1.0",
  "role": "measurement_only",
  "status": "evidence_ready",
  "do_not_select_automatically": true,
  "audio": {
    "path": "song.wav",
    "duration_seconds": 180,
    "sample_rate": 22050
  },
  "sources": [
    {"role": "full_mix", "path": "song.wav"},
    {"role": "harmonic", "path": "no_vocals.wav"},
    {"role": "bass", "path": "bass.wav"}
  ],
  "tempo_hypotheses": [
    {
      "hypothesis_id": "tempo-observed-pulse",
      "metrical_level": "observed_pulse",
      "bpm": 70,
      "evidence_support": 0.78,
      "requires_agent_selection": true
    },
    {
      "hypothesis_id": "tempo-double-time",
      "metrical_level": "double_time",
      "bpm": 140,
      "evidence_support": 0.68,
      "requires_agent_selection": true
    }
  ],
  "beat_grid_hypotheses": [
    {
      "grid_id": "grid-observed-pulse",
      "tempo_hypothesis_id": "tempo-observed-pulse",
      "meter_hypothesis": "4/4",
      "beat_period_seconds": 0.857143,
      "anchor_candidates": [
        {
          "phase_index": 0,
          "anchor_seconds": 0.45,
          "bar_period_seconds": 3.428572
        }
      ],
      "requires_agent_selection": true
    }
  ],
  "key_hypotheses": [
    {"key": "Eb major", "evidence_support": 0.83},
    {"key": "C minor", "evidence_support": 0.79}
  ],
  "segments": [
    {
      "segment_id": "fixed-0001",
      "start": 0,
      "end": 2,
      "resolution": "fixed_window",
      "chroma_by_source": {
        "harmonic": {"C": 0.1, "Eb": 0.7, "G": 0.5}
      },
      "bass_candidates": [
        {"pitch_class": "Eb", "evidence_support": 0.62},
        {"pitch_class": "Bb", "evidence_support": 0.21}
      ],
      "warnings": []
    }
  ],
  "recurrence_candidates": [
    {
      "segment_id": "fixed-0001",
      "peers": [
        {"segment_id": "fixed-0017", "similarity_support": 0.93}
      ],
      "requires_agent_interpretation": true
    }
  ],
  "warnings": []
}
```

Tempo hypotheses are metrical alternatives, not competing final answers.
Beat-grid anchors are phase candidates, not approved downbeats. Fixed-window
segments are measurement coordinates and must not become final measures without
agent review.

Recurrence candidates describe non-adjacent chroma similarity only. They do not
declare sections, repeats, or equivalent harmony. The agent must interpret them
with phrase, cadence, arrangement, and form evidence.

Use `status: "partial_evidence"` when tempo alternatives, beat grids, or segment
measurements are incomplete. A partial artifact remains valid and must route the
agent to manual recovery rather than pretending the measurements are ready.

## Chord Candidates

```json
{
  "artifact_type": "chord_candidates",
  "artifact_version": "1.0",
  "role": "measurement_only",
  "do_not_select_automatically": true,
  "source_artifact": "04_harmony_evidence.json",
  "score_semantics": "evidence_support ranks template fit only; it is not decision confidence",
  "segments": [
    {
      "segment_id": "fixed-0001",
      "start": 0,
      "end": 2,
      "do_not_select_automatically": true,
      "candidates": [
        {
          "rank": 1,
          "chord": "Eb",
          "evidence_support": 0.81,
          "template_support": 0.88,
          "complexity_penalty": 0,
          "extension_tone_support": null
        },
        {
          "rank": 2,
          "chord": "Ebmaj7",
          "evidence_support": 0.72,
          "template_support": 0.84,
          "complexity_penalty": 0.06,
          "extension_tone_support": 0.2
        }
      ],
      "agent_review_required": true
    }
  ],
  "warnings": []
}
```

Keep at least two candidates per emitted segment. Apply a complexity penalty to
sevenths, extensions, alterations, suspensions, and slash interpretations unless
the additional evidence is stable in the harmonic source or recurrence peers.
Do not infer a slash chord merely because the bass candidate differs from the
top chord root.

## Agent Adjudication

Before final harmony:

1. Select metrical level and beat grid using phrase length, harmonic rhythm,
   pickups, cadence placement, and recurrence alignment.
2. In standalone mode, create provisional measures and form. In module mode,
   retain approved form coordinates.
3. Compare at least two chord candidates for low- and medium-confidence slots.
4. Explain the selected label through bass motion, local key, cadence, form
   role, and recurrence peers.
5. Assign final `confidence` only after this musical review.
6. Keep rejected plausible labels in alternatives or ambiguities.

## External Corroboration

Store external charts separately:

```json
{
  "external_corroboration": [
    {
      "url": "https://example.com/chart",
      "role": "secondary_reference",
      "agreement": ["key", "chorus root motion"],
      "conflicts": ["intro inversion"],
      "used_to_override_audio": false
    }
  ]
}
```

Use external material to challenge or corroborate an interpretation. Never copy
it into source evidence or let it silently decide low-confidence audio slots.
