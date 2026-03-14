import type { Song } from "@/lib/songs";

type ScoreViewerProps = {
  song: Song | null;
};

export function ScoreViewer({ song }: ScoreViewerProps) {
  if (!song) {
    return (
      <div className="flex min-h-[34rem] border border-dashed border-stone-300 bg-[#fbf7ef] p-8">
        <div className="flex w-full max-w-xl flex-col justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-stone-500 uppercase">
              Score viewer
            </p>
            <h2 className="mt-4 text-[2rem] leading-[1.08] font-semibold tracking-[-0.04em] text-stone-900">
              Select a song to open the working score.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
              The selected chart will appear here with summary, key, tempo, and
              section-by-section notation.
            </p>
          </div>
          <dl className="mt-10 grid gap-5 border-t border-stone-300/80 pt-5 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                View
              </dt>
              <dd className="mt-2 text-sm font-medium text-stone-900">
                Focused score
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                Includes
              </dt>
              <dd className="mt-2 text-sm font-medium text-stone-900">
                Metadata and sections
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                State
              </dt>
              <dd className="mt-2 text-sm font-medium text-stone-900">
                Waiting for selection
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  }

  return (
    <article className="border border-stone-300/80 bg-[#fffdf8] p-6 md:p-8">
      <div className="flex flex-col gap-5 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-stone-500 uppercase">
            Digitized score
          </p>
          <h2 className="text-[2.1rem] leading-[1.04] font-semibold tracking-[-0.04em] text-stone-950">
            {song.title}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-stone-600">
            {song.summary}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-l border-stone-200 pl-4 text-sm text-stone-700 sm:grid-cols-3 sm:border-l-0 sm:pl-0">
          <div className="sm:border-l sm:border-stone-200 sm:pl-4">
            <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
              Composer
            </dt>
            <dd className="mt-1 font-medium text-stone-900">{song.composer}</dd>
          </div>
          <div className="sm:border-l sm:border-stone-200 sm:pl-4">
            <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
              Key
            </dt>
            <dd className="mt-1 font-medium text-stone-900">
              {song.keySignature}
            </dd>
          </div>
          <div className="sm:border-l sm:border-stone-200 sm:pl-4">
            <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
              Tempo
            </dt>
            <dd className="mt-1 font-medium text-stone-900">{song.tempo}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 space-y-5">
        {song.sections.map((section) => (
          <section
            key={section.id}
            className="border border-stone-200 bg-[#fcfaf5] p-5"
          >
            <div className="flex flex-col gap-2 border-b border-stone-200 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                  Section
                </p>
                <h3 className="mt-1 text-lg font-semibold text-stone-900">
                  {section.title}
                </h3>
              </div>
              {section.annotation ? (
                <p className="text-sm text-stone-500">{section.annotation}</p>
              ) : null}
            </div>
            <div className="mt-4 space-y-2">
              {section.lines.map((line, index) => (
                <pre
                  key={`${section.id}-${index}`}
                  className="overflow-x-auto border border-stone-200/80 bg-[#fffdf9] px-4 py-3 font-mono text-sm leading-6 text-stone-700"
                >
                  {line}
                </pre>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
