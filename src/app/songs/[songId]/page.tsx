import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSongById, songs } from "@/lib/songs";
import { ScoreViewer } from "../score-viewer";

type SongDetailPageProps = {
  params: Promise<{
    songId: string;
  }>;
};

export function generateStaticParams() {
  return songs.map((song) => ({
    songId: song.id,
  }));
}

export async function generateMetadata({
  params,
}: SongDetailPageProps): Promise<Metadata> {
  const { songId } = await params;
  const song = getSongById(songId);

  if (!song) {
    return {
      title: "Song not found | One Five Eight",
    };
  }

  return {
    title: `${song.title} | Songs | One Five Eight`,
    description: song.summary,
  };
}

export default async function SongDetailPage({ params }: SongDetailPageProps) {
  const { songId } = await params;
  const song = getSongById(songId);

  if (!song) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background px-5 py-6 text-foreground md:px-8 md:py-8 lg:px-10 lg:py-10">
      <main className="mx-auto flex w-full max-w-[76rem] flex-col gap-4">
        <Link
          href="/songs"
          className="w-fit text-sm font-medium text-muted-foreground underline decoration-muted-foreground/55 underline-offset-4 transition-colors hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/25 focus-visible:outline-none"
        >
          Back to songs
        </Link>
        <ScoreViewer song={song} />
      </main>
    </div>
  );
}
