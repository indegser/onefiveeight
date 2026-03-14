import type { Song } from "@/lib/songs";

type ScoreViewerProps = {
  song: Song | null;
};

export function ScoreViewer({ song }: ScoreViewerProps) {
  if (!song) {
    return (
      <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-[2rem] border border-dashed border-gray-300 bg-gray-50 px-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-400">
          Score Viewer
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          Pick a song from the library
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
          The digitized chart will appear here with key, tempo, and section-by-section notation once you select a song.
        </p>
      </div>
    );
  }

  return (
    <article className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
            Digitized Score
          </p>
          <h2 className="text-3xl font-semibold text-gray-950">{song.title}</h2>
          <p className="text-sm text-gray-500">{song.summary}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm text-gray-600 sm:grid-cols-3">
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-gray-400">
              Composer
            </dt>
            <dd className="mt-1 font-medium text-gray-900">{song.composer}</dd>
          </div>
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-gray-400">
              Key
            </dt>
            <dd className="mt-1 font-medium text-gray-900">
              {song.keySignature}
            </dd>
          </div>
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-gray-400">
              Tempo
            </dt>
            <dd className="mt-1 font-medium text-gray-900">{song.tempo}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 space-y-5">
        {song.sections.map((section) => (
          <section
            key={section.id}
            className="rounded-[1.5rem] border border-gray-200 bg-gray-50/70 p-5"
          >
            <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>
              {section.annotation ? (
                <p className="text-sm text-gray-500">{section.annotation}</p>
              ) : null}
            </div>
            <div className="mt-4 space-y-2">
              {section.lines.map((line, index) => (
                <pre
                  key={`${section.id}-${index}`}
                  className="overflow-x-auto rounded-2xl bg-white px-4 py-3 font-mono text-sm leading-6 text-gray-700"
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
