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
      <div className="rounded-[1rem] border border-dashed border-stone-300 bg-[#f8f4eb] p-6 text-sm text-stone-600">
        No songs yet. Add your copied charts here to start building the library.
      </div>
    );
  }

  return (
    <div className="border border-stone-300/80 bg-[#fbf7ef] p-3">
      <div className="mb-3 flex items-center justify-between border-b border-stone-200 px-2 pt-1 pb-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-stone-500 uppercase">
            Library
          </p>
          <p className="mt-1 text-sm text-stone-600">
            Open one chart and keep the rest in view.
          </p>
        </div>
        <span className="border-b border-stone-400/70 px-1 pb-1 text-[11px] font-medium tracking-[0.18em] text-stone-600 uppercase">
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
                  : "border-stone-200 bg-[#fffdf8] text-stone-900 hover:border-stone-400 hover:bg-[#f7f1e6]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-base font-semibold">{song.title}</p>
                  <p
                    className={cn(
                      "text-sm",
                      isSelected ? "text-stone-300" : "text-stone-500",
                    )}
                  >
                    {song.keyCenter}
                  </p>
                </div>
                <span
                  className={cn(
                    "border px-2 py-1 text-[10px] font-medium tracking-[0.18em] uppercase",
                    isSelected
                      ? "border-white/15 bg-white/8 text-stone-100"
                      : "border-stone-300/80 bg-[#efe6d8] text-stone-700",
                  )}
                >
                  {song.feel}
                </span>
              </div>
              <p
                className={cn(
                  "mt-3 text-sm leading-6",
                  isSelected ? "text-stone-200" : "text-stone-600",
                )}
              >
                {song.summary}
              </p>
              <div
                className={cn(
                  "mt-4 grid grid-cols-3 gap-2 border-t border-current/10 pt-3 text-[11px] tracking-[0.18em] uppercase",
                  isSelected ? "text-stone-300" : "text-stone-500",
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
