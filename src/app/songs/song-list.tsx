import { getSongSystemCount, type Song } from "@/lib/songs";
import Link from "next/link";

type SongListProps = {
  songs: Song[];
};

export function SongList({ songs }: SongListProps) {
  if (songs.length === 0) {
    return (
      <div className="border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        No songs yet. Add your copied charts here to start building the library.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border border-y border-border">
      {songs.map((song) => (
        <Link
          key={song.id}
          href={`/songs/${song.id}`}
          className="group block px-1 py-4 transition-colors hover:bg-muted/45 focus-visible:ring-4 focus-visible:ring-ring/25 focus-visible:outline-none md:px-3"
        >
          <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-lg font-semibold tracking-[0] text-foreground group-hover:underline group-hover:decoration-muted-foreground group-hover:underline-offset-4">
                {song.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {song.artist}
              </p>
            </div>
            <p className="flex flex-wrap gap-x-2 gap-y-1 text-sm leading-6 text-muted-foreground md:justify-end md:text-right">
              <span>{song.feel}</span>
              <span aria-hidden="true">·</span>
              <span>{song.sections.length} sections</span>
              <span aria-hidden="true">·</span>
              <span>{getSongSystemCount(song)} systems</span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
