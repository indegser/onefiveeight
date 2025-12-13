import { start } from "repl";
import { FretboardPosition } from "./fingering";
import * as Scale from "@tonaljs/scale";

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

const fingerings = [
  { form: "3", interval: 4, range: [0, 3] },
  { form: "5", interval: 7, range: [-1, 3] },
  { form: "7", interval: 11, range: [-1, 3] },
  { form: "2", interval: 2, range: [-1, 3] },
  { form: "6", interval: 9, range: [-1, 3] },
];

export function getForms(fretboardPositions: FretboardPosition[]) {
  const { fret } = fretboardPositions.find(
    (fp) => fp.interval === "1P" && fp.string === 6,
  )!;

  return fingerings.map((form) => {
    let startFret = (fret + form.interval + form.range[0]) % 12;

    if (startFret < 0) {
      startFret += 12;
    }

    const endFret = startFret + (form.range[1] - form.range[0]);

    return {
      form: form.form,
      interval: form.interval,
      startFret,
      endFret,
    };
  });
}
