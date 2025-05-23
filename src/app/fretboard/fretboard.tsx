import { getFretboardPositions } from "@/lib/guitar";
import { Chord } from "@tonaljs/chord";
import { Strings } from "./strings";
import { Frets } from "./frets";
import { Finger } from "./finger";

interface Props {
  chord: Chord;
  frets?: number;
}

export const Fretboard = ({ chord, frets = 14 }: Props) => {
  const fretboardPositions = getFretboardPositions(chord, frets);

  return (
    <div className="relative w-full overflow-x-scroll">
      <div
        className="relative grid"
        style={{
          gridTemplateRows: "repeat(6, 1fr)",
          gridTemplateColumns: `repeat(${frets + 1}, 40px)`,
        }}
      >
        <Strings />
        <Frets frets={frets} />
        {/* SVG overlay for lines */}
        {fretboardPositions.map(({ fret, string, ...extra }) => (
          <Finger
            key={`${string}-${fret}`}
            fret={fret}
            string={string}
            {...extra}
          />
        ))}
      </div>
    </div>
  );
};
