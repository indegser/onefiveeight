"use client";

import { cn } from "@/lib/utils";
import type { Song } from "@/lib/songs";

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
      <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
        No songs yet. Add your copied charts here to start building the library.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {songs.map((song) => {
        const isSelected = song.id === selectedSongId;

        return (
          <button
            key={song.id}
            type="button"
            onClick={() => onSelectSong(song.id)}
            className={cn(
              "w-full rounded-3xl border px-4 py-4 text-left transition-colors",
              "focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-4",
              isSelected
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-base font-semibold">{song.title}</p>
                <p
                  className={cn(
                    "text-sm",
                    isSelected ? "text-gray-200" : "text-gray-500",
                  )}
                >
                  {song.composer}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  isSelected
                    ? "bg-white/15 text-white"
                    : "bg-gray-100 text-gray-600",
                )}
              >
                {song.style}
              </span>
            </div>
            <p
              className={cn(
                "mt-3 text-sm leading-6",
                isSelected ? "text-gray-100" : "text-gray-600",
              )}
            >
              {song.summary}
            </p>
          </button>
        );
      })}
    </div>
  );
}
