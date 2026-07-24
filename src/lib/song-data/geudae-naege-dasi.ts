import type { Song, SongMeasure, SongSection } from "@/lib/songs";

type BarSpec = string | readonly string[] | null;

function buildMeasure(
  sectionId: string,
  measureIndex: number,
  bar: BarSpec,
  isSectionEnd: boolean,
  isSongEnd: boolean,
): SongMeasure {
  const chords = bar === null ? [] : typeof bar === "string" ? [bar] : bar;

  return {
    id: `${sectionId}-m${measureIndex + 1}`,
    ...(chords.length === 1
      ? { chord: chords[0] }
      : chords.length > 1
        ? {
            chords: chords.map((chord, chordIndex) => ({
              id: `${sectionId}-m${measureIndex + 1}-c${chordIndex + 1}`,
              chord,
              offset: chordIndex / chords.length,
            })),
          }
        : {}),
    ...(isSectionEnd
      ? { barline: isSongEnd ? ("final" as const) : ("double" as const) }
      : {}),
  };
}

function buildSection(
  id: string,
  title: string,
  bars: readonly BarSpec[],
  isSongEnd = false,
): SongSection {
  const systems = [];

  for (let start = 0; start < bars.length; start += 4) {
    const systemBars = bars.slice(start, start + 4);
    systems.push({
      id: `${id}-system-${Math.floor(start / 4) + 1}`,
      ...(start === 0 ? { label: title } : {}),
      measures: systemBars.map((bar, offset) => {
        const measureIndex = start + offset;
        return buildMeasure(
          id,
          measureIndex,
          bar,
          measureIndex === bars.length - 1,
          isSongEnd && measureIndex === bars.length - 1,
        );
      }),
    });
  }

  return {
    id,
    title,
    systems,
  };
}

const A1: readonly BarSpec[] = [
  "F",
  ["Em7b5", "A7"],
  ["Dm", "F/C"],
  ["G/B", "Bb"],
  "Bbmaj7",
  ["Am7", "Dm"],
  "Gm7",
  ["A7sus4", "A7"],
];

const A2: readonly BarSpec[] = [
  "F",
  ["Em7b5", "A7"],
  ["Dm", "F/C"],
  ["G/B", "Bb"],
  "Bbm",
  ["Am7", "D7"],
  ["Gm7", "C7"],
  "F",
];

const B: readonly BarSpec[] = [
  "Bbm",
  "Ab",
  ["Gm", "C7"],
  "F",
  "Bb",
  ["Am7", "D7"],
  "Gm",
  "A7",
  "Bb",
  "Bbm",
  ["Am7", "Dm7"],
  "F",
  "G",
  "E7",
  ["Am", "D7"],
  ["Gm", "Csus4", "C7"],
];

export const geudaeNaegeDasi: Song = {
  id: "geudae-naege-dasi",
  title: "그대 내게 다시",
  artist: "변진섭",
  source: "Validated automatic audio-to-score draft",
  scorePath: "/scores/geudae-naege-dasi.musicxml",
  scoreTrackIndexes: [0, 1, 2],
  midiPath: "/scores/geudae-naege-dasi.mid",
  keyCenter: "F major",
  feel: "Ballad",
  meter: "4/4",
  summary:
    "Form-first automatic draft with a principal-melody line, practical harmony, and generated intermediate piano accompaniment.",
  analysisDigest:
    "P → X → A1 → A2 → B → A1′ → A2′ → B′ → A3 → Coda · 86 linear measures",
  chartNotes: [
    "The form map is approved and anchored to the first A-section entry at 30.31 seconds.",
    "The principal melody is an eighth-note simplified automatic draft with 16 estimator disagreements kept explicit.",
    "Harmony is a practical form-aligned chart using recurrence, prior reference material, and the user's A bars 5–8 correction.",
    "Lyrics and instrumental lead phrases during vocal rests are not included.",
    "The piano layer is generated for intermediate practice and is not a note-for-note recovery of the recording.",
  ],
  sections: [
    buildSection("pickup", "P", [null]),
    buildSection("x", "X", [
      "Fmaj7",
      "Bb",
      "F",
      "Dm7b5",
      "Gm7",
      "Gm7",
      "Csus4",
      "C",
      "Gm7",
      "C7",
    ]),
    buildSection("a1", "A1", A1),
    buildSection("a2", "A2", A2),
    buildSection("b", "B", B),
    buildSection("a1-prime", "A1′", A1),
    buildSection("a2-prime", "A2′", A2),
    buildSection("b-prime", "B′", B),
    buildSection("a3", "A3", [
      "F",
      ["Em7b5", "A7"],
      ["Dm", "F/C"],
      ["G/B", "Bb"],
      "Bbm",
      ["Am7", "D7"],
      ["Gm7", "C7"],
      ["Bb", "Bbm"],
      "F",
    ]),
    buildSection("coda", "Coda", ["F", "F"], true),
  ],
};
