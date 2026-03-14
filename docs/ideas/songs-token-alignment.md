# Songs Surface Token Alignment

## Problem
- The songs workspace already reflects the intended warm restrained editorial aesthetic, but many spacing, color, and typography values are still hard-coded per component.
- I need the songs surface to align with the new draft design-token baseline so future refinements can build on shared values instead of repeated literals.

## Users
- Solo user browsing copied songs and reading lead-sheet style charts

## Core Workflows
- Open the songs workspace and scan the library list
- Select a chart and read the score viewer
- Keep the existing reading flow while the styling layer becomes more token-driven

## Must-Have Features
- Replace repeated color and typography literals with the new draft token bindings where practical
- Preserve the current songs workspace layout and interaction behavior
- Keep the visual result consistent with the current warm restrained editorial utility direction

## Constraints
- Route the work through the existing Supervisor workflow
- Keep the changes additive and localized to the songs surface plus shared styling support if needed
- Do not expand scope into a full app-wide token migration

## Risks
- Over-normalizing too quickly could flatten useful local distinctions in the songs surface
- Token alignment might introduce subtle visual regressions if the current surface relies on tuned local values
