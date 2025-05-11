"use client";

import { getAllChords, NOTES } from "@/lib/chord";
import { useState } from "react";
import { Fretboard } from "./fretboard/fretboard";
import { Note } from "./note/note";
import { Toggle } from "./toggle";

export default function Home() {
  const [rootNote, setRootNote] = useState("C"); // Default root note
  const chords = getAllChords(rootNote).slice(0, 16);

  return (
    <div className="min-h-screen bg-white p-8 font-[family-name:var(--font-geist-sans)] text-gray-900 md:p-12 lg:p-20">
      <main className="row-start-2 flex flex-col gap-[32px]">
        <div className="flex items-center gap-4">
          <select
            className="text-center text-2xl font-bold"
            onChange={(e) => setRootNote(e.target.value)}
            value={rootNote}
          >
            {NOTES.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
          <h1 className="text-center text-3xl font-bold">Chord</h1>
          <Toggle />
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          {chords.map((chord) => (
            <div key={chord.symbol} className="flex flex-col items-start gap-2">
              <div className="flex flex-col gap-3 pb-3">
                <div className="flex items-center gap-1">
                  <div className="leading-none font-bold lg:text-lg">
                    {chord.name}
                  </div>
                  <div className="text-sm leading-none font-semibold">
                    {`(${chord.symbol})`}
                  </div>
                </div>
                <div className="flex gap-2">
                  {chord.intervals.map((interval, index) => {
                    return (
                      <div key={interval}>
                        <Note note={chord.notes[index]} interval={interval} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <Fretboard chord={chord} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
