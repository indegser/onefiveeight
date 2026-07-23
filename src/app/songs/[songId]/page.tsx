import type { Metadata } from "next";
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
    <div className="min-h-screen bg-background px-6 py-6 text-foreground md:px-10 md:py-8 lg:px-16 lg:py-10">
      <main className="w-full">
        <ScoreViewer song={song} />
      </main>
    </div>
  );
}
