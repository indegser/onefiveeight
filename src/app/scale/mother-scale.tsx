import { getFretboardPositionsOfScale } from "@/lib/fingering";
import * as Scale from "@tonaljs/scale";
import { Fretboard } from "../fretboard/fretboard";
import { getCAGED } from "@/lib/caged";
import { ScaleInterval } from "./scale-interval";

interface Props {
  tonic: string;
  scaleName: string;
}

export function MotherScale({ tonic, scaleName }: Props) {
  const scale = Scale.get(scaleName);
  const fretboardPositions = getFretboardPositionsOfScale(scaleName);
  const caged = getCAGED(fretboardPositions);

  return (
    <div className="flex flex-col gap-8">
      <ScaleInterval tonic={tonic} scale={scale} useAbsolutePosition />
      <div className="hidden md:block">
        <Fretboard
          startFret={0}
          endFret={13}
          fretboardPositions={fretboardPositions}
        />
      </div>
      <div className="flex flex-col gap-4 md:hidden">
        {caged
          .sort((a, b) => a.startFret - b.startFret)
          .map((form) => (
            <Fretboard
              startFret={form.startFret}
              endFret={form.endFret}
              key={form.form}
              fretboardPositions={fretboardPositions}
            />
          ))}
      </div>
    </div>
  );
}
