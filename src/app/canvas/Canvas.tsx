import { ScaleFretboard } from "./scale-fretboard";
import { useScale, useTonic } from "@/lib/stores";
import { ScaleInterval } from "./scale-interval";

export function Caged() {
  const tonic = useTonic();
  const scale = useScale();
  const scaleName = `${tonic} ${scale}`;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">{scaleName}</h1>
      <ScaleInterval tonic={tonic} scaleName={scaleName} useAbsolutePosition />
      <ScaleFretboard tonic={tonic} scaleName={scaleName} />
    </div>
  );
}
