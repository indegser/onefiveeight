// 1. 가능한 키 (C ~ B)
export const NOTES_SHARP = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// 2. 세미톤 변환 맵
const FORMULA_SEMITONES: Record<string, number> = {
  "1": 0,
  b2: 1,
  "2": 2,
  "#2": 3,
  b3: 3,
  "3": 4,
  "4": 5,
  "#4": 6,
  b5: 6,
  "5": 7,
  "#5": 8,
  "6": 9,
  b7: 10,
  "7": 11,
  b9: 13,
  "9": 14,
  "#9": 15,
  "11": 17,
  "13": 21,
};

export const CHORD_TYPES = [
  {
    id: "MAJOR_TRIAD",
    label: "Major Triad",
    formula: ["1", "3", "5"],
  },
  {
    id: "MINOR_TRIAD",
    label: "Minor Triad",
    formula: ["1", "b3", "5"],
  },
  {
    id: "DOMINANT_7",
    label: "Dominant 7",
    formula: ["1", "3", "5", "b7"],
  },
  {
    id: "MAJOR_7",
    label: "Major 7",
    formula: ["1", "3", "5", "7"],
  },
  {
    id: "MINOR_7",
    label: "Minor 7",
    formula: ["1", "b3", "5", "b7"],
  },
  {
    id: "MINOR_MAJ7",
    label: "Minor Major 7",
    formula: ["1", "b3", "5", "7"],
  },
  {
    id: "AUGMENTED",
    label: "Augmented",
    formula: ["1", "3", "#5"],
  },
  {
    id: "DIMINISHED",
    label: "Diminished",
    formula: ["1", "b3", "b5"],
  },
  {
    id: "SEVEN_SHARP_FIVE",
    label: "7#5",
    formula: ["1", "3", "#5", "b7"],
  },
  {
    id: "SEVEN_FLAT_FIVE",
    label: "7b5",
    formula: ["1", "3", "b5", "b7"],
  },
  {
    id: "SEVEN_FLAT_NINE",
    label: "7b9",
    formula: ["1", "3", "5", "b7", "b9"],
  },
  {
    id: "SEVEN_SHARP_NINE",
    label: "7#9",
    formula: ["1", "3", "5", "b7", "#9"],
  },
  {
    id: "ADD9",
    label: "Add9",
    formula: ["1", "3", "5", "9"],
  },
  {
    id: "NINE",
    label: "9",
    formula: ["1", "3", "5", "b7", "9"],
  },
  {
    id: "ELEVEN",
    label: "11",
    formula: ["1", "3", "5", "b7", "9", "11"],
  },
  {
    id: "THIRTEEN",
    label: "13",
    formula: ["1", "3", "5", "b7", "9", "13"],
  },
  {
    id: "SIX",
    label: "6",
    formula: ["1", "3", "5", "6"],
  },
  {
    id: "MAJ6_9",
    label: "Maj6/9",
    formula: ["1", "3", "5", "6", "9"],
  },
  {
    id: "MAJ9",
    label: "Maj9",
    formula: ["1", "3", "5", "7", "9"],
  },
  {
    id: "MAJ11",
    label: "Maj11",
    formula: ["1", "3", "5", "7", "9", "11"],
  },
  {
    id: "SUS2",
    label: "Sus2",
    formula: ["1", "2", "5"],
  },
  {
    id: "SUS4",
    label: "Sus4",
    formula: ["1", "4", "5"],
  },
] as const;

export type ChordType = (typeof CHORD_TYPES)[number]["id"];

export const CHORD_FORMULAS: Record<ChordType, string[]> = {
  MAJOR_TRIAD: ["1", "3", "5"],
  MINOR_TRIAD: ["1", "b3", "5"],
  DOMINANT_7: ["1", "3", "5", "b7"],
  MAJOR_7: ["1", "3", "5", "7"],
  MINOR_7: ["1", "b3", "5", "b7"],
  MINOR_MAJ7: ["1", "b3", "5", "7"],
  AUGMENTED: ["1", "3", "#5"],
  DIMINISHED: ["1", "b3", "b5"],
  SEVEN_SHARP_FIVE: ["1", "3", "#5", "b7"],
  SEVEN_FLAT_FIVE: ["1", "3", "b5", "b7"],
  SEVEN_FLAT_NINE: ["1", "3", "5", "b7", "b9"],
  SEVEN_SHARP_NINE: ["1", "3", "5", "b7", "#9"],
  ADD9: ["1", "3", "5", "9"],
  NINE: ["1", "3", "5", "b7", "9"],
  ELEVEN: ["1", "3", "5", "b7", "9", "11"],
  THIRTEEN: ["1", "3", "5", "b7", "9", "13"],
  SIX: ["1", "3", "5", "6"],
  MAJ6_9: ["1", "3", "5", "6", "9"],
  MAJ9: ["1", "3", "5", "7", "9"],
  MAJ11: ["1", "3", "5", "7", "9", "11"],
  SUS2: ["1", "2", "5"],
  SUS4: ["1", "4", "5"],
};

// 5. 주요 함수: 루트 노트와 코드 타입을 받아 구성음을 반환
export function getChordNotes(root: string, chordType: ChordType): string[] {
  const formula = CHORD_FORMULAS[chordType];
  if (!formula) throw new Error(`Unknown chord type: ${chordType}`);

  const rootIndex = NOTES_SHARP.indexOf(root);
  if (rootIndex === -1) throw new Error(`Invalid root note: ${root}`);

  return formula.map((interval) => {
    const semitone = FORMULA_SEMITONES[interval];
    if (semitone === undefined)
      throw new Error(`Invalid interval: ${interval}`);
    return NOTES_SHARP[(rootIndex + semitone) % 12];
  });
}

export function getAllChords(root: string): ({ notes: string[] } & typeof CHORD_TYPES[number])[] {
  const rootIndex = NOTES_SHARP.indexOf(root);
  if (rootIndex === -1) throw new Error(`Invalid root note: ${root}`);

  return CHORD_TYPES.map((chord) => {
    const formula = chord.formula;
    const semitones = formula.map((interval) => FORMULA_SEMITONES[interval]);
    const notes = semitones.map(
      (semitone) => NOTES_SHARP[(rootIndex + semitone) % 12]
    );
    return { ...chord, notes };
  });
}