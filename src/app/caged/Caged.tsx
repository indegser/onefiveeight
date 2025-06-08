import * as Key from "@tonaljs/key";
import { getFretboardPositionsOfScale } from "@/lib/fingering";
import { Fretboard } from "../fretboard/fretboard";
import { getCAGED } from "@/lib/caged";

interface Props {
  tonic: string;
}

export function Caged({ tonic }: Props) {
  const majorKey = Key.majorKey(tonic);
  const fretboardPositions = getFretboardPositionsOfScale(
    majorKey.chordScales[0],
  );

  const caged = getCAGED(fretboardPositions);

  return (
    <div className="grid grid-cols-5 gap-4">
      {caged.map((form) => {
        return (
          <div key={form.form}>
            <h3 className="mb-2 text-base font-semibold">{form.form} Form</h3>
            <Fretboard
              startFret={form.startFret}
              endFret={form.endFret}
              fretboardPositions={fretboardPositions}
            />
          </div>
        );
      })}
    </div>
  );
}
