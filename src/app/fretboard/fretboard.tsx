import { Strings } from "./strings";
import { Frets } from "./frets";
import { Finger } from "./finger";
import { FretboardPosition } from "@/lib/fingering";

interface Props {
  fretboardPositions: FretboardPosition[];
  startFret?: number;
  endFret?: number;
}

export const Fretboard = ({
  fretboardPositions,
  startFret = 0,
  endFret = 14,
}: Props) => {
  const frets = endFret - startFret;

  return (
    <div className="relative w-full">
      <div
        className="relative grid"
        style={{
          gridTemplateRows: "repeat(6, 1fr)",
          gridTemplateColumns: `repeat(${frets + 1}, 40px)`,
        }}
      >
        <Strings hasOpenFret={startFret === 0} />
        <Frets startFret={startFret} endFret={endFret} />
        {fretboardPositions.map(({ fret, string, ...extra }) => {
          if (fret > endFret) return null;
          if (fret < startFret) return null;

          return (
            <Finger
              key={`${string}-${fret}`}
              fret={fret - startFret}
              string={string}
              {...extra}
            />
          );
        })}
      </div>
    </div>
  );
};
