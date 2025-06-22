import { getDiatonicChords } from "@/lib/chord";
import * as Scale from "@tonaljs/scale";
import { ChordInterval } from "./chord-interval";
import { ScaleChordsSettings } from "./diatonic-chords-settings";
import { useScaleChordsDisplayType } from "@/lib/stores";

interface Props {
  scaleName: string;
}

export function DiatonicChords({ scaleName }: Props) {
  const displayType = useScaleChordsDisplayType();
  const chords = getDiatonicChords(scaleName);
  const scale = Scale.get(scaleName);
  if (chords.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Diatonic Chords</h1>
        <ScaleChordsSettings />
      </div>
      <div className="flex flex-col gap-y-8">
        {chords.map((chord) => {
          const displayChord =
            displayType === "seventh" ? chord.seventh : chord.triad;

          return (
            <div key={chord.degree} className="flex flex-col gap-y-2">
              <div>
                <div className="text-xs">Degree {chord.degree}</div>
                <div className="text-sm font-semibold">{displayChord.name}</div>
              </div>
              <ChordInterval
                degree={chord.degree}
                chord={displayChord}
                scale={scale}
                displayScaleInterval={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
