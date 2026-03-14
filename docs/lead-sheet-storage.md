# Lead Sheet Storage Contract

## Purpose

- Approved lead-sheet-team output is stored as one Markdown file per song before any future database migration.
- This Markdown layer is the canonical handoff boundary between the extraction workflow and downstream application tooling for now.

## Why Markdown First

- Easy to inspect in git
- Easy to diff during review
- Cheap to iterate before database structure stabilizes
- Straightforward to map into future Supabase tables

## Directory

- Published files live in `./lead-sheets`

## File Rules

- One song per file
- Kebab-case filename
- UTF-8 text
- YAML frontmatter for stable metadata
- Markdown body for structured chart content

## Required Frontmatter

```yaml
song_id: i-dont-want-to-miss-a-thing
title: I Don't Want to Miss a Thing
artist: Aerosmith
source_type: image
source_files:
  - path-or-identifier
status: approved
reviewed_at: 2026-03-14T00:00:00.000Z
published_at: 2026-03-14T00:00:00.000Z
key_center: D major / E intro pedal
feel: Power ballad
meter: 4/4 with 2/4 tag
tempo_text: ""
confidence: 1
```

## Body Contract

Recommended sections:

- `# <Song Title>`
- `## Notes`
- `## Sections`
- `### <Section Name>`
- A table with:
  - `System`
  - `Measures`
  - `Directives`
- `## Review Notes`

## Data Discipline

- Only publish approved charts into `./lead-sheets`
- Do not add unsupported inference to the Markdown body
- Preserve source phrasing when chart text is ambiguous
- If a chart is not fully approved, keep it inside run artifacts rather than publishing it here

## Future Supabase Mapping

This file contract is designed so it can later map into:

- `songs`
- `song_sources`
- `song_sections`
- `song_systems`
- `song_measures`
- `song_directives`

The Markdown layer is temporary storage, but its shape should already mirror that relational split closely.
