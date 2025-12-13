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
      <h1 className="text-xl font-bold">Fingering</h1>
      <div className="flex flex-wrap gap-12">
        {forms.map((form) => (
          <div key={form.interval}>
            <div>
              <div className="text-sm font-semibold">Form {form.form}</div>
            </div>
            <Fretboard
              key={form.interval}
              startFret={form.startFret}
              endFret={form.endFret}
              fretboardPositions={fretboardPositions}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
