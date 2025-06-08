import * as Scale from "@tonaljs/scale";
import * as Interval from "@tonaljs/interval";

const STANDARD_TUNING = [
  "E2", // 6th
  "A2", // 5th
  "D3", // 4th
  "G3", // 3rd
  "B3", // 2nd
  "E4", // 1st
];

export type FretboardPosition = ReturnType<
  typeof getFretboardPositionsOfScale
>[0];

export function getFretboardPositionsOfScale(scaleName: string) {
  const { tonic, notes, intervals } = Scale.get(scaleName);

  return STANDARD_TUNING.flatMap((openNote, standardTuningIndex) => {
    const string = 6 - standardTuningIndex; // 0 -> 6

    return notes.map((note, index) => {
      const fret = Interval.semitones(Interval.distance(openNote, note));
      return {
        tonic: tonic!,
        fret,
        note,
        interval: intervals[index],
        openNote,
        string,
      };
    });
  });
}
