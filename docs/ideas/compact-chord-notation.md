# Compact chord notation

## Goal

Render extended chord qualities and alterations more compactly in the song score
viewer so adjacent chord symbols do not overlap on mobile, especially in
`기억의 습작`.

## Requirements

- Keep chord roots and slash-bass notes at the current primary reading size.
- Use established Jazz chord-symbol shorthand for chord quality on the
  baseline, including `maj7 → △7`, `m7 → −7`, `dim → °`,
  `half-diminished → ø`, and `aug → +`.
- Render alterations and modifiers such as `b5`, `#5`, `b9`, `#9`, `sus4`,
  and `add9` in a smaller raised position.
- Keep unaltered extension numbers such as `7`, `9`, and `13` with the
  baseline chord identity.
- Use typographic accidental glyphs (`♭`, `♯`) in the rendered score when
  practical, without changing the stored chord strings.
- Preserve alphaTex generation and source song data.
- Ground the notation mapping in SMuFL plus official scoring-application Jazz
  chord-symbol guidance rather than inventing an app-specific notation system.
- Verify before and after at a mobile viewport, including representative dense
  rows in `기억의 습작`.
