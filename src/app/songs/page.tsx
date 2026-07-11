import type { Metadata } from "next";
import { getSongSystemCount, songs } from "@/lib/songs";
import { SongList } from "./song-list";

export const metadata: Metadata = {
  title: "Songs | One Five Eight",
  description: "Browse copied songs and open a lead-sheet style score viewer.",
};

export default function SongsPage() {
  const totalSystems = songs.reduce(
    (count, song) => count + getSongSystemCount(song),
    0,
  );
  const keyCenters = new Set(songs.map((song) => song.keyCenter)).size;

  return (
    <div className="min-h-screen bg-[var(--tone-canvas)] px-5 py-6 font-[family-name:var(--font-body)] text-[var(--tone-text-primary)] md:px-8 md:py-8 lg:px-10 lg:py-10">
      <main className="mx-auto flex w-full max-w-[76rem] flex-col gap-[var(--space-5)]">
        <header className="border-b border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] pb-[var(--space-5)]">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div className="max-w-[48rem] space-y-3">
              <p className="type-kicker text-[var(--tone-text-muted)]">Songbook</p>
              <h1 className="type-display max-w-[38rem] text-[2.25rem] text-[var(--tone-text-primary)] md:text-[3rem]">
                Browse copied charts.
              </h1>
              <p className="max-w-[38rem] text-sm leading-7 text-[var(--tone-text-secondary)] md:text-[15px]">
                Open a song to read its focused lead-sheet page with section
                systems, chord changes, repeats, and ending cues.
              </p>
            </div>
            <p className="max-w-[20rem] border-l border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] pl-4 text-sm leading-7 text-[var(--tone-text-secondary)]">
              {songs.length} charts, {keyCenters} key centers, {totalSystems}{" "}
              systems.
            </p>
          </div>
        </header>
        <SongList songs={songs} />
      </main>
    </div>
  );
}
