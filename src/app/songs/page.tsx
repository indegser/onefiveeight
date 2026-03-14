import type { Metadata } from "next";
import { SongsWorkspace } from "./songs-workspace";

export const metadata: Metadata = {
  title: "Songs | One Five Eight",
  description: "Browse copied songs and open a digitized score viewer.",
};

export default function SongsPage() {
  return (
    <div className="min-h-screen bg-[#f6f1e8] px-5 py-6 font-[family-name:var(--font-geist-sans)] text-stone-900 md:px-8 md:py-8 lg:px-10 lg:py-10">
      <main className="mx-auto flex w-full max-w-[96rem] flex-col gap-5">
        <header className="border-b border-stone-300/80 pb-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
            <div className="max-w-[48rem] space-y-3">
              <p className="text-xs font-semibold tracking-[0.28em] text-stone-500 uppercase">
                Songbook
              </p>
              <h1 className="max-w-[42rem] text-[2.35rem] leading-[1.05] font-semibold tracking-[-0.04em] text-stone-950 md:text-[3.2rem]">
                Scan the library, keep your place, and open one chart at a time.
              </h1>
              <p className="max-w-[38rem] text-sm leading-7 text-stone-600 md:text-[15px]">
                Keep copied songs visible while the selected score opens into a
                focused reading pane built for quick comparison.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-l border-stone-300/80 pl-4 text-sm text-stone-700">
              <div>
                <dt className="text-[11px] tracking-[0.2em] text-stone-500 uppercase">
                  Surface
                </dt>
                <dd className="mt-2 font-medium text-stone-900">List detail</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.2em] text-stone-500 uppercase">
                  Intent
                </dt>
                <dd className="mt-2 font-medium text-stone-900">
                  Fast score lookup
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
