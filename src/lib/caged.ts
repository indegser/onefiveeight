import { FretboardPosition } from "./fingering";

const CAGED = [
  { note: "C", string: 5, range: [-3, 0] },
  { note: "A", string: 5, range: [0, 3] },
  { note: "G", string: 6, range: [-3, 0] },
  { note: "E", string: 6, range: [0, 3] },
  { note: "D", string: 4, range: [0, 3] },
];

export function getCAGED(fretboardPositions: FretboardPosition[]) {
  const rootPositions = fretboardPositions.filter((fp) => fp.interval === "1P");

  return CAGED.map((form) => {
    const { fret } = rootPositions.find(({ string }) => {
      return string === form.string;
    })!;

    let rootFret = fret;

    if (rootFret < 3) {
      if (form.note === "G" || form.note === "C") {
        rootFret += 12;
      }
    }

    return {
      form: form.note,
      startFret: form.range[0] + rootFret,
      endFret: form.range[1] + rootFret,
    };
  });
}
