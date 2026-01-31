"use client";

import { Note } from "@/components/note/note";
import { playChordNotes } from "@/lib/chord-playback";
import * as TonalChord from "@tonaljs/chord";
import * as TonalNote from "@tonaljs/note";
import { PlayButton } from "./play-button";

interface Props {
  chordName: string;
}

export function Chord({ chordName }: Props) {
  if (!chordName) return null;

  const { tonic } = TonalChord.get(chordName);
  const simplifedChordName = chordName.replace(
    tonic!,
    TonalNote.simplify(tonic!),
  );
  const chord = TonalChord.get(simplifedChordName);

  const progression = [
    ["D", "D/F#", "G", "A"],
    ["Bm", "F#m", "G", "A"],
    ["D", "A", "Bm", "F#m"],
    ["G", "D", "Em", "A"],
    ["Bm", "G", "D", "A"],
    ["G", "A", "D", "A"],
  ].flat();

  const handlePlayChord = async () => {
    let index = 0;

    playChordNotes(chord);
    // while (true) {
    //   await new Promise((resolve) =>
    //     setTimeout(() => {
    //       playChordNotes(
    //         TonalChord.get(progression[index % progression.length]),
    //       );
    //       resolve(true);
    //       index += 1;
    //     }, 1500),
    //   );
    // }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">{chord.symbol}</div>
        <PlayButton
          label={`${chord.symbol} 코드 재생`}
          onClick={handlePlayChord}
        />
      </div>
      <div className="flex gap-2">
        {chord.notes.map((note, index) => {
          return (
            <Note
              key={note}
              note={note}
              interval={chord.intervals[index]}
              forceNote
              simple
            />
          );
        })}
      </div>
    </div>
  );
}
