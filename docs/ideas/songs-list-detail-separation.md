# Songs List And Detail Separation

## Request

Update the songs page so the song list and song detail are separated like a blog index and post detail flow.

Remove unnecessary label-like text from the song detail page. In this context, unnecessary labels are small descriptive headings or badges that explain obvious content instead of helping the user read the song.

## Scope

- Keep the songs experience in the existing Next.js App Router structure.
- Make `/songs` primarily a list/index page.
- Add a per-song detail route for the selected song.
- Keep song detail focused on the title, artist, useful metadata, notes, and rendered lead sheet.
- Remove redundant local labels when the surrounding heading or content already establishes meaning.
- Preserve existing song data and renderer behavior unless a change is needed for the separated route.

## Verification

- Browser-check the current songs UI before implementation.
- Browser-check `/songs` and a representative song detail route after implementation.
- Verify representative lead-sheet rows fit the available pane width and do not contain redundant labels.
- Run repository validation and applicable app checks.
