"use client";

import * as Key from "@tonaljs/key";
import * as Progression from "@tonaljs/progression";
import { Chord } from "./chord";
import { useTonic } from "@/lib/stores";
import { TonicSelector } from "../settings/tonic-selector";
import { DisplayTypeSelector } from "../settings/display-type-selector";

const SECONDARY_DOMINANTS_MINOR_RELATIVE = [
  "bIIM7",
  "IIm7b5",
  "",
  "IVm6",
  "",
  "bVI6",
  "bVII7",
];

const SECONDARY_DOMINANTS = ["I7", "II7", "III7", "", "", "VI7", "VII7"];

const RELATED_TWO_MINOR = ["", "", "IIIm7b5", "#IVm7b5", "Vm7", "", "VIIm7"];

const TRITONE_SUBSTITUTES = [
  "",
  "bII7",
  "bIII7",
  "IV7",
  "bV7",
  "bVI7",
  "bVII7",
];

export default function ChordsPage() {
  const tonic = useTonic();
  const key = Key.majorKey(tonic);
  const { chords, substituteDominants } = key;

  const secondaryDominants = Progression.fromRomanNumerals(
    tonic,
    SECONDARY_DOMINANTS,
  );

  const secondaryDominantsMinorRelative = Progression.fromRomanNumerals(
    tonic,
    SECONDARY_DOMINANTS_MINOR_RELATIVE,
  );

  const relatedTwoMinor = Progression.fromRomanNumerals(
    tonic,
    RELATED_TWO_MINOR,
  );

  const tritoneSubstitutes = Progression.fromRomanNumerals(
    tonic,
    TRITONE_SUBSTITUTES,
  );

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
        <div>Secondary Dominants Minor Relative</div>
        <div className="grid grid-cols-7 gap-8">
          {secondaryDominantsMinorRelative.map((chordName, index) => {
            return (
              <div key={chordName + index}>
                <Chord chordName={chordName} />
              </div>
            );
          })}
        </div>
        <div>Secondary Dominants</div>
        <div className="grid grid-cols-7 gap-8">
          {secondaryDominants.map((chordName, index) => {
            return (
              <div key={chordName + index}>
                <Chord chordName={chordName} />
              </div>
            );
          })}
        </div>
        <div>Related Two Minor</div>
        <div className="grid grid-cols-7 gap-8">
          {relatedTwoMinor.map((chordName, index) => {
            return (
              <div key={chordName + index}>
                <Chord chordName={chordName} />
              </div>
            );
          })}
        </div>
        <div>Tritone Substitutes</div>
        <div className="grid grid-cols-7 gap-8">
          {tritoneSubstitutes.map((chordName, index) => {
            return (
              <div key={chordName + index}>
                <Chord chordName={chordName} />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
