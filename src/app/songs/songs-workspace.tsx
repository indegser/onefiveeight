"use client";

import { useState } from "react";
import { ScoreViewer } from "./score-viewer";
import { SongList } from "./song-list";
import { getSongSystemCount, songs } from "@/lib/songs";

export function SongsWorkspace() {
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  const selectedSong = songs.find((song) => song.id === selectedSongId) ?? null;
  const totalSystems = songs.reduce(
    (count, song) => count + getSongSystemCount(song),
    0,
  );
  const keyCenters = new Set(songs.map((song) => song.keyCenter)).size;

  return (
    <section className="grid gap-5 xl:grid-cols-[23rem_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="border-b border-stone-300/80 pb-5">
          <p className="text-xs font-semibold tracking-[0.24em] text-stone-500 uppercase">
            Library
          </p>
          <h2 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-stone-950">
            Copied charts
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Scan the stack on the left and read a structured lead sheet on the
            right without leaving the page.
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="border-l border-stone-300/80 pl-3">
              <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                Total charts
              </dt>
              <dd className="mt-1 text-lg font-semibold text-stone-900">
                {songs.length}
              </dd>
            </div>
            <div className="border-l border-stone-300/80 pl-3">
              <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                Key centers
              </dt>
              <dd className="mt-1 text-lg font-semibold text-stone-900">
                {keyCenters}
              </dd>
            </div>
            <div className="border-l border-stone-300/80 pl-3">
              <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                Systems
              </dt>
              <dd className="mt-1 text-lg font-semibold text-stone-900">
                {totalSystems}
              </dd>
            </div>
            <div className="border-l border-stone-300/80 pl-3">
              <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                Focus
              </dt>
              <dd className="mt-1 text-lg font-semibold text-stone-900">
                Lead sheets
              </dd>
            </div>
          </dl>
        </div>
        <SongList
          songs={songs}
          selectedSongId={selectedSongId}
          onSelectSong={setSelectedSongId}
        />
      </aside>
      <ScoreViewer song={selectedSong} />
    </section>
  );
}
