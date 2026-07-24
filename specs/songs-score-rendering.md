# Songs Score Rendering Specification

This specification is the source of truth for the score surface rendered inside
`/songs` pages.

## Rendering Engine

- Keep the current alphaTab-based renderer.
- Do not replace the score with a custom HTML, CSS, canvas, or SVG grid.
- alphaTab may be configured or supplied with normalized AlphaTex to satisfy the
  structural rules below.

## Structural Rules

- A system always occupies the full width available to the score container.
- Every system contains exactly four measures at every viewport width, including
  mobile.
- If the song ends with fewer than four measures in its final system, append
  empty measures until the system contains four.
- Do not place track names, instrument names, section labels, or any other text
  to the left of a system. Left-side text must never indent or shift the system.
- Keep chord symbols close to the top staff line. Do not add effect-band padding
  that creates a visibly detached gap between a chord and its measure.

## Score Content

- Render chord symbols only.
- Do not render melody notes, accompaniment notes, tablature, visible rests,
  tempo markings, or bar numbers.
- Imported score files do not override chord-only rendering. Normalize the Song
  domain data to AlphaTex and render that AlphaTex through alphaTab.
- Engine attribution rendered outside the musical systems may remain.

## Role Boundary

- This score surface is not a Design Agent or Design Critic responsibility.
- The Design Agent may address only the surrounding Songs page shell and must
  record the score surface as out of scope.
- The Design Critic must not apply aesthetic scoring or design-rule-engine
  judgment to the score surface.
- The Builder implements this specification without redefining it.
- The Verifier owns technical verification of the score surface.

## Verification

Verify at representative desktop and mobile widths that:

1. alphaTab is the active score engine.
2. every visible system contains exactly four measures.
3. the final system is padded to four measures when necessary.
4. systems fill the score container without avoidable horizontal overflow.
5. no left-side label shifts a system.
6. only chord symbols appear as musical content; notes, tablature, visible
   rests, tempo markings, and bar numbers are absent.
7. both imported-score and generated-song routes obey the same rules.
