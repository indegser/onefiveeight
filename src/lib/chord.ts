import { get } from "@tonaljs/chord";

// 1. 가능한 모든 코드 타입 가져오기
const chordTypes = [
  "major",
  "minor",
  "dominant seventh",
  "minor seventh",
  "major seventh",
  "suspended fourth",
  "suspended second",
  "sixth",
  "minor sixth",
  "diminished",
  "augmented",
  "dominant ninth",
  "major ninth",
  "minor ninth",
  // "dominant thirteenth",
  // "major thirteenth",
  // "suspended fourth seventh", // 7sus4
  // "dominant flat ninth", // 7♭9
  // "dominant sharp ninth", // 7♯9
  // "lydian dominant seventh", // 7♯11
  // "major sharp eleventh (lydian)",
  // "major seventh sharp eleventh",
  // "eleventh",
  // "half-diminished", // m7♭5
  // "diminished seventh", // dim7
  // "altered", // 7alt
  // "augmented seventh", // 7♯5
  // "major seventh flat sixth",
  // "sixth added ninth", // 6/9
  // "minor eleventh",
  // "minor thirteenth",
  // "minor/major seventh",
  // "minor/major ninth",
  // "minor augmented", // m+5
  // "suspended fourth flat ninth", // 7sus4♭9 — 가장 희소
  // "fifth", // (= power chord, 1-5)        ↑ 가장 많이 쓰이는 기본형
];

export const getAllChords = (rootNote: string) => {
  // 2. 루트를 기준으로 모든 코드 생성
  const rootChords = chordTypes.map((type) => `${rootNote}${type}`);

  // 3. 코드 이름과 구성음을 출력
  const rootChordDetails = rootChords.map((chordName) => {
    const chord = get(chordName);
    return chord;
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
