"use client";

import { useState } from "react";
import { ScoreViewer } from "./score-viewer";
import { SongList } from "./song-list";
import { songs } from "@/lib/songs";

export function SongsWorkspace() {
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  const selectedSong = songs.find((song) => song.id === selectedSongId) ?? null;
  const styles = new Set(songs.map((song) => song.style)).size;

  return (
    <section className="grid gap-5 xl:grid-cols-[23rem_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="border-b border-stone-300/80 pb-5">
          <p className="text-xs font-semibold tracking-[0.24em] text-stone-500 uppercase">
            Library
          </p>
          <h2 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-stone-950">
            Copied songs
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Keep scanning on the left and open a single score on the right
            without losing context.
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="border-l border-stone-300/80 pl-3">
              <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                Total songs
              </dt>
              <dd className="mt-1 text-lg font-semibold text-stone-900">
                {songs.length}
              </dd>
            </div>
            <div className="border-l border-stone-300/80 pl-3">
              <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                Styles
              </dt>
              <dd className="mt-1 text-lg font-semibold text-stone-900">
                {styles}
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
