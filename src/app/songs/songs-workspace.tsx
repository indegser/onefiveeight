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
    <section className="grid gap-[var(--space-5)] pt-[var(--space-4)] xl:grid-cols-[23rem_minmax(0,1fr)]">
      <aside className="space-y-[var(--space-4)]">
        <div className="border-b border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] pb-[var(--space-5)]">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--tone-text-muted)]">
            Library
          </p>
          <h2 className="mt-3 text-[1.75rem] font-semibold tracking-[var(--tracking-display-sm)] text-[var(--tone-text-primary)]">
            Copied charts
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--tone-text-secondary)]">
            Scan the stack on the left and read a structured lead sheet on the
            right without leaving the page.
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="border-l border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] pl-3">
              <dt className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
                Total charts
              </dt>
              <dd className="mt-1 text-lg font-semibold text-[var(--tone-text-primary)]">
                {songs.length}
              </dd>
            </div>
            <div className="border-l border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] pl-3">
              <dt className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
                Key centers
              </dt>
              <dd className="mt-1 text-lg font-semibold text-[var(--tone-text-primary)]">
                {keyCenters}
              </dd>
            </div>
            <div className="border-l border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] pl-3">
              <dt className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
                Systems
              </dt>
              <dd className="mt-1 text-lg font-semibold text-[var(--tone-text-primary)]">
                {totalSystems}
              </dd>
            </div>
            <div className="border-l border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] pl-3">
              <dt className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
                Focus
              </dt>
              <dd className="mt-1 text-lg font-semibold text-[var(--tone-text-primary)]">
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
