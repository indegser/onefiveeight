import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRACTICE_TRACKS, practiceTrackById } from "@/lib/practice-track";
import { PracticePlayer } from "../practice-player";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return PRACTICE_TRACKS.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const track = practiceTrackById((await params).id);
  return { title: track ? `${track.title} | Practice` : "Track not found" };
}

export default async function PracticeTrackPage({ params }: Props) {
  const track = practiceTrackById((await params).id);
  if (!track) notFound();
  return (
    <main className="mx-auto w-full max-w-[592px] px-4 py-4 text-foreground sm:py-8">
      <Link href="/practice" className="mb-4 inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring">← 백킹트랙</Link>
      <header className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{track.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{track.key} · {track.bpm} BPM · {track.meter}</p>
      </header>
      <PracticePlayer key={`${track.id}-${track.revision}`} track={track} />
    </main>
  );
}
