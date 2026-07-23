import type { Metadata } from "next";
import Link from "next/link";
import { MusicFontLab } from "./music-font-lab";

export const metadata: Metadata = {
  title: "Music Font Lab | One Five Eight",
  description: "Compare SMuFL music engraving fonts in alphaTab.",
};

export default function MusicFontsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-gray-400 uppercase">
            Score style test
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
            악보 폰트 비교
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            오선, TAB, 음표, 쉼표, 임시표, 반복기호와 연주 기호를 같은
            악보에서 비교합니다.
          </p>
        </div>
        <Link
          href="/songs/gieog-ui-seupjak"
          className="text-sm font-medium text-gray-500 underline underline-offset-4 hover:text-gray-950"
        >
          Songs 코드 차트로 돌아가기
        </Link>
      </div>
      <MusicFontLab />
    </main>
  );
}
