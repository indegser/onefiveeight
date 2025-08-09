"use client";

import * as Key from "@tonaljs/key";
import { Chord } from "./chord";
import { useTonic } from "@/lib/stores";
import { TonicSelector } from "../settings/tonic-selector";
import { DisplayTypeSelector } from "../settings/display-type-selector";

export default function ChordsPage() {
  const tonic = useTonic();
  const key = Key.majorKey(tonic);
  const {
    chords,
    secondaryDominants,
    secondaryDominantsMinorRelative,
    substituteDominants,
    ...x
  } = key;

  return (
    <div className="min-h-screen bg-white p-8 font-[family-name:var(--font-geist-sans)] text-gray-900 md:p-12 lg:p-20">
      <main className="row-start-2 flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <TonicSelector />
          <DisplayTypeSelector />
        </div>
        <div>Diatonic</div>
        <div className="grid grid-cols-7 gap-8">
          {chords.map((chordName) => {
            return (
              <div key={chordName} className="">
                <Chord chordName={chordName} />
              </div>
            );
          })}
        </div>
        <div>2nd Dominants</div>
        <div className="grid grid-cols-7 gap-8">
          {chords.map((chordName, chordIndex) => {
            return (
              <div key={chordName} className="">
                <Chord chordName={secondaryDominants[(chordIndex + 3) % 7]} />
              </div>
            );
          })}
        </div>
        <div>2nd Dominants Minor Relative</div>
        <div className="grid grid-cols-7 gap-8">
          {chords.map((chordName, chordIndex) => {
            return (
              <div key={chordName} className="">
                <Chord
                  chordName={
                    secondaryDominantsMinorRelative[(chordIndex + 6) % 7]
                  }
                />
              </div>
            );
          })}
        </div>
        <div>Substitute Dominants</div>
        <div className="grid grid-cols-7 gap-8">
          {chords.map((chordName, chordIndex) => {
            return (
              <div key={chordName} className="">
                <Chord chordName={substituteDominants[(chordIndex + 6) % 7]} />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
