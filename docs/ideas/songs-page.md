# Songs Page

## Problem
- I need a `songs` page that shows a list of songs I have copied into the system.
- When I click one song from the list, I should be able to view a digitized score for that song.

## Users
- Solo user managing a personal library of copied songs

## Core Workflows
- Open the `songs` page and scan the available song list
- Click a song and view its digitized score
- Return to the list and open another song

## Must-Have Features
- A new `/songs` route
- A list UI showing available songs
- Selection state for the currently opened song
- A score viewer area that displays the selected song's digitized notation
- Empty state when no song is selected

## Constraints
- Fit into the current Next.js app structure
- Use the existing UI style and component patterns where reasonable
- Optimize for clear reading rather than decorative presentation

## Risks
- The exact structure of the digitized score data is not yet defined
- The list could outgrow a naive single-column layout later
