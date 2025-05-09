import { Chord, ChordType } from "tonal";

// 1. 가능한 모든 코드 타입 가져오기
const chordTypes = ChordType.names();

export const getAllChords = (rootNote: string) => {
  // 2. 루트를 기준으로 모든 코드 생성
  const rootChords = chordTypes.map((type) => `${rootNote}${type}`);

  // 3. 코드 이름과 구성음을 출력
  const rootChordDetails = rootChords.map((chordName) => {
    const chord = Chord.get(chordName);

    return {
      id: chordName,
      label: chord.type,
      notes: chord.notes,
      formula: chord.intervals,
    };
  });

  return rootChordDetails;
};

export const NOTES = [
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
