# Publication Handoff

Use this contract when a validated score will be consumed by a songbook, score viewer, rehearsal app, or downstream publishing workflow.

## Authority

Generate the handoff from `11_final_score.json` and its exported assets. Do not re-transcribe notes, re-enter chords, or infer a new form inside the consumer integration.

Keep these relationships explicit:

- the approved linear form remains the navigation and measure-order authority,
- MusicXML or another notation asset remains the rendered-note authority,
- MIDI remains an audition asset,
- generated accompaniment remains distinct from observed or adjudicated transcription,
- consumer metadata and layout preferences remain derived presentation data.

## Manifest

Write `12_publication_handoff.json` with this shape:

```json
{
  "schema_version": "1.0",
  "source_final_score": "11_final_score.json",
  "status": "automatic_draft",
  "song": {
    "id": "stable-song-id",
    "title": "Song title",
    "artist": "Artist",
    "key": "F major",
    "meter": "4/4",
    "feel": "Ballad"
  },
  "form": {
    "digest": "P → A1 → A2 → B → A1′ → Coda",
    "linear_measure_count": 86,
    "sections": []
  },
  "layout": {
    "preferred_measures_per_system": 4,
    "preserve_section_boundaries": true,
    "allow_short_final_system": true,
    "responsive_fallback": "reduce-measures-before-compressing-notation"
  },
  "parts": [
    {
      "id": "melody",
      "label": "Melody",
      "provenance": "adjudicated",
      "default_visible": true
    },
    {
      "id": "piano-rh",
      "label": "Piano RH",
      "provenance": "generated",
      "default_visible": true
    }
  ],
  "assets": {
    "musicxml": "final-score.musicxml",
    "midi": "final-score.mid"
  },
  "disclosures": [],
  "approvals": {},
  "warnings": []
}
```

Use stable section and part IDs from the final score where available. Copy approval state and uncertainty rather than translating `pending` into a publication-ready claim.

## Layout Rules

- Show the form digest before the score so readers understand the whole-song structure first.
- Prefer four measures per system in readable 4/4 lead-sheet and songbook contexts.
- Start a new system at a section boundary when feasible. Never move a measure across an approved section merely to fill a row.
- Allow pickups, meter changes, dense rhythmic passages, and narrow viewports to use fewer measures.
- Allow the final system of a section or song to contain fewer than four measures.
- Preserve rehearsal labels and section identity in the rendered score.

## Consumer Integration

1. Register the song metadata and form digest.
2. Copy or upload declared assets without changing the canonical exports.
3. Load every requested notation part in the declared order.
4. Expose MIDI only as audition unless the consumer explicitly treats it as notation input.
5. Display automatic-draft, generated-layer, omitted-content, and low-confidence disclosures.
6. Verify the first, middle, and final systems plus at least one repeated or varied section.
7. Verify representative desktop and mobile widths and confirm asset URLs return successfully.

Do not call the publication handoff complete when only the song list entry exists or when the consumer hides the approved form.
