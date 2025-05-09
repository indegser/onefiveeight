import { getCAGEDChord } from "@/lib/guitar";
import { Chord } from "@tonaljs/chord";
import { Fretboard } from "./fretboard";

interface Props {
  chord: Chord;
}

export const ChordForm = ({ chord }: Props) => {
  const forms = getCAGEDChord(chord);

  return (
    <div className="flex gap-8">
      {Object.entries(forms).map(([formType, fingering]) => (
        <div
          key={formType}
          className="flex flex-col gap-2 items-center sm:items-start"
        >
          <h3 className="text-sm font-bold">{formType}</h3>
          <Fretboard fingering={fingering} />
        </div>
      ))}
    </div>
  );
};
