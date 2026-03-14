import { getSongSystemCount, type Song, type SongSystem } from "@/lib/songs";

type ScoreViewerProps = {
  song: Song | null;
};

function normalizeChordText(chord: string) {
  return chord.replace(/\b([A-G][b#]?)M7\b/g, "$1maj7");
}

function splitChordText(chord: string) {
  const normalized = normalizeChordText(chord);

  if (normalized.includes("->")) {
    return {
      kind: "transition" as const,
      parts: normalized.split(/\s*->\s*/).filter(Boolean),
    };
  }

  const parts = normalized
    .split(/\s+(?=[A-G][#b]?(?:maj|m|sus|add|dim|aug|\d))/)
    .filter(Boolean);

  return {
    kind: parts.length > 1 ? ("group" as const) : ("single" as const),
    parts,
  };
}

function ChordLabel({ chord }: { chord?: string }) {
  if (!chord) {
    return (
      <p className="text-[1.05rem] leading-tight font-semibold tracking-[var(--tracking-display-sm)] text-[var(--tone-text-primary)]">
        N.C.
      </p>
    );
  }

  const display = splitChordText(chord);

  if (display.kind === "transition") {
    return (
      <div className="flex min-h-[1.5rem] flex-wrap items-center gap-x-1 gap-y-0.5 text-[0.92rem] leading-tight font-semibold tracking-[var(--tracking-display-sm)] text-[var(--tone-text-primary)]">
        {display.parts.map((part, index) => (
          <span
            key={`${part}-${index}`}
            className="inline-flex items-center gap-1"
          >
            {index > 0 ? (
              <span className="text-[8px] font-semibold tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
                to
              </span>
            ) : null}
            <span>{part}</span>
          </span>
        ))}
      </div>
    );
  }

  if (display.kind === "group") {
    return (
      <div className="flex min-h-[1.5rem] flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.92rem] leading-tight font-semibold tracking-[var(--tracking-display-sm)] text-[var(--tone-text-primary)]">
        {display.parts.map((part, index) => (
          <span
            key={`${part}-${index}`}
            className="inline-flex items-center gap-1"
          >
            {index > 0 ? (
              <span className="text-[8px] text-[var(--tone-text-muted)]" aria-hidden="true">
                /
              </span>
            ) : null}
            <span>{part}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <p className="min-h-[1.5rem] text-[1.02rem] leading-tight font-semibold tracking-[var(--tracking-display-sm)] text-[var(--tone-text-primary)]">
      {display.parts[0]}
    </p>
  );
}

function SystemRow({
  system,
  sectionTitle,
}: {
  system: SongSystem;
  sectionTitle: string;
}) {
  const totalUnits = system.measures.reduce(
    (count, measure) => count + (measure.span ?? 1),
    0,
  );
  const normalizedSectionTitle = sectionTitle.trim().toLowerCase();
  const normalizedSystemLabel = system.label?.trim().toLowerCase();
  const displayLabel =
    normalizedSystemLabel && normalizedSystemLabel !== normalizedSectionTitle
      ? system.label
      : undefined;
  const hasSidebar = Boolean(displayLabel || system.annotation);

  return (
    <div
      className={
        hasSidebar
          ? "grid gap-2 py-2 md:grid-cols-[4rem_minmax(0,1fr)]"
          : "py-2"
      }
    >
      {hasSidebar ? (
        <div className="flex items-start justify-between gap-3 md:block">
          {displayLabel ? (
            <p className="text-[11px] font-semibold tracking-[var(--tracking-label)] text-[var(--tone-text-muted)]">
              {displayLabel}
            </p>
          ) : null}
          {system.annotation ? (
            <p className="max-w-[10rem] text-right text-xs leading-5 text-[var(--tone-text-muted)] md:mt-2 md:text-left">
              {system.annotation}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {system.timeSignature ? (
            <span className="border border-[var(--tone-border)] bg-[var(--tone-surface-alt)] px-1.5 py-0.5 text-[9px] font-semibold tracking-[var(--tracking-meta)] text-[var(--tone-text-secondary)]">
              {system.timeSignature}
            </span>
          ) : null}
          {system.repeat ? (
            <span className="border border-[var(--tone-border)] bg-[var(--tone-surface-alt)] px-1.5 py-0.5 text-[9px] font-semibold tracking-[var(--tracking-meta)] text-[var(--tone-text-secondary)]">
              {system.repeat}
            </span>
          ) : null}
          {system.jump ? (
            <span className="border border-[var(--tone-border)] bg-[color:color-mix(in_srgb,var(--tone-accent-soft)_55%,var(--tone-canvas))] px-1.5 py-0.5 text-[9px] font-semibold tracking-[var(--tracking-meta)] text-[var(--tone-text-primary)]">
              {system.jump}
            </span>
          ) : null}
          {system.ending ? (
            <span className="border border-[var(--tone-border)] bg-[color:color-mix(in_srgb,var(--tone-canvas)_85%,white)] px-1.5 py-0.5 text-[9px] font-semibold tracking-[var(--tracking-meta)] text-[var(--tone-text-secondary)]">
              {system.ending}
            </span>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full border-y border-[color:color-mix(in_srgb,var(--tone-border)_90%,transparent)] bg-[color:color-mix(in_srgb,var(--tone-surface)_60%,white)] py-0.5">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${totalUnits}, minmax(0, 1fr))`,
              }}
            >
              {system.measures.map((measure) => (
                <div
                  key={measure.id}
                  className="flex min-h-[3.15rem] flex-col justify-between gap-1.5 border-l border-[color:color-mix(in_srgb,var(--tone-text-muted)_80%,transparent)] px-2 py-1.5 first:border-l-0"
                  style={{ gridColumn: `span ${measure.span ?? 1}` }}
                >
                  <ChordLabel chord={measure.chord} />
                  {measure.cue ? (
                    <p className="text-[10px] font-medium tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
                      {measure.cue}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {system.footer ? (
          <p className="text-xs leading-5 text-[var(--tone-text-muted)]">{system.footer}</p>
        ) : null}
      </div>
    </div>
  );
}

export function ScoreViewer({ song }: ScoreViewerProps) {
  if (!song) {
    return (
      <div className="flex min-h-[42rem] border border-dashed border-[var(--tone-border)] bg-[color:color-mix(in_srgb,var(--tone-surface)_85%,var(--tone-canvas))] p-8">
        <div className="flex w-full max-w-2xl flex-col justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[var(--tone-text-muted)]">
              Lead sheet viewer
            </p>
            <h2 className="mt-4 max-w-xl text-[2rem] leading-[var(--leading-display)] font-semibold tracking-[var(--tracking-display-lg)] text-[var(--tone-text-primary)]">
              Select a chart to open the digital lead sheet.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[var(--tone-text-secondary)]">
              The selected song will open as section groups, system rows, and
              measure-level chord changes with repeats, cues, and ending
              directives.
            </p>
          </div>
          <dl className="mt-10 grid gap-5 border-t border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] pt-5 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
                Format
              </dt>
              <dd className="mt-2 text-sm font-medium text-[var(--tone-text-primary)]">
                Lead-sheet systems
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
                Includes
              </dt>
              <dd className="mt-2 text-sm font-medium text-[var(--tone-text-primary)]">
                Repeats, cues, meter
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
                State
              </dt>
              <dd className="mt-2 text-sm font-medium text-[var(--tone-text-primary)]">
                Waiting for selection
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  }

  return (
    <article className="border border-[color:color-mix(in_srgb,var(--tone-border)_80%,transparent)] bg-[color:color-mix(in_srgb,var(--tone-surface)_60%,white)] p-6 md:p-8">
      <div className="flex flex-col gap-[var(--space-5)] border-b border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[var(--tracking-label)] text-[var(--tone-text-muted)]">
            Digital lead sheet
          </p>
          <h2 className="text-[2.15rem] leading-[1.02] font-semibold tracking-[var(--tracking-display-lg)] text-[var(--tone-text-primary)]">
            {song.title}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-[var(--tone-text-secondary)]">
            {song.summary}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-l border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] pl-4 text-sm text-[var(--tone-text-secondary)] sm:grid-cols-4 sm:border-l-0 sm:pl-0">
          <div className="sm:border-l sm:border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] sm:pl-4">
            <dt className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
              Artist
            </dt>
            <dd className="mt-1 font-medium text-[var(--tone-text-primary)]">{song.artist}</dd>
          </div>
          <div className="sm:border-l sm:border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] sm:pl-4">
            <dt className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">Key</dt>
            <dd className="mt-1 font-medium text-[var(--tone-text-primary)]">
              {song.keyCenter}
            </dd>
          </div>
          <div className="sm:border-l sm:border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] sm:pl-4">
            <dt className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
              Feel
            </dt>
            <dd className="mt-1 font-medium text-[var(--tone-text-primary)]">{song.feel}</dd>
          </div>
          <div className="sm:border-l sm:border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] sm:pl-4">
            <dt className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
              Meter
            </dt>
            <dd className="mt-1 font-medium text-[var(--tone-text-primary)]">{song.meter}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 grid gap-4 border-b border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] pb-5 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border-l border-[var(--tone-border)] pl-3">
            <p className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
              Source
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--tone-text-primary)]">
              {song.source}
            </p>
          </div>
          <div className="border-l border-[var(--tone-border)] pl-3">
            <p className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
              Sections
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--tone-text-primary)]">
              {song.sections.length}
            </p>
          </div>
          <div className="border-l border-[var(--tone-border)] pl-3">
            <p className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
              Systems
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--tone-text-primary)]">
              {getSongSystemCount(song)}
            </p>
          </div>
        </div>
        <div className="border-l border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] pl-4">
          <p className="text-[11px] tracking-[var(--tracking-meta)] text-[var(--tone-text-muted)]">
            Chart notes
          </p>
          <div className="mt-2 space-y-2 text-sm leading-6 text-[var(--tone-text-secondary)]">
            {song.chartNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)]">
        {song.sections.map((section) => (
          <section key={section.id} className="border-b border-[color:color-mix(in_srgb,var(--tone-border)_55%,white)] py-4">
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-sm font-semibold tracking-[var(--tracking-meta)] text-[var(--tone-text-secondary)]">
                {section.title}
              </h3>
              {section.annotation ? (
                <p className="text-xs leading-5 text-[var(--tone-text-muted)]">
                  {section.annotation}
                </p>
              ) : null}
            </div>
            <div>
              {section.systems.map((system) => (
                <SystemRow
                  key={system.id}
                  system={system}
                  sectionTitle={section.title}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
