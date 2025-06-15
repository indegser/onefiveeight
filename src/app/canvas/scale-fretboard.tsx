import { getFretboardPositionsOfScale } from "@/lib/fingering";
import { Fretboard } from "../fretboard/fretboard";
import { getCAGED } from "@/lib/caged";

interface Props {
  tonic: string;
  scaleName: string;
}

export function ScaleFretboard({ scaleName }: Props) {
  const fretboardPositions = getFretboardPositionsOfScale(scaleName);
  const caged = getCAGED(fretboardPositions);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Scale Fretboard</h1>
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
