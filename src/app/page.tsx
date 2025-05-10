"use client";

import { getAllChords, NOTES } from "@/lib/chord";
import { useState } from "react";
import { Fretboard } from "./fretboard/fretboard";
import { Note } from "./note/note";

export default function Home() {
  const [rootNote, setRootNote] = useState("C"); // Default root note
  const chords = getAllChords(rootNote);

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 bg-white p-8 pb-20 font-[family-name:var(--font-geist-sans)] text-gray-900 sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
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
        </div>
        <div className="grid grid-cols-[minmax(300px,_1fr)] gap-8">
          {chords.map((chord) => (
            <div
              key={chord.symbol}
              className="flex flex-col items-center gap-2 sm:items-start"
            >
              <div className="mb-2 flex w-full items-center justify-between border-b border-gray-300 pb-2">
                <div className="flex items-center gap-1">
                  <div className="text-lg leading-none font-bold">
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
                        <Note
                          note={chord.notes[index]}
                          interval={interval}
                          displayNote
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <Fretboard chord={chord} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
