import type { Metadata } from "next";
import { PracticePlayer } from "./practice-player";

export const metadata: Metadata = {
  title: "Practice | One Five Eight",
  description: "An eight-bar F major backing track with a synchronized chord chart.",
};

export default function PracticePage() {
  return (
    <main className="mx-auto w-full max-w-[592px] px-4 py-4 text-foreground sm:py-8">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">F Major Ballad</h1>
        <p className="mt-1 text-sm text-muted-foreground">68 BPM · 4/4</p>
      </header>
      <PracticePlayer />
    </main>
  );
}
