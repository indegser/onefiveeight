# Repo-Local Skills

Repository skill directories are the source of truth. Installed copies under the Codex skill
directory are generated deployments and must not be edited directly.

## Inventory

These four skills exist in this repository:

| Skill | Purpose |
| --- | --- |
| `website-workflow` | Implement and verify rendered web surfaces using the local design rules. |
| `design-rule-engine` | Apply structured hard rules, UX heuristics, and aesthetic profiles. |
| `moises-harmony-analysis` | Interpret Moises chords: tonal center, function, modal interchange, and composition. |
| `trace-song-credits` | Verify recording credits and build evidence-backed music discovery paths. |

## Routing

Work directly on requested tasks. The legacy `scripts/ai-team` helpers and historical run records
remain available for explicit use, but Supervisor routing and run initialization are not required.

For website work, use `website-workflow` and the repository `design-rule-engine` before external
style references or implementation-specific framework guidance.

For musical `코드 분석`, use `moises-harmony-analysis`. Its chord source is the observed Moises
result; preserve symbols and provenance separately from tonal/function interpretation. The
previous automatic chord-recognition skill has been retired and must not be invoked.

Stem import/separation can use the separately installed `moises-stems` skill; it is not a
repository directory and is not counted in this inventory. Transcription and Supervisor skills
have been retired.

Use `trace-song-credits` for exact recording identity, writers, arrangers, producers, session
musicians, and personnel-based listening paths. Keep this separate from audio similarity and
require approval of the exact manifest before Spotify playlist writes.

Check or install an explicit skill by name:

```bash
npm run skill:check -- moises-harmony-analysis
npm run skill:install -- moises-harmony-analysis
```
