import type { Metadata } from "next";
import Link from "next/link";
import { PRACTICE_TRACKS } from "@/lib/practice-track";

export const metadata: Metadata = {
  title: "Practice | One Five Eight",
  description: "반복해서 연습하는 백킹트랙 라이브러리.",
};

export default function PracticePage() {
  return (
    <main className="mx-auto w-full max-w-[592px] px-4 py-4 text-foreground sm:py-8" lang="ko">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">백킹트랙</h1>
      <ul className="divide-y divide-border border-y border-border">
        {PRACTICE_TRACKS.map((track) => (
          <li key={track.id}>
            <Link
              href={`/practice/${track.id}`}
              className="flex min-h-20 items-center justify-between gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <div className="min-w-0">
                <h2 className="text-base font-medium leading-6">{track.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{track.key} · {track.bpm} BPM · {track.meter}</p>
              </div>
              <span className="shrink-0 text-muted-foreground" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
      {PRACTICE_TRACKS.length === 0 ? <p className="py-6 text-sm text-muted-foreground">아직 등록된 백킹트랙이 없습니다.</p> : null}
    </main>
  );
}
