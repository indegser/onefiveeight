import type { Metadata } from "next";
import { SongsWorkspace } from "./songs-workspace";

export const metadata: Metadata = {
  title: "Songs | One Five Eight",
  description: "Browse copied songs and open a digitized score viewer.",
};

export default function SongsPage() {
  return (
    <div className="min-h-screen bg-white p-8 font-[family-name:var(--font-geist-sans)] text-gray-900 md:p-12 lg:p-20">
      <main className="flex flex-col gap-8">
        <header className="max-w-3xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-gray-400">
            Songbook
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-950">
            Browse your copied songs and open the chart you need.
          </h1>
          <p className="text-base leading-7 text-gray-600">
            This page is optimized for quick scanning: pick a title on the left, then read the digitized score on the right without losing the song list.
          </p>
        </header>
        <SongsWorkspace />
      </main>
    </div>
  );
}
