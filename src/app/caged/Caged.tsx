import * as Key from "@tonaljs/key";
import { MotherScale } from "../scale/mother-scale";

interface Props {
  tonic: string;
}

export function Caged({ tonic }: Props) {
  const majorKey = Key.majorKey(tonic);

  return (
    <div className="flex flex-col gap-8">
      {majorKey.chordScales.map((scaleName) => (
        <MotherScale key={scaleName} tonic={tonic} scaleName={scaleName} />
      ))}
    </div>
  );
}
