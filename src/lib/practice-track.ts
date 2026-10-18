export const PRACTICE_BPM = 68;
export const PRACTICE_BEATS = 32;
export const PRACTICE_DURATION = (PRACTICE_BEATS * 60) / PRACTICE_BPM;
export const PRACTICE_AUDIO = "/audio/f-major-ballad-68bpm.wav";

export const PRACTICE_CHORDS = [
  { measure: 1, chord: "Fmaj7", beat: 0 },
  { measure: 2, chord: "Dm7", beat: 4 },
  { measure: 3, chord: "Am7", beat: 8 },
  { measure: 4, chord: "G7", beat: 12 },
  { measure: 5, chord: "Cmaj7", beat: 16 },
  { measure: 6, chord: "Em7♭5", beat: 20 },
  { measure: 6, chord: "A7(♭9)", beat: 22 },
  { measure: 7, chord: "Dm7", beat: 24 },
  { measure: 8, chord: "Gm7", beat: 28 },
  { measure: 8, chord: "C7", beat: 30 },
] as const;

export const PRACTICE_ROWS = [
  { measures: [1, 2], scales: ["F major"] },
  { measures: [3, 4], scales: ["C major"] },
  { measures: [5, 6], scales: ["C major", "D harmonic minor"] },
  { measures: [7, 8], scales: ["F major"] },
] as const;

/** The media clock is authoritative; a loop never accumulates timer drift. */
export function practiceChordAtTime(seconds: number): number {
  if (!Number.isFinite(seconds) || seconds < 0) return 0;
  const time = seconds % PRACTICE_DURATION;
  for (let index = PRACTICE_CHORDS.length - 1; index >= 0; index--) {
    if (time >= (PRACTICE_CHORDS[index].beat * 60) / PRACTICE_BPM) {
      return index;
    }
  }
  return 0;
}
