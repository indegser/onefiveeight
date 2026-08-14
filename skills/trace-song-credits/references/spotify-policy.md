# Spotify Policy

## Separate Discovery, Resolution, and Writing

Keep three operations distinct:

1. Curate candidates without considering Spotify availability.
2. Resolve each chosen candidate to an exact Spotify recording in read-only mode.
3. Write an approved immutable manifest only after explicit user authorization.

Do not change the recommendation merely because the first Spotify search result is convenient.

## Resolve an Exact Track

Verify as many of these as the interface exposes:

- title and parenthetical version label,
- primary and featured artists,
- album or single,
- release context,
- duration,
- album version, single version, radio edit, studio, live, remix, remaster, or re-recording status,
- stable track URL and track ID,
- availability in the user's market.

Prefer a canonical studio-album release when the same recording appears on a compilation. Treat uncertain matches as separate versions. Use ISRC as strong corroboration when available, not as a mandatory field.

If the locked seed is an album version but Spotify labels the candidate `Single Version`, `Radio Edit`, or another edition, do not mark it `exact` merely because the title, artist, and duration are close. Verify that the requested edit or master matches; otherwise return `alternate_only` or `ambiguous` and disclose the difference.

Return `alternate_only` when only a live, cover, remix, or re-recording is found. Never substitute it silently. Return `not_found` when no defensible match exists.

## Keep Resolution Read-Only

While finding links, do not:

- press play,
- like or save a track,
- follow an artist,
- create or edit a playlist,
- change account settings,
- open authentication data or browser storage.

Use an existing signed-in browser session when available. If signed out, ask the user to sign in directly. Never request or accept a password, OTP, recovery code, cookie, session token, or OAuth token in chat.

## Approve a Playlist Manifest

Before writing, show:

- playlist title,
- description when used,
- public or private visibility,
- ordered track list,
- unavailable or alternate-only items,
- destination playlist when editing an existing list.

Treat a clear user instruction to create that displayed manifest as approval. If the ordered list or recording versions change afterward, present a new manifest and obtain renewed approval.

## Write Without Re-Curating

The writer may add only the approved track IDs in the approved order. It may not choose replacement recordings, insert new recommendations, or alter the editorial order.

On partial failure:

- reopen the playlist,
- inspect which exact track IDs are already present,
- add only confirmed omissions,
- avoid deleting unrelated existing tracks,
- stop and report unexpected additions or an ambiguous state.

## Verify the Result

After writing, confirm:

- playlist URL,
- title and visibility,
- expected track count,
- order,
- duplicate track IDs,
- missing or unexpected recordings.

Report any unresolved mismatch rather than claiming completion.
