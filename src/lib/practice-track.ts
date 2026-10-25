export type PracticeTrack = {
  id: string;
  title: string;
  revision: string;
  key: string;
  bpm: number;
  beatUnit: 4;
  meter: string;
  beatsPerMeasure: number;
  measureCount: number;
  audio: string;
  /** The published loop asset is cropped to these measured musical boundaries. */
  loopStart: number;
  loopEnd: number;
  chords: { measure: number; chord: string; beat: number; duration: number }[];
  scales: { label: string; beat: number; duration: number }[];
};

export const PRACTICE_TRACKS: PracticeTrack[] = [
  {
    id: "f-major-related-ii-ballad",
    title: "F Major Ballad",
    revision: "r001",
    key: "F major",
    bpm: 68,
    beatUnit: 4,
    meter: "4/4",
    beatsPerMeasure: 4,
    measureCount: 8,
    audio: "/audio/f-major-ballad-68bpm.wav",
    loopStart: 0,
    loopEnd: 1355294 / 48000,
    chords: [
      { measure: 1, chord: "Fmaj7", beat: 0, duration: 4 },
      { measure: 2, chord: "Dm7", beat: 4, duration: 4 },
      { measure: 3, chord: "Am7", beat: 8, duration: 4 },
      { measure: 4, chord: "G7", beat: 12, duration: 4 },
      { measure: 5, chord: "Cmaj7", beat: 16, duration: 4 },
      { measure: 6, chord: "Em7♭5", beat: 20, duration: 2 },
      { measure: 6, chord: "A7(♭9)", beat: 22, duration: 2 },
      { measure: 7, chord: "Dm7", beat: 24, duration: 4 },
      { measure: 8, chord: "Gm7", beat: 28, duration: 2 },
      { measure: 8, chord: "C7", beat: 30, duration: 2 },
    ],
    scales: [
      { label: "F major", beat: 0, duration: 8 },
      { label: "C major", beat: 8, duration: 12 },
      { label: "D harmonic minor", beat: 20, duration: 4 },
      { label: "F major", beat: 24, duration: 8 },
    ],
  },
  {
    id: "jeju-blue-night",
    title: "제주도의 푸른밤 — 핵심 8마디",
    revision: "r001",
    key: "F major",
    bpm: 110,
    beatUnit: 4,
    meter: "4/4",
    beatsPerMeasure: 4,
    measureCount: 8,
    audio: "/audio/jeju-blue-night-110bpm-r001-loop.wav",
    loopStart: 0,
    loopEnd: 837818 / 48000,
    chords: [
      { measure: 1, chord: "B♭maj7", beat: 0, duration: 4 },
      { measure: 2, chord: "Am7", beat: 4, duration: 4 },
      { measure: 3, chord: "B♭", beat: 8, duration: 4 },
      { measure: 4, chord: "Fmaj7", beat: 12, duration: 4 },
      { measure: 5, chord: "Dm7", beat: 16, duration: 4 },
      { measure: 6, chord: "G7", beat: 20, duration: 4 },
      { measure: 7, chord: "Csus4", beat: 24, duration: 4 },
      { measure: 8, chord: "C7", beat: 28, duration: 4 },
    ],
    scales: [
      { label: "F major", beat: 0, duration: 16 },
      { label: "C major", beat: 16, duration: 8 },
      { label: "F major", beat: 24, duration: 8 },
    ],
  },
];

export function practiceTrackById(id: string) {
  return PRACTICE_TRACKS.find((track) => track.id === id);
}

/** The media clock is authoritative; a loop never accumulates timer drift. */
export function practiceChordAtTime(track: PracticeTrack, seconds: number): number {
  if (!Number.isFinite(seconds) || seconds < track.loopStart) return 0;
  const duration = track.loopEnd - track.loopStart;
  const time = (seconds - track.loopStart) % duration;
  for (let index = track.chords.length - 1; index >= 0; index--) {
    if (time >= track.chords[index].beat * 60 / track.bpm) return index;
  }
  return 0;
}
