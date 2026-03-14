# Lead Sheets

This directory is the first storage layer for approved lead-sheet-team output.

## Rule

- One song equals one Markdown file.
- Lead-sheet-team publishes only approved chart data into this directory.
- The Markdown contract should stay stable enough to map cleanly into a future Supabase schema.

## Naming

- Use kebab-case file names.
- Prefer the song title as the slug.
- Example: `i-dont-want-to-miss-a-thing.md`

## Structure

Each file should contain:

1. Frontmatter for stable metadata
2. A structured chart body in Markdown
3. Explicit uncertainty markers only if the chart is not yet approved for final publish

## Related

- [`docs/lead-sheet-storage.md`](/Users/indegser/Github/onefiveeight/docs/lead-sheet-storage.md)
- [`lead-sheets/_template.md`](/Users/indegser/Github/onefiveeight/lead-sheets/_template.md)
