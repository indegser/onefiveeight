import type { Song } from "@/lib/songs";
import { LeadSheetRenderer } from "./lead-sheet-renderer";

type ScoreViewerProps = {
  song: Song;
};

export function ScoreViewer({ song }: ScoreViewerProps) {
  return (
    <article>
      <header className="space-y-2">
        <h1 className="text-[2.35rem] leading-[1.02] font-semibold tracking-[-0.04em] text-foreground md:text-[3rem]">
          {song.title}
        </h1>
        <p className="text-base font-medium text-muted-foreground">
          {song.artist}
        </p>
        {song.analysisDigest ? (
          <p className="max-w-4xl font-mono text-xs leading-5 text-muted-foreground">
            {song.analysisDigest}
          </p>
        ) : null}
      </header>

      <div className="mt-8">
        <LeadSheetRenderer song={song} />
      </div>
    </article>
  );
}
