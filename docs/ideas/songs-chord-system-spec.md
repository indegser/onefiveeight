# Songs chord-system specification sample

Use the current Songs detail page to establish the repository's canonical
chord-chart rendering rules.

## Required outcome

- Preserve the current alphaTab-based Songs score renderer and its notation
  surface. Do not replace it with an HTML, canvas, or custom grid renderer.
- Songs charts display chord symbols only.
- Do not render melody notes, accompaniment notes, rests, tablature, or
  instrument/track labels.
- Every system uses the full available content width.
- Every system contains exactly four measures at every supported viewport.
- Pad the final system with empty measures when a song does not end on a
  four-measure boundary.
- Do not place track names, instrument names, section labels, or other text to
  the left of a system.
- Section labels may appear above the first measure without changing the
  system's left edge or usable width.

## Ownership boundary

- The Design Agent must not define, redesign, critique, or refine the rendered
  score inside Songs.
- Songs score behavior is governed directly by this user-approved technical
  specification and deterministic/browser verification.
- Design review may inspect the surrounding page shell only. It must treat the
  alphaTab score surface as out of scope.

## Verification

- Verify a representative imported score and a generated chart.
- Capture desktop and mobile browser evidence.
- Confirm every visible system has four equal-width measures.
- Confirm no notation glyphs or left-side labels remain.
- Confirm the final system is padded to four measures.
