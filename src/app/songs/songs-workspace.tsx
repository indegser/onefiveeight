"use client";

import { useState } from "react";
import { ScoreViewer } from "./score-viewer";
import { SongList } from "./song-list";
import { songs } from "@/lib/songs";

export function SongsWorkspace() {
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  const selectedSong =
    songs.find((song) => song.id === selectedSongId) ?? null;

  return (
    <section className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-gray-400">
            Library
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-gray-950">
            Copied Songs
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Keep your copied charts in one place and open any song into the score viewer with a single click.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm text-gray-600">
            <span>Total songs</span>
            <span className="font-semibold text-gray-900">{songs.length}</span>
          </div>
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
