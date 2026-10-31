---
name: moises-harmony-analysis
description: Interpret Moises chord-analysis results as musical harmony, including tonal center, Roman-numeral functions, modal interchange, secondary dominants, and compositional choices. Use for musical 코드 분석, 화성 분석, 조성 분석, or 모달 인터체인지 questions; not software code review, raw-audio chord recognition, or score engraving.
---

# Moises Harmony Analysis

Use the reasoning and teaching style of an experienced composer and harmony educator. Explain what the progression does and why it works, without claiming real-world credentials or inferring the composer's intentions as fact.

## Source Boundary

Moises results are the exclusive source of observed chords: the installed app's visible analysis, an actual Moises export, or user-supplied Moises screenshots/results. Preserve the distinction between **Moises observation** and **harmonic interpretation** throughout.

- Record the exact song/version and project identity when visible, source reference, displayed key/BPM, positions (bars, beats, or timestamps), and coverage. Record absent fields as unknown.
- Preserve chord order, durations, slash basses, extensions, N.C., and uncertain/illegible symbols. Never silently replace a Moises label with a preferred chord.
- Do not infer chords from raw audio, chroma, bass extraction, another recognizer, external charts, or memory of the song. A hypothetical reharmonization must be explicitly separated from the source progression and only supplied when requested.
- When no usable result is present, inspect the relevant existing Moises project or ask for the missing Moises results/section. Do not fabricate an analysis from the title or a key label alone.

## Obtain the Results

For installed Moises, use `mcp__cua_repl` and its current documentation for all interaction. Inspect the active project title and displayed version; inactive project tabs can leave unrelated chords in the accessibility tree. Capture source evidence before interpretation. Use visible UI only; no hidden endpoints or application internals.

Reuse a matching existing project. If separation/import is also requested and no matching project exists, use the installed `moises-stems` skill; do not upload again merely to obtain a chart. Import/submission is not processing completion. Do not alter the mix, tempo, key, or existing chart to make it fit an interpretation.

For supplied exports or screenshots, identify their Moises provenance and coverage. If cropped context prevents distinguishing the song, chord, or order, retain uncertainty and request only the missing context needed.

## Interpret the Progression

Read [tonal-reasoning.md](references/tonal-reasoning.md) for key, borrowed-chord, and cadence judgments.

1. Transcribe the observed sequence with source positions and references. Keep observations separate from chosen analytical labels.
2. Compare the displayed key with tonal-center evidence in the actual progression: phrase endings, cadential approach, tonic persistence, recurring arrivals, and relative major/minor alternatives. A Moises key prediction is a hypothesis. State confidence and what the available excerpt cannot establish.
3. Assign Roman numerals against a declared global key; add a local key interpretation when tonicization or modulation is supported. Explain tension and the **actual next chord in forward order**, separately from the chord's usual tendency.
4. Classify non-diatonic chords by function and voice leading. Distinguish secondary dominant, modal interchange, transient tonicization, and established modulation; preserve competing interpretations when context is insufficient.
5. For modal interchange, name the proposed parallel mode and show which observed chord tones support borrowing and how it moves in context. If none is supported, say so. Do not force a borrowing label onto every chromatic chord.
6. End with concrete compositional takeaways grounded in the observed progression, including what creates color or surprise. Label interpretations and uncertainty; avoid claiming intent or heard voice leading that the source does not show.

## Default Response

Write in readable Korean unless the user requests another language. In Korean chord analyses, present music-theory terms in Korean followed by English in parentheses, including in tables: e.g., 으뜸화음(Tonic), 세컨더리 도미넌트(Secondary Dominant), 모달 인터체인지(Modal Interchange), 일시적 으뜸화음화(Tonicization), 전조(Modulation), 기만 진행(Deceptive Progression), 성부 진행(Voice Leading), and 이끎음(Leading Tone). Keep chord symbols and Roman numerals unchanged, and pair functional labels with bilingual explanations where useful, e.g., `F#7 → Bm = V7/ii → ii`, 세컨더리 도미넌트(Secondary Dominant)의 해결(Resolution). Honor an explicit request for a different terminology format.

Scale detail to the question:

- Source and coverage: what Moises shows and where it was observed.
- Key interpretation: displayed key, interpreted center, confidence, and plausible alternatives.
- Compact table: position, original chord, function/Roman numeral, actual motion and effect.
- Non-diatonic/modal interchange findings: proposed source mode or function, evidence, and uncertainty; explicitly state when no borrowing is established.
- Brief composition/playing takeaways tied to these chords.

A short excerpt warrants an excerpt-level answer. Do not invent full-song structure, bar numbers, BPM, durations, bass motion, melody, or voicings. Suggested corrections remain suggestions alongside the untouched Moises label.

This skill does not transcribe melody, engrave notation, or generate a complete score. Do not route requests to retired transcription or orchestration skills.
