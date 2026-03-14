# Audio Analysis Example

Task pattern:

- Input: `mp3`, `wav`, or `m4a`
- Preferred path: audio service or Python adapter returns tempo, bar grid, and chord candidates
- Output: draft lead sheet with explicit confidence and uncertainty

Constraints:

- The LLM does not do stem separation, chroma extraction, beat tracking, or chord detection directly.
- Audio chord candidates must be re-ranked using musical context but kept probabilistic.
- If symbolic evidence also exists, use it to cross-check the audio draft.
