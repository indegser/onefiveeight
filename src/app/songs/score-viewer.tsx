import { getSongSystemCount, type Song, type SongSystem } from "@/lib/songs";

type ScoreViewerProps = {
  song: Song | null;
};

function SystemRow({ system }: { system: SongSystem }) {
  const totalUnits = system.measures.reduce(
    (count, measure) => count + (measure.span ?? 1),
    0,
  );

  return (
    <div className="grid gap-3 py-3 md:grid-cols-[4.75rem_minmax(0,1fr)]">
      <div className="flex items-start justify-between gap-3 md:block">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-stone-500 uppercase">
          {system.label ?? "System"}
        </p>
        {system.annotation ? (
          <p className="max-w-[10rem] text-right text-xs leading-5 text-stone-500 md:mt-2 md:text-left">
            {system.annotation}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {system.timeSignature ? (
            <span className="border border-stone-300 bg-[#f3ecde] px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-stone-700 uppercase">
              {system.timeSignature}
            </span>
          ) : null}
          {system.repeat ? (
            <span className="border border-stone-300 bg-[#f3ecde] px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-stone-700 uppercase">
              {system.repeat}
            </span>
          ) : null}
          {system.jump ? (
            <span className="border border-stone-300 bg-[#efe1c4] px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-stone-800 uppercase">
              {system.jump}
            </span>
          ) : null}
          {system.ending ? (
            <span className="border border-stone-300 bg-[#f8f1e5] px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-stone-700 uppercase">
              {system.ending}
            </span>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[34rem] border-y border-stone-300/90 bg-[#fffdf8] py-1">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${totalUnits}, minmax(5.75rem, 1fr))`,
              }}
            >
              {system.measures.map((measure) => (
                <div
                  key={measure.id}
                  className="flex min-h-[4.25rem] flex-col justify-between border-l border-stone-400/80 px-3 py-2 first:border-l-0"
                  style={{ gridColumn: `span ${measure.span ?? 1}` }}
                >
                  <p className="text-lg leading-none font-semibold tracking-[-0.03em] text-stone-950">
                    {measure.chord ?? "N.C."}
                  </p>
                  {measure.cue ? (
                    <p className="text-[11px] font-medium tracking-[0.18em] text-stone-500 uppercase">
                      {measure.cue}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {system.footer ? (
          <p className="text-xs leading-5 text-stone-500">{system.footer}</p>
        ) : null}
      </div>
    </div>
  );
}

export function ScoreViewer({ song }: ScoreViewerProps) {
  if (!song) {
    return (
      <div className="flex min-h-[42rem] border border-dashed border-stone-300 bg-[#fbf7ef] p-8">
        <div className="flex w-full max-w-2xl flex-col justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-stone-500 uppercase">
              Lead sheet viewer
            </p>
            <h2 className="mt-4 max-w-xl text-[2rem] leading-[1.05] font-semibold tracking-[-0.04em] text-stone-900">
              Select a chart to open the digital lead sheet.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
              The selected song will open as section groups, system rows, and
              measure-level chord changes with repeats, cues, and ending
              directives.
            </p>
          </div>
          <dl className="mt-10 grid gap-5 border-t border-stone-300/80 pt-5 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                Format
              </dt>
              <dd className="mt-2 text-sm font-medium text-stone-900">
                Lead-sheet systems
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
                Includes
              </dt>
              <dd className="mt-2 text-sm font-medium text-stone-900">
                Repeats, cues, meter
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
            Digital lead sheet
          </p>
          <h2 className="text-[2.15rem] leading-[1.02] font-semibold tracking-[-0.04em] text-stone-950">
            {song.title}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-stone-600">
            {song.summary}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-l border-stone-200 pl-4 text-sm text-stone-700 sm:grid-cols-4 sm:border-l-0 sm:pl-0">
          <div className="sm:border-l sm:border-stone-200 sm:pl-4">
            <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
              Artist
            </dt>
            <dd className="mt-1 font-medium text-stone-900">{song.artist}</dd>
          </div>
          <div className="sm:border-l sm:border-stone-200 sm:pl-4">
            <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
              Key
            </dt>
            <dd className="mt-1 font-medium text-stone-900">
              {song.keyCenter}
            </dd>
          </div>
          <div className="sm:border-l sm:border-stone-200 sm:pl-4">
            <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
              Feel
            </dt>
            <dd className="mt-1 font-medium text-stone-900">{song.feel}</dd>
          </div>
          <div className="sm:border-l sm:border-stone-200 sm:pl-4">
            <dt className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
              Meter
            </dt>
            <dd className="mt-1 font-medium text-stone-900">{song.meter}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 grid gap-4 border-b border-stone-200 pb-5 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border-l border-stone-300 pl-3">
            <p className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
              Source
            </p>
            <p className="mt-2 text-sm font-medium text-stone-900">
              {song.source}
            </p>
          </div>
          <div className="border-l border-stone-300 pl-3">
            <p className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
              Sections
            </p>
            <p className="mt-2 text-sm font-medium text-stone-900">
              {song.sections.length}
            </p>
          </div>
          <div className="border-l border-stone-300 pl-3">
            <p className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
              Systems
            </p>
            <p className="mt-2 text-sm font-medium text-stone-900">
              {getSongSystemCount(song)}
            </p>
          </div>
        </div>
        <div className="border-l border-stone-200 pl-4">
          <p className="text-[11px] tracking-[0.18em] text-stone-500 uppercase">
            Chart notes
          </p>
          <div className="mt-2 space-y-2 text-sm leading-6 text-stone-600">
            {song.chartNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-stone-200">
        {song.sections.map((section) => (
          <section key={section.id} className="border-b border-stone-200 py-4">
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-sm font-semibold tracking-[0.18em] text-stone-700 uppercase">
                {section.title}
              </h3>
              {section.annotation ? (
                <p className="text-xs leading-5 text-stone-500">
                  {section.annotation}
                </p>
              ) : null}
            </div>
            <div>
              {section.systems.map((system) => (
                <SystemRow key={system.id} system={system} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
