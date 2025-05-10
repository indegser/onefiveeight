import * as Note from "@tonaljs/note";
import * as Interval from "@tonaljs/interval";
import { Chord } from "@tonaljs/chord";

/** Standard tuning (low▶︎high) expressed as scientific‑pitch strings */
export const STANDARD_TUNING = [
  "E2", // 6th
  "A2", // 5th
  "D3", // 4th
  "G3", // 3rd
  "B3", // 2nd
  "E4", // 1st
] as const;

/** Convert note string (e.g. "E2") → MIDI number. Returns –1 if invalid. */
const midi = (n: string): number => Note.midi(n) ?? -1;

/* ------------------------------------------------------------------
 *  Types
 * ------------------------------------------------------------------*/
export interface FretboardPosition {
  string: 1 | 2 | 3 | 4 | 5 | 6; // 1 = high‑E
  fret: number; // ≥0
  interval: string; // "1P", "3M" …
  note: string; // pitch‑class
  tonic: string;
}

export function getFretboardPositions(
  chord: Chord,
  maxFret = 12,
): FretboardPosition[] {
  const { tonic = "C", intervals = [] } = chord;
  const rootSemitone = (midi(`${tonic}4`) + 120) % 12; // pc → 0‑11

  /** Pre‑compute desired offsets in semitones */
  const wanted = intervals.map((iv) => {
    const semis = Interval.semitones(iv);
    if (semis === null) throw new Error(`Unknown interval: ${iv}`);
    return { iv, semis: ((semis % 12) + 12) % 12 };
  });

  const positions: FretboardPosition[] = [];

  STANDARD_TUNING.forEach((open, idx) => {
    const openMidi = midi(open);
    const stringNo = (6 - idx) as FretboardPosition["string"]; // 6▶︎1 → 1▶︎6 UI order

    wanted.forEach(({ iv, semis }, index) => {
      for (let fret = 0; fret <= maxFret; fret++) {
        const curMidi = openMidi + fret;
        if ((curMidi - rootSemitone + 120) % 12 === semis) {
          positions.push({
            string: stringNo,
            fret,
            interval: iv,
            note: chord.notes[index],
            tonic: chord.tonic!,
          });
        }
      }
    });
  });

  return positions;
}
