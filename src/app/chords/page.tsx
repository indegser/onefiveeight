"use client";

import * as Key from "@tonaljs/key";
import { Chord } from "./chord";
import { useTonic } from "@/lib/stores";
import { TonicSelector } from "../settings/tonic-selector";

export default function ChordsPage() {
  const tonic = useTonic();
  const key = Key.majorKey(tonic);
  const { chords, secondaryDominants, secondaryDominantsMinorRelative } = key;

  return (
    <div className="min-h-screen bg-white p-8 font-[family-name:var(--font-geist-sans)] text-gray-900 md:p-12 lg:p-20">
      <main className="row-start-2 flex flex-col gap-[32px]">
        <TonicSelector />
        <div className="flex flex-col gap-y-8">
          {chords.map((chordName, chordIndex) => {
            const isTonic = chordIndex === 0;

            return (
              <div key={chordName} className="grid grid-cols-3">
                <div>
                  <div className="text-xs">ii</div>
                  <Chord
                    chordName={secondaryDominantsMinorRelative[chordIndex]}
                  />
                </div>
                <div>
                  <div className="text-xs">V</div>
                  <Chord chordName={secondaryDominants[chordIndex]} />
                </div>
                <div>
                  <div className="text-xs">I</div>
                  <Chord chordName={chordName} />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
