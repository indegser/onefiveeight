import type { Chord as ChordType } from "@tonaljs/chord";
import type { Scale as ScaleType } from "@tonaljs/scale";
import * as Scale from "@tonaljs/scale";
import * as Interval from "@tonaljs/interval";
import { STANDARD_TUNING } from "./tuning";

export type FretboardPosition = ReturnType<
  typeof getFretboardPositionsOfScale
>[0];

export function getFretboardPositionsOfScale(scaleName: string) {
  const { tonic, notes, intervals } = Scale.get(scaleName);

  return STANDARD_TUNING.flatMap((openNote, standardTuningIndex) => {
    const string = 6 - standardTuningIndex; // 0 -> 6

    return notes.flatMap((note, index) => {
      const frets = [];
      let fret = Interval.semitones(Interval.distance(openNote, note));

      while (fret <= 22) {
        frets.push(fret);
        fret += 12;
      }

      return frets.map((fret) => ({
        tonic: tonic!,
        fret,
        note,
        interval: intervals[index],
        openNote,
        string,
      }));
    });
  });
}

export function getFretboardPositions(chordOrScale: ChordType | ScaleType) {
  const { tonic, notes, intervals } = chordOrScale;

  return STANDARD_TUNING.flatMap((openNote, standardTuningIndex) => {
    const string = 6 - standardTuningIndex; // 0 -> 6

    return notes.flatMap((note, index) => {
      const frets = [];
      let fret = Interval.semitones(Interval.distance(openNote, note));

      while (fret <= 22) {
        frets.push(fret);
        fret += 12;
      }

      return frets.map((fret) => ({
        tonic: tonic!,
        fret,
        note,
        interval: intervals[index],
        openNote,
        string,
      }));
    });
  });
}
