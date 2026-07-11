import { getSongSystemCount, type Song } from "@/lib/songs";
import Link from "next/link";

type SongListProps = {
  songs: Song[];
};

export function SongList({ songs }: SongListProps) {
  if (songs.length === 0) {
    return (
      <div className="border border-dashed border-[var(--tone-border)] bg-[color:color-mix(in_srgb,var(--tone-canvas)_82%,white)] p-6 text-sm text-[var(--tone-text-secondary)]">
        No songs yet. Add your copied charts here to start building the library.
      </div>
    );
  }

  return (
    <div className="divide-y divide-[color:color-mix(in_srgb,var(--tone-border)_70%,transparent)] border-y border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)]">
      {songs.map((song) => (
        <Link
          key={song.id}
          href={`/songs/${song.id}`}
          className="group block px-1 py-6 transition-colors hover:bg-[color:color-mix(in_srgb,var(--tone-surface)_50%,transparent)] focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_srgb,var(--tone-accent)_25%,transparent)] focus-visible:outline-none md:px-3"
        >
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_15rem] md:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-xl font-semibold tracking-[0] text-[var(--tone-text-primary)] group-hover:underline group-hover:decoration-[var(--tone-text-muted)] group-hover:underline-offset-4">
                  {song.title}
                </h2>
                <p className="text-sm text-[var(--tone-text-muted)]">
                  {song.artist}
                </p>
              </div>
              <p className="mt-3 max-w-[44rem] text-sm leading-6 text-[var(--tone-text-secondary)]">
                {song.summary}
              </p>
            </div>
            <p className="text-sm leading-6 text-[var(--tone-text-muted)] md:text-right">
              {song.keyCenter} · {song.feel}
              <br />
              {song.meter}
              <br />
              {song.sections.length} sections · {getSongSystemCount(song)} systems
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
