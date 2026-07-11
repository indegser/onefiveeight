import { getSongSystemCount, type Song } from "@/lib/songs";
import { LeadSheetRenderer } from "./lead-sheet-renderer";

type ScoreViewerProps = {
  song: Song;
};

export function ScoreViewer({ song }: ScoreViewerProps) {
  return (
    <article className="bg-card p-5 md:p-7">
      <div className="border-b border-border pb-5">
        <div className="max-w-[48rem] space-y-2">
          <h1 className="text-[2.35rem] leading-[1.02] font-semibold tracking-[-0.04em] text-foreground md:text-[3rem]">
            {song.title}
          </h1>
          <p className="text-base font-medium text-muted-foreground">
            {song.artist}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
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
