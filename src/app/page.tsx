"use client";

import { NOTES } from "@/lib/chord";
import { Suspense, useState } from "react";
import { Toggle } from "./toggle";
import { Caged } from "./caged/Caged";

export default function Home() {
  const [rootNote, setRootNote] = useState("C"); // Default root note

  return (
    <Suspense>
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
            <h1 className="text-center text-3xl font-bold">Key</h1>
            <Toggle />
          </div>
          <div>
            <Caged tonic={rootNote} />
          </div>
        </main>
      </div>
    </Suspense>
  );
}
