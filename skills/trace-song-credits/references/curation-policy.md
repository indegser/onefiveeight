# Curation Policy

## Build Distinct Listening Paths

Use only verified personnel or documentary connections. Choose from these branches:

- `same_work`: original, remake, official cover, or another purposeful recording of the same composition.
- `composer` or `songwriter`: the same writer working with another performer, or writing and performing their own work.
- `lyricist`: the same lyricist's work with another composer or performer.
- `arranger` or `producer`: the same person shaping another recording in the same credited role.
- `production_team`: two or more credited people recurring together across recordings.
- `session`: a notable performer recurring on another track.
- `documented_lineage`: influence, mentorship, sampling, or inheritance supported by an interview or authoritative source.

Never create an `audio_similarity` branch without actual audio analysis explicitly requested through another skill.

## Prefer Strong Connections

Judge candidates across separate dimensions rather than one opaque similarity score:

- directness of the relationship,
- importance of the overlapping roles,
- number of independently overlapping people,
- source quality,
- recording-version confidence,
- editorial value added to the listening path.

Prefer, in general:

1. The same work in a meaningfully different official recording.
2. Multiple core production people recurring together.
3. The same composer, songwriter, arranger, or producer in the same role.
4. A creator changing roles in an illuminating way, such as lyricist to writer-performer.
5. A single important session-player connection.
6. Documentary context that adds history but no direct credit overlap.

Do not force this into a rigid numeric ranking. Explain why a connection matters.

## Balance the Default Set

Return 8–12 recommendations when evidence supports them. A useful 12-track target is:

- same work or official alternate recording: 1–2,
- composer or songwriter: 2–3,
- arranger or producer: 2–3,
- lyricist: 1–2,
- recurring production team or session players: 1–2,
- documented lineage: at most 1.

Adapt the balance to the seed. Do not pad a sparse branch.

## Remove Redundancy

- Exclude the seed recording from the recommendation count.
- Collapse the same Spotify track ID.
- Collapse the same recording repeated on a compilation unless the release context matters.
- Include at most two interpretations of the same composition unless the user requests covers.
- Include an artist at most twice by default.
- Include an album at most twice by default.
- When one track belongs to multiple branches, list it once and show the secondary connections.
- Let one creator dominate only when the user asks for a focused study of that creator.

## Write Evidence-Backed Reasons

Use this pattern:

```text
Artist – Track
Connection: Person (role), Person (role)
Reason: The seed recording and this recording credit the same arranger and two of the same principal session musicians.
Relationship: recurring production team
Spotify · credit sources
```

Describe only what the sources establish. Do not write `sounds similar`, `shares the same harmony`, `has the same atmosphere`, or `was influenced by` without the corresponding allowed evidence.

Treat a lyricist-only connection as a language and songwriting path. Do not imply that it predicts arrangement or sound.

## Order the Final Listening Path

Start with the most explanatory comparison, usually the original or a strong production-team recurrence. Then move through arranger or producer, composer or songwriter, lyricist, session, and documentary branches as applicable. Favor an intelligible journey over chronology alone.
