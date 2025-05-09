import { get } from "@tonaljs/chord";
import { names } from "@tonaljs/chord-type";

// 1. 가능한 모든 코드 타입 가져오기
const chordTypes = names();

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
