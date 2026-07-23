# In-browser guitar score renderer

Render guitar music directly inside the Songs website so a user does not need
Guitar Pro installed.

## Scope

- Present the selected song as a readable guitar score in the browser.
- Support chord symbols and six-line guitar tablature in a Guitar Pro-like
  score layout.
- Include a compact playback cursor and transport controls for the rendered
  sample, without requiring proprietary Guitar Pro files or software.
- Preserve the existing song library and detail-page workflow.
- Fit representative score systems within the available pane width and avoid
  redundant section labels.
- Cover selected, empty, and unavailable-score states.
- Verify the existing page before edits and the completed page after edits in
  a browser at desktop and narrow viewport sizes.

## Non-goals

- Importing or exporting proprietary `.gp`, `.gpx`, or `.gp5` files.
- Full notation editing, audio transcription, or production-quality synthesis
  in this iteration.
