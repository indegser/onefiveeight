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
      <main className="mx-auto flex w-full max-w-[72rem] flex-col gap-[var(--space-4)]">
        <header className="flex flex-col gap-2 border-b border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] pb-[var(--space-3)] sm:flex-row sm:items-end sm:justify-between">
          <h1 className="type-title text-[1.75rem] text-[var(--tone-text-primary)]">
            Songs
          </h1>
          <p className="text-sm leading-6 text-[var(--tone-text-muted)]">
            {songs.length} charts · {keyCenters} keys · {totalSystems} systems
          </p>
        </header>
        <SongList songs={songs} />
      </main>
    </div>
  );
}
