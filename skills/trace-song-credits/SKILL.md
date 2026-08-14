---
name: trace-song-credits
description: Trace a user-provided song, recording, or Spotify link through verified version identity and credited writers, composers, arrangers, producers, and session musicians; recommend connected recordings with evidence-backed reasons; and resolve exact Spotify links or create an approved playlist. Use when a user asks who made a song, wants credit-based listening recommendations or a music-personnel lineage, or wants those recommendations on Spotify. Do not use for audio-derived similarity, chord, tempo, or timbre analysis unless a separate audio-analysis skill is explicitly requested.
---

# Trace Song Credits

## Purpose

Turn one recording into an evidence-backed listening path through its people. Keep verified credits, documented lineage, Spotify identity, and editorial judgment separate. Do not infer musical similarity from a title, genre label, or Spotify page.

Default to read-only research and link delivery. Create or modify a Spotify playlist only after the user explicitly approves the title, visibility, ordered track list, and destination.

## Load the Required References

Read these files before researching:

- `references/source-policy.md`: source tiers, conflict handling, and recording-version boundaries.
- `references/agent-contracts.md`: role boundaries and structured handoffs.
- `references/curation-policy.md`: recommendation branches, selection, and final presentation.

Also read `references/spotify-policy.md` before resolving Spotify tracks or performing any Spotify write.

## Orchestrate the Work

Act as the orchestrator and final editor. Use subagents when collaboration tools are available; otherwise execute the same roles sequentially. Do not ask multiple agents to freestyle complete recommendations from the original user prompt.

### 1. Resolve and lock the seed recording

Run one `credit_verifier` first.

- Identify the exact recording, not just the composition.
- Distinguish original, remake, cover, live, remix, remaster, re-recording, and compilation appearances.
- Confirm artist, title, release, date, duration when available, and version type.
- Collect track-scoped credits with a source for every claim.
- Preserve conflicts and missing roles instead of guessing.

Stop and ask the user only when multiple plausible recordings would materially change the investigation. Otherwise choose the strongest match and state the assumption.

Do not begin lineage discovery until the orchestrator accepts the locked seed manifest.

### 2. Explore two credit branches in parallel

Give both agents the same locked seed manifest.

- Run `writer_lineage_scout` for the same work, composer, lyricist, songwriter, and documented collaboration paths.
- Run `production_lineage_scout` for arranger, producer, recurring production team, and track-scoped session-musician paths.

Require every candidate to name its relationship path and cite the exact credit edges it uses. Forbid unsupported claims about similar harmony, groove, mood, vocal color, arrangement, or influence.

### 3. Curate before resolving Spotify

Merge the two candidate manifests as the main agent.

- Remove duplicate recordings and weakly supported candidates.
- Prefer direct and multi-person connections over a single incidental session overlap.
- Preserve distinct branches rather than flattening every candidate into one ranking.
- Select 8–12 recommendations by default; return fewer rather than pad the list.
- Keep the seed recording outside the recommendation count.

Do not let Spotify search availability decide the musical-personnel shortlist.

### 4. Resolve exact Spotify recordings

Run `spotify_resolver` on the curated shortlist in read-only mode.

- Match title, artists, album, version label, release context, duration, and track URL.
- Prefer the canonical studio-album release when the same recording appears on compilations.
- Mark `not_found`, `alternate_only`, or `unavailable_in_user_market` instead of silently substituting a cover, live take, remix, or re-recording.
- Do not play, like, save, follow, or alter playlists while resolving links.

### 5. Audit and present

Reuse `credit_verifier` as `evidence_auditor` when possible.

- Recheck each recommendation's credits against its selected Spotify recording.
- Remove unsupported explanations and expose unresolved conflicts.
- Verify that URLs point to tracks, not search pages or unrelated versions.

Present the seed credits first, then group recommendations into intelligible listening paths. For each recommendation include the Spotify link, people and roles connecting it to the seed, a concise reason, the relationship type, and nearby credit sources.

## Handle Playlist Writes Separately

Treat the delivered recommendation list as a draft manifest. Before writing to Spotify, show the playlist title, visibility, ordered tracks, and any unavailable items. Accept a clear user instruction such as "이대로 만들어줘" as approval for that exact manifest.

After approval:

- Keep the approved manifest immutable.
- Perform the write from the main agent using the user's existing signed-in browser session.
- Do not ask for or accept passwords, OTPs, recovery codes, cookies, or tokens in chat.
- Reopen the playlist and verify its URL, count, order, duplicates, and omissions.
- Inspect current state before retrying a partial write so retries do not create duplicates.
- Request renewed approval if a missing track requires a different recording or changed order.

## Enforce Boundaries

- Do not equate composer, lyricist, arranger, producer, and performer roles.
- Do not apply album-level personnel to every track without track-level evidence.
- Do not merge original-release and remake personnel.
- Do not claim influence from chronology or shared credits alone.
- Label lyricist-only paths as language or songwriting lineage, not sonic similarity.
- Do not generate an audio fingerprint or describe measured harmony, rhythm, melody, or timbre without actual audio and a separate requested analysis workflow.
- Keep scripts out of research and curation judgment. Add deterministic validation only if repeated failures later justify it.

## Final Response Shape

1. State the locked recording and its key credits.
2. Explain the most revealing connection found.
3. Group recommendations by same work, writer lineage, and production lineage as applicable.
4. Give each track an exact Spotify link and a one- or two-sentence evidence-backed reason.
5. Note unavailable tracks, credit conflicts, and the absence of audio-based inference.
6. Offer playlist creation only after the researched list is visible.
