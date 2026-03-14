import type { Metadata } from "next";
import { SongsWorkspace } from "./songs-workspace";

export const metadata: Metadata = {
  title: "Songs | One Five Eight",
  description: "Browse copied songs and open a lead-sheet style score viewer.",
};

export default function SongsPage() {
  return (
    <div className="min-h-screen bg-[#f6f1e8] px-5 py-6 font-[family-name:var(--font-geist-sans)] text-stone-900 md:px-8 md:py-8 lg:px-10 lg:py-10">
      <main className="mx-auto flex w-full max-w-[96rem] flex-col gap-5">
        <header className="border-b border-stone-300/80 pb-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
            <div className="max-w-[48rem] space-y-3">
              <p className="type-kicker text-stone-500">Songbook</p>
              <h1 className="type-display max-w-[42rem] text-[2.35rem] text-stone-950 md:text-[3.2rem]">
                Open the chart, read the form, and keep the chord flow visible.
              </h1>
              <p className="max-w-[38rem] text-sm leading-7 text-stone-600 md:text-[15px]">
                This workspace treats songs like copied lead sheets, with
                section systems, chord changes, repeats, and ending cues at the
                center of the page.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-l border-stone-300/80 pl-4 text-sm text-stone-700">
              <div>
                <dt className="type-meta-label-strong text-stone-500">
                  Surface
                </dt>
                <dd className="mt-2 font-medium text-stone-900">
                  Chart library
                </dd>
              </div>
              <div>
                <dt className="type-meta-label-strong text-stone-500">
                  Intent
                </dt>
                <dd className="mt-2 font-medium text-stone-900">
                  Fast lead-sheet lookup
                </dd>
              </div>
            </dl>
          </div>
        </header>
        <SongsWorkspace />
      </main>
    </div>
  );
}
