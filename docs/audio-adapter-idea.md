# Audio Adapter For Music Analysis

Implement a repository-local audio harmony adapter for `packages/music-analysis`.

Requirements:
- Accept an `mp3` file path as `audio-file` input.
- Use a non-LLM extraction layer to estimate beat-aligned chord candidates.
- Convert the audio draft into the existing normalized lead-sheet schema.
- Preserve uncertainty explicitly when beat tracking, meter, or chords are weak.
- Keep the implementation reusable under `packages/music-analysis`.
