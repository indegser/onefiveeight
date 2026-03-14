# UX Heuristics

Use this checklist for Design Agent self-review and Design Critic review.

## Workflow Clarity

- Is the user’s next step obvious without reading every line?
- Does each area have one primary action or a clear reason not to?
- Are secondary and destructive actions clearly subordinate?
- Does the screen reduce unnecessary decision points?

## State Visibility

- Are loading, empty, success, and error states defined where relevant?
- Is the current system state visible without requiring inference?
- Are long-running operations acknowledged with progress or pending feedback?
- Are unavailable actions explained instead of silently disabled when explanation matters?

## Scanability

- Can a user identify structure from headings, grouping, spacing, and alignment alone?
- Are proximity and similarity doing most of the grouping work before decorative separators?
- Are dense surfaces still chunked into digestible regions?
- Are labels, values, helper text, and metadata visually separable?
- Is redundant information removed when a nearby heading, label, or section title already provides the same context?
- Do tables and forms support fast repeated use rather than one-time reading?

## Interaction Safety

- Are destructive actions visually distinct and confirmed at the right moment?
- Is recovery guidance visible after an error or destructive path?
- Do forms prevent accidental submission, loss, or ambiguity?
- Are filters, sort, and bulk actions reversible or inspectable?

## Consistency

- Do similar objects behave similarly across screens?
- Are repeated components using the same hierarchy and interaction model?
- Are naming and labeling conventions stable?
- Is state treatment consistent across components and pages?

## Density Fit

- Is the information density appropriate for the screen type and user task?
- Is whitespace used to group and clarify, not to simulate polish?
- Does the grid or alignment logic remain legible across the whole screen?
- Is compactness justified when throughput matters?
- Is spaciousness justified when reading or comprehension matters?
- Does the layout fit the available pane width before resorting to hard minimum widths or horizontal overflow?
- Do representative repeated rows or systems render fully at the target breakpoint instead of clipping due to avoidable supporting chrome?

## Error Recovery

- Can the user identify what failed?
- Can the user understand what to do next?
- Can the user retry, back out, or continue safely?
- Are validation errors placed close to the cause and written in actionable language?
