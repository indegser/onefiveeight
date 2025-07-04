import * as Scale from "@tonaljs/scale";
import * as Interval from "@tonaljs/interval";
import { Note } from "../../components/note/note";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface Props {
  tonic: string;
  scaleName: string;
  useAbsolutePosition?: boolean;
}

export function ScaleInterval({
  tonic,
  scaleName,
  useAbsolutePosition = false,
}: Props) {
  const { notes, intervals, tonic: chordScaleTonic } = Scale.get(scaleName);

  const fullIntervals = useMemo(() => {
    return [...new Array(13)].map((_, index) => {
      const interval = Interval.fromSemitones(index);

      const intervalIndex = intervals.findIndex((x) => {
        return Interval.semitones(Interval.subtract(x, interval)!) % 12 === 0;
      });

      if (intervalIndex === -1) {
        return { interval, note: null };
      }

      return { interval: intervals[intervalIndex], note: notes[intervalIndex] };
    });
  }, [intervals, notes]);

  const offset = useAbsolutePosition
    ? 0
    : Interval.semitones(Interval.distance(tonic, chordScaleTonic!));

  /**
   * Should fix interval display broken when useAbsolutePosition is false and sm display is used.
   */
  return (
    <div className="grid grid-cols-[repeat(7,32px)] gap-y-2 md:grid-cols-[repeat(24,32px)]">
      <div className="-col-end-1" style={{ gridColumnStart: `${offset + 1}` }}>
        <h1 className="text-xl font-bold">Intervals & Notes</h1>
      </div>
      <div
        className="-col-end-1 row-start-2 grid grid-cols-subgrid gap-y-2"
        style={{ gridColumnStart: `${offset + 1}` }}
      >
        {fullIntervals.map(({ interval, note }, intervalIndex) => {
          return (
            <div
              key={interval + intervalIndex}
              className="relative flex items-center justify-center"
            >
              <div
                className={cn(
                  "absolute right-0 left-0 h-px bg-gray-300",
                  intervalIndex === 0 && "right-0 left-1/2",
                  intervalIndex === 12 && "right-1/2 left-0",
                )}
              />
              {note ? <Note note={note} interval={interval} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
