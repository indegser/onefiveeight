import { Canvas } from "./canvas/scale-canvas";
import { Settings } from "./settings/settings";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "One Five Eight",
  description:
    "Master the guitar fretboard through theory-driven tools, not just memorization. Onefiveeight helps you explore chords, scales, and improvisation using the foundational power of the 1st, 5th, and 8th degrees.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white p-8 font-[family-name:var(--font-geist-sans)] text-gray-900 md:p-12 lg:p-20">
      <main className="row-start-2 flex flex-col gap-[32px]">
        <Settings />
        <div>
          <Canvas />
        </div>
      </main>
    </div>
  );
}
