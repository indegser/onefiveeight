import type { Metadata } from "next";
import { SongsWorkspace } from "./songs-workspace";

export const metadata: Metadata = {
  title: "Songs | One Five Eight",
  description: "Browse copied songs and open a lead-sheet style score viewer.",
};

export default function SongsPage() {
  return (
    <div className="min-h-screen bg-[var(--tone-canvas)] px-5 py-6 font-[family-name:var(--font-body)] text-[var(--tone-text-primary)] md:px-8 md:py-8 lg:px-10 lg:py-10">
      <main className="mx-auto flex w-full max-w-[96rem] flex-col gap-[var(--space-5)]">
        <header className="border-b border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] pb-[var(--space-5)]">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
            <div className="max-w-[48rem] space-y-3">
              <p className="type-kicker text-[var(--tone-text-muted)]">Songbook</p>
              <h1 className="type-display max-w-[42rem] text-[2.35rem] text-[var(--tone-text-primary)] md:text-[3.2rem]">
                Open the chart, read the form, and keep the chord flow visible.
              </h1>
              <p className="max-w-[38rem] text-sm leading-7 text-[var(--tone-text-secondary)] md:text-[15px]">
                This workspace treats songs like copied lead sheets, with
                section systems, chord changes, repeats, and ending cues at the
                center of the page.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-l border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] pl-4 text-sm text-[var(--tone-text-secondary)]">
              <div>
                <dt className="type-meta-label-strong text-[var(--tone-text-muted)]">
                  Surface
                </dt>
                <dd className="mt-2 font-medium text-[var(--tone-text-primary)]">
                  Chart library
                </dd>
              </div>
              <div>
                <dt className="type-meta-label-strong text-[var(--tone-text-muted)]">
                  Intent
                </dt>
                <dd className="mt-2 font-medium text-[var(--tone-text-primary)]">
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
