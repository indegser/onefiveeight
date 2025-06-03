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
        const distanceFromTonic = Interval.distance(tonic, chordScaleTonic!);

        return (
          <div key={chordScale} className="flex flex-col gap-2">
            <div>
              <div className="text-sm font-semibold">{chordScaleName}</div>
            </div>
            <div className="grid grid-cols-[repeat(24,32px)]">
              {intervalsWithOctave.map((interval, intervalIndex) => {
                const semitones = Interval.semitones(
                  Interval.add(interval, distanceFromTonic)!,
                );

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
