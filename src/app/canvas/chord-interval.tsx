import type { Scale } from "@tonaljs/scale";
import * as Interval from "@tonaljs/interval";
import * as TonalNote from "@tonaljs/note";
import { Note } from "../note/note";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import type { Chord } from "@tonaljs/chord";

interface Props {
  degree?: number;
  chord: Chord;
  scale: Scale;
  displayScaleInterval?: boolean;
}

export function ChordInterval({
  displayScaleInterval = false,
  scale,
  chord,
}: Props) {
  const fullIntervals = useMemo(() => {
    const { notes, intervals } = scale;
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
  }, [scale]);

  return (
    <div className="grid grid-cols-[repeat(7,32px)] gap-y-2 md:grid-cols-[repeat(13,32px)]">
      <div
        className="-col-end-1 grid grid-cols-subgrid gap-y-2"
        style={{ gridColumnStart: 1 }}
      >
        {fullIntervals.map(({ interval, note }, intervalIndex) => {
          const chordNoteIndex = chord.notes.findIndex((chordNote) => {
            return (
              chordNote === note || TonalNote.enharmonic(chordNote) === note
            );
          });

          const isInChord = chordNoteIndex >= 0;
          const chordInterval = chord.intervals[chordNoteIndex];

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
              {note ? (
                <Note
                  note={note}
                  interval={displayScaleInterval ? interval : chordInterval}
                  dimmed={!isInChord}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
