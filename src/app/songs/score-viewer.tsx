import { getSongSystemCount, type Song } from "@/lib/songs";
import { LeadSheetRenderer } from "./lead-sheet-renderer";

type ScoreViewerProps = {
  song: Song;
};

export function ScoreViewer({ song }: ScoreViewerProps) {
  return (
    <article className="bg-[color:color-mix(in_srgb,var(--tone-surface)_60%,white)] p-5 md:p-7">
      <div className="border-b border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] pb-5">
        <div className="max-w-[48rem] space-y-2">
          <h1 className="type-display-compact text-[2.35rem] text-[var(--tone-text-primary)] md:text-[3rem]">
            {song.title}
          </h1>
          <p className="text-base font-medium text-[var(--tone-text-secondary)]">
            {song.artist}
          </p>
          <p className="text-sm leading-6 text-[var(--tone-text-muted)]">
            {song.keyCenter} · {song.feel} · {song.meter} ·{" "}
            {song.sections.length} sections · {getSongSystemCount(song)} systems
          </p>
        </div>
      </div>

      <div className="mt-5">
        <LeadSheetRenderer song={song} />
      </div>
    </article>
  );
}
