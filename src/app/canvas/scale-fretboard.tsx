import { getFretboardPositionsOfScale } from "@/lib/fingering";
import { getCAGED, getForms } from "@/lib/caged";
import { Fretboard } from "@/components/fretboard/fretboard";

interface Props {
  tonic: string;
  scaleName: string;
}

export function ScaleFretboard({ scaleName }: Props) {
  const fretboardPositions = getFretboardPositionsOfScale(scaleName);
  const forms = getForms(fretboardPositions);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Scale Fretboard</h1>
      <div className="flex flex-col gap-4">
        {forms
          .sort((a, b) => a.startFret - b.startFret)
          .map((form) => (
            <Fretboard
              key={form.interval}
              startFret={form.startFret}
              endFret={form.endFret}
              fretboardPositions={fretboardPositions}
            />
          ))}
      </div>
    </div>
  );
}
