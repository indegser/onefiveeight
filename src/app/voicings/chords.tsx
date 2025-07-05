"use client";

import * as Chord from "@tonaljs/chord";
import { ChordInterval } from "./chord-interval";
import { ChordFretboard } from "./chord-fretboard";
import { useTonic } from "@/lib/stores";

export function Chords() {
  const chordName = useTonic() + "7";
  const chord = Chord.get(chordName);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Chords</h1>
      </div>
      <div className="flex flex-col gap-y-4">
        <ChordInterval chord={chord} />
        <ChordFretboard chord={chord} />
      </div>
    </div>
  );
}
