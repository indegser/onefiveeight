"use client";

import { cn } from "@/lib/utils";
import { getSongSystemCount, type Song } from "@/lib/songs";

type SongListProps = {
  songs: Song[];
  selectedSongId: string | null;
  onSelectSong: (songId: string) => void;
};

export function SongList({
  songs,
  selectedSongId,
  onSelectSong,
}: SongListProps) {
  if (songs.length === 0) {
    return (
      <div className="rounded-[1rem] border border-dashed border-[var(--tone-border)] bg-[color:color-mix(in_srgb,var(--tone-canvas)_82%,white)] p-6 text-sm text-[var(--tone-text-secondary)]">
        No songs yet. Add your copied charts here to start building the library.
      </div>
    );
  }

  return (
    <div className="border border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] bg-[color:color-mix(in_srgb,var(--tone-surface)_85%,var(--tone-canvas))] p-3">
      <div className="mb-3 flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] px-2 pt-1 pb-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--tone-text-muted)]">
            Library
          </p>
          <p className="mt-1 text-sm text-[var(--tone-text-secondary)]">
            Open one chart and keep the rest in view.
          </p>
        </div>
        <span className="border-b border-[color:color-mix(in_srgb,var(--tone-text-secondary)_70%,transparent)] px-1 pb-1 text-[11px] font-medium tracking-[var(--tracking-meta)] text-[var(--tone-text-secondary)]">
          {songs.length} charts
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {songs.map((song) => {
          const isSelected = song.id === selectedSongId;

          return (
            <button
              key={song.id}
              type="button"
              onClick={() => onSelectSong(song.id)}
              className={cn(
                "w-full border px-4 py-4 text-left transition-[background-color,border-color,color]",
                "focus-visible:ring-ring/40 focus-visible:ring-4 focus-visible:outline-none",
                isSelected
                  ? "border-stone-700 bg-stone-900 text-stone-50"
                  : "border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] bg-[color:color-mix(in_srgb,var(--tone-surface)_65%,white)] text-[var(--tone-text-primary)] hover:border-[var(--tone-text-muted)] hover:bg-[color:color-mix(in_srgb,var(--tone-canvas)_82%,white)]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-base font-semibold">{song.title}</p>
                  <p
                    className={cn(
                      "text-sm",
                      isSelected
                        ? "text-stone-300"
                        : "text-[var(--tone-text-muted)]",
                    )}
                  >
                    {song.keyCenter}
                  </p>
                </div>
                <span
                  className={cn(
                    "border px-2 py-1 text-[10px] font-medium tracking-[0.08em]",
                    isSelected
                      ? "border-white/15 bg-white/8 text-stone-100"
                      : "border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] bg-[color:color-mix(in_srgb,var(--tone-accent-soft)_70%,var(--tone-canvas))] text-[var(--tone-text-secondary)]",
                  )}
                >
                  {song.feel}
                </span>
              </div>
              <p
                className={cn(
                  "mt-3 text-sm leading-6",
                  isSelected
                    ? "text-stone-200"
                    : "text-[var(--tone-text-secondary)]",
                )}
              >
                {song.summary}
              </p>
              <div
                className={cn(
                  "mt-4 grid grid-cols-3 gap-2 border-t border-current/10 pt-3 text-[11px] tracking-[0.08em]",
                  isSelected
                    ? "text-stone-300"
                    : "text-[var(--tone-text-muted)]",
                )}
              >
                <span>{song.meter}</span>
                <span>{song.sections.length} sections</span>
                <span>{getSongSystemCount(song)} systems</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
