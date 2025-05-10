"use client";

import { getAllChords, NOTES } from "@/lib/chord";
import { useState } from "react";
import { Fretboard } from "./fretboard";

export default function Home() {
  const [rootNote, setRootNote] = useState("C"); // Default root note
  const chords = getAllChords(rootNote).slice(0, 1);

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 bg-white p-8 pb-20 font-[family-name:var(--font-geist-sans)] text-gray-900 sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <div className="flex items-center gap-4">
          <h1 className="text-center text-3xl font-bold">Chord Types</h1>
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
        </div>
        <div className="grid grid-cols-[minmax(300px,_1fr)] gap-8">
          {chords.map((chord) => (
            <div
              key={chord.symbol}
              className="flex flex-col items-center gap-2 sm:items-start"
            >
              <h2 className="text-sm font-bold">{chord.name}</h2>
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
