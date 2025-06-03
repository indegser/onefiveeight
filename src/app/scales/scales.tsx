import * as Scale from "@tonaljs/scale";
import * as Key from "@tonaljs/key";
import * as Interval from "@tonaljs/interval";
import { Note } from "../note/note";

interface Props {
  tonic: string;
}

export function Scales({ tonic }: Props) {
  const { chordScales } = Key.majorKey(tonic);

  return (
    <div className="grid gap-y-4">
      {chordScales.map((chordScale) => {
        const {
          name: chordScaleName,
          notes,
          intervals,
          tonic: chordScaleTonic,
        } = Scale.get(chordScale);
        const intervalsWithOctave = [...intervals, "8M"];
        const offset = Interval.semitones(
          Interval.distance(tonic, chordScaleTonic!),
        );

        return (
          <div
            key={chordScale}
            className="grid grid-cols-[repeat(24,32px)] gap-y-2"
          >
            <div
              className="row-start-2 flex items-center"
              style={{
                gridColumnStart: `${offset + 1}`,
                gridColumnEnd: "span 12",
              }}
            >
              <div className="h-0.5 w-full bg-gray-200" />
            </div>
            <div
              className="-col-end-1"
              style={{ gridColumnStart: `${offset + 1}` }}
            >
              <div className="text-sm font-semibold">{chordScaleName}</div>
            </div>
            <div
              className="-col-end-1 row-start-2 grid grid-cols-subgrid"
              style={{ gridColumnStart: `${offset + 1}` }}
            >
              {intervalsWithOctave.map((interval, intervalIndex) => {
                const semitones = Interval.semitones(interval);

                return (
                  <div
                    key={interval}
                    style={{
                      gridColumnStart: `${semitones + 1}`,
                    }}
                  >
                    <Note note={notes[intervalIndex % 7]} interval={interval} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
