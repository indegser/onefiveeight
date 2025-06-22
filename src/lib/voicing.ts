import { STANDARD_TUNING } from "./tuning";
import * as Interval from "@tonaljs/interval";

const inversions = [
  // Inversion 1
  [
    { string: 1, fret: 3, interval: "5P" },
    { string: 2, fret: 1, interval: "1P" },
    { string: 3, fret: 3, interval: "7m" },
    { string: 4, fret: 2, interval: "3M" },
  ],
  [
    { string: 1, fret: 6, interval: "7m" },
    { string: 2, fret: 5, interval: "3M" },
    { string: 3, fret: 5, interval: "1P" },
    { string: 4, fret: 5, interval: "5P" },
  ],
  [
    { string: 1, fret: 8, interval: "1P" },
    { string: 2, fret: 8, interval: "5P" },
    { string: 3, fret: 9, interval: "3M" },
    { string: 4, fret: 8, interval: "7m" },
  ],
  [
    { string: 1, fret: 12, interval: "3M" },
    { string: 2, fret: 11, interval: "7m" },
    { string: 3, fret: 12, interval: "5P" },
    { string: 4, fret: 10, interval: "1P" },
  ],
  // Inversion 2
  [
    { string: 2, fret: 5, interval: "3M" },
    { string: 3, fret: 3, interval: "7m" },
    { string: 4, fret: 5, interval: "5P" },
    { string: 5, fret: 3, interval: "1P" },
  ],
  [
    { string: 2, fret: 8, interval: "5P" },
    { string: 3, fret: 5, interval: "1P" },
    { string: 4, fret: 8, interval: "7m" },
    { string: 5, fret: 7, interval: "3M" },
  ],
  [
    { string: 2, fret: 11, interval: "7m" },
    { string: 3, fret: 9, interval: "3M" },
    { string: 4, fret: 10, interval: "1P" },
    { string: 5, fret: 10, interval: "5P" },
  ],
  [
    { string: 2, fret: 13, interval: "1P" },
    { string: 3, fret: 12, interval: "5P" },
    { string: 4, fret: 14, interval: "3M" },
    { string: 5, fret: 13, interval: "7b" },
  ],
  // Inversion 3
  [
    { string: 2, fret: 1, interval: "1P" },
    { string: 3, fret: 3, interval: "7m" },
    { string: 4, fret: 2, interval: "3M" },
    { string: 6, fret: 3, interval: "5P" },
  ],
  [
    { string: 2, fret: 5, interval: "3M" },
    { string: 3, fret: 5, interval: "1P" },
    { string: 4, fret: 5, interval: "5P" },
    { string: 6, fret: 6, interval: "7m" },
  ],
  [
    { string: 2, fret: 8, interval: "5P" },
    { string: 3, fret: 9, interval: "3M" },
    { string: 4, fret: 8, interval: "7m" },
    { string: 6, fret: 8, interval: "1P" },
  ],
  [
    { string: 2, fret: 11, interval: "7m" },
    { string: 3, fret: 12, interval: "5P" },
    { string: 4, fret: 10, interval: "1P" },
    { string: 6, fret: 12, interval: "3M" },
  ],
];

export function getFretboardPositionsOfInversions(tonic: string) {
  const roots = STANDARD_TUNING.map((note, index) => {
    return {
      fret: Interval.semitones(Interval.distance(note, tonic)),
      string: 6 - index, // 0 -> 6
    };
  });

  return inversions.map((inversion) => {
    const previousRoot = inversion.find((pos) => pos.interval === "1P")!;
    const root = roots.find((root) => root.string === previousRoot.string)!;
    const fretDiff = (root.fret - previousRoot.fret + 12) % 12;

    const isBelow12thFret = inversion.some(
      (position) => position.fret + fretDiff < 13,
    );

    return inversion.map((position) => {
      return {
        tonic: tonic,
        fret: (position.fret + fretDiff) % (isBelow12thFret ? 24 : 12),
        interval: position.interval,
        string: position.string,
      };
    });
  });
}
