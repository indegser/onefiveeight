"use client";

import { getAllChords, NOTES_SHARP } from "@/lib/chord";
import { useState } from "react";

export default function Home() {
  const [rootNote, setRootNote] = useState("C"); // Default root note
  const chords = getAllChords(rootNote);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center">
          <h1 className="text-3xl font-bold text-center">Chord Types</h1>
          <select
            className="text-center text-2xl font-bold"
            onChange={(e) => setRootNote(e.target.value)}
            value={rootNote}
          >
            {NOTES_SHARP.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-[minmax(300px,_1fr)] gap-8">
          {chords.map((chord) => (
            <div
              key={chord.id}
              className="flex flex-col gap-2 items-center sm:items-start"
            >
              <h2 className="text-sm font-bold">{`${rootNote} ${chord.label}`}</h2>
              <div className="flex gap-4">
                {chord.notes.map((note, index) => (
                  <div key={note} className="flex flex-col gap-2 items-center">
                    <div className="flex items-center justify-center w-8 h-8 text-gray-300 font-semibold text-xs bg-gray-700 rounded-full">
                      {note}
                    </div>
                    <div className="text-xs text-gray-400">
                      {chord.formula[index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
