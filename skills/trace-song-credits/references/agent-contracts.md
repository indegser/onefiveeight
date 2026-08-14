# Agent Contracts

## Operating Model

Keep the main agent as orchestrator and final editor. Use a pipeline with a locked handoff instead of a swarm in which every agent independently reinterprets the user's seed.

1. `credit_verifier`
2. `writer_lineage_scout` and `production_lineage_scout` in parallel
3. main-agent curation
4. `spotify_resolver`
5. `evidence_auditor`, preferably by reusing `credit_verifier`

If subagents are unavailable, execute these contracts sequentially and keep the same artifacts.

## Seed Manifest

Require `credit_verifier` to return:

```json
{
  "case_id": "artist-title-version",
  "recording": {
    "title": "",
    "artists": [],
    "release": "",
    "release_date": null,
    "duration_seconds": null,
    "version_type": "original|remake|cover|live|remix|remaster|rerecording|unknown",
    "edition_label": null,
    "spotify_url": null,
    "identity_status": "resolved|ambiguous"
  },
  "credit_edges": [
    {
      "edge_id": "credit-01",
      "person": "",
      "displayed_name": "",
      "role": "composer|lyricist|songwriter|arranger|producer|musician|engineer|other",
      "role_raw": "",
      "instrument": null,
      "scope": "track|release",
      "source_url": "",
      "source_tier": 1,
      "confidence": "high|medium|low",
      "status": "accepted|provisional|unresolved"
    }
  ],
  "conflicts": [],
  "missing_roles": [],
  "warnings": []
}
```

Forbid recommendation generation in this role.

## Candidate Manifest

Require each lineage scout to return only its assigned branch:

```json
{
  "case_id": "artist-title-version",
  "branch": "writer|production",
  "candidates": [
    {
      "title": "",
      "artists": [],
      "release": null,
      "primary_relationship": "same_work|composer|lyricist|songwriter|arranger|producer|production_team|session|documented_lineage",
      "relationship_path": ["seed recording -> person (role) -> candidate recording"],
      "based_on_edge_ids": ["credit-01"],
      "overlapping_people": [],
      "reason": "",
      "credit_sources": [],
      "evidence_status": "verified|provisional|conflicted",
      "warnings": []
    }
  ]
}
```

Require facts in `reason` to be supported by `credit_sources`. Do not allow sonic or emotional similarity language.

## Resolved Spotify Manifest

Require `spotify_resolver` to return:

```json
{
  "title": "",
  "artists": [],
  "album": null,
  "version_label": "album_version|single_version|radio_edit|studio|live|remix|remaster|rerecording|unknown",
  "duration_seconds": null,
  "spotify_url": null,
  "spotify_track_id": null,
  "market_status": "playable|unavailable_in_user_market|unknown",
  "match_status": "exact|alternate_only|not_found|ambiguous",
  "identity_confidence": "high|medium|low",
  "warnings": []
}
```

Forbid playlist changes and candidate substitution in this role.

## Audit Result

Require the auditor to return accepted candidates, rejected candidates with reasons, credit conflicts, Spotify identity conflicts, and unsupported prose to remove. Make the audit independent: provide the manifests and sources, not the intended final answer.

## Main-Agent Responsibilities

The main agent must:

- accept or reject the seed manifest,
- launch scouts only after identity is locked,
- merge and edit without inventing new credit facts,
- resolve duplicate recordings,
- decide the listening order,
- write the final user-facing explanation,
- own all approved external writes.

Subagents may propose candidates and evidence. They must not choose the final taste profile, mutate Spotify, or communicate credentials.
