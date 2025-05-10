import { getFretboardPositions } from "@/lib/guitar";
import { Chord } from "@tonaljs/chord";
import { Strings } from "./fretboard/strings";
import { Frets } from "./fretboard/frets";
import { Note } from "./fretboard/note";

interface Props {
  chord: Chord;
  frets?: number;
}

export const Fretboard = ({ chord, frets = 14 }: Props) => {
  const fretboardPositions = getFretboardPositions(chord, frets);

  return (
    <div className="relative">
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
          <Note
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
