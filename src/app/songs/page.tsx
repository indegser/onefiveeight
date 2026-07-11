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
    <div className="min-h-screen bg-background px-5 py-6 text-foreground md:px-8 md:py-8 lg:px-10 lg:py-10">
      <main className="mx-auto flex w-full max-w-[72rem] flex-col gap-4">
        <header className="flex flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-foreground">
            Songs
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {songs.length} charts · {keyCenters} keys · {totalSystems} systems
          </p>
        </header>
        <SongList songs={songs} />
      </main>
    </div>
  );
}
