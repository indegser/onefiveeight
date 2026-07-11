import type { Song, SongChordEvent, SongMeasure, SongSystem } from "@/lib/songs";
import type { CSSProperties } from "react";

type PositionedMeasure = {
  measure: SongMeasure;
  index: number;
  unitStart: number;
  unitWidth: number;
};

const SIDE_LABEL_WIDTH = 54;
const CLEF_WIDTH = 34;
const MEASURE_WIDTH = 96;
const ROW_MEASURE_COUNT = 4;
const ROW_HEIGHT = 92;
const STAFF_TOP = 44;
const CHORD_TOP = 9;
const LINE_GAP = 7;
const INK = "#29241f";
const STAFF_INK = "#5f574f";

function getMeasureSpan(measure: SongMeasure) {
  return Math.max(1, Math.round(measure.span ?? 1));
}

function getStaffWidth() {
  return CLEF_WIDTH + ROW_MEASURE_COUNT * MEASURE_WIDTH;
}

function toStaffPercent(value: number) {
  return `${(value / getStaffWidth()) * 100}%`;
}

function getExpandedMeasures(system: SongSystem) {
  return system.measures.flatMap((measure) => {
    const span = getMeasureSpan(measure);

    if (span === 1) {
      return [measure];
    }

    const firstMeasure = {
      ...measure,
      barline: undefined,
      footer: undefined,
      jump: undefined,
      repeatEnd: undefined,
    };
    const continuationMeasures = Array.from(
      { length: span - 1 },
      (_, index) =>
        ({
          id: `${measure.id}-span-${index + 1}`,
          ...(index === span - 2
            ? {
                barline: measure.barline,
                footer: measure.footer,
                jump: measure.jump,
                repeatEnd: measure.repeatEnd,
              }
            : {}),
        }) satisfies SongMeasure,
    );

    return [firstMeasure, ...continuationMeasures];
  });
}

function chunkSystemRows(system: SongSystem) {
  const expandedMeasures = getExpandedMeasures(system);
  const rows: SongSystem[] = [];

  for (let index = 0; index < expandedMeasures.length; index += ROW_MEASURE_COUNT) {
    rows.push({
      ...system,
      id: `${system.id}-row-${rows.length + 1}`,
      label: rows.length === 0 ? system.label : undefined,
      measures: expandedMeasures.slice(index, index + ROW_MEASURE_COUNT),
    });
  }

  return rows.length > 0
    ? rows
    : [
        {
          ...system,
          id: `${system.id}-row-1`,
          measures: [],
        },
      ];
}

function getPositionedMeasures(system: SongSystem): PositionedMeasure[] {
  const positionedMeasures = system.measures.map((measure, index) => ({
    measure,
    index,
    unitStart: index,
    unitWidth: 1,
  }));
  const paddingCount = Math.max(0, ROW_MEASURE_COUNT - positionedMeasures.length);
  const paddingMeasures = Array.from({ length: paddingCount }, (_, index) => ({
    measure: {
      id: `${system.id}-pad-${index + 1}`,
    } satisfies SongMeasure,
    index: positionedMeasures.length + index,
    unitStart: positionedMeasures.length + index,
    unitWidth: 1,
  }));

  return [...positionedMeasures, ...paddingMeasures];
}

function formatChord(chord: string) {
  return chord
    .replace(/\b([A-G])b/g, "$1♭")
    .replace(/\b([A-G])#/g, "$1♯")
    .replace(/\/([A-G])b/g, "/$1♭")
    .replace(/\/([A-G])#/g, "/$1♯")
    .replace(/b(\d|\))/g, "♭$1")
    .replace(/#(\d|\))/g, "♯$1")
    .replace(/\b([A-G][♭♯]?)M7\b/g, "$1maj7");
}

function splitChordString(chord: string): SongChordEvent[] {
  const parts = chord
    .replace(/\s*->\s*/g, " ")
    .split(/\s+(?=[A-G][#b]?(?:M|maj|m|sus|add|dim|aug|\d|\/))/)
    .filter(Boolean);

  return parts.map((part, index) => ({
    id: `${part}-${index}`,
    chord: part,
    offset: parts.length === 1 ? 0.1 : 0.1 + index * (0.72 / (parts.length - 1)),
  }));
}

function getChordEvents(measure: SongMeasure) {
  if (measure.chords?.length) {
    return measure.chords;
  }

  if (!measure.chord) {
    return [];
  }

  return splitChordString(measure.chord);
}

function getDisplayRowLabel(system: SongSystem, sectionTitle: string) {
  const label = system.label?.trim();

  if (!label) {
    return "";
  }

  if (label.toLowerCase() === sectionTitle.trim().toLowerCase()) {
    return "";
  }

  if (/^\d+\.$/.test(label)) {
    return "";
  }

  return label;
}

function StaffSvg({ system }: { system: SongSystem }) {
  const staffWidth = getStaffWidth();
  const staffLineStart = CLEF_WIDTH;
  const staffLineEnd = staffWidth;
  const measures = getPositionedMeasures(system);

  return (
    <svg
      aria-hidden="true"
      className="absolute top-0 block"
      height={ROW_HEIGHT}
      style={{
        left: `${SIDE_LABEL_WIDTH}px`,
        width: `calc(100% - ${SIDE_LABEL_WIDTH}px)`,
      }}
      viewBox={`0 0 ${staffWidth} ${ROW_HEIGHT}`}
      width={staffWidth}
    >
      <g stroke={INK} fill="none" vectorEffect="non-scaling-stroke">
        <line
          x1={CLEF_WIDTH - 17}
          x2={CLEF_WIDTH - 17}
          y1={STAFF_TOP - 15}
          y2={STAFF_TOP + 42}
          strokeWidth="1.7"
        />
        <ellipse
          cx={CLEF_WIDTH - 5}
          cy={STAFF_TOP + LINE_GAP * 2}
          rx="13"
          ry="20"
          strokeWidth="1.6"
        />
        <path
          d={`M ${CLEF_WIDTH - 16} ${STAFF_TOP + 22} C ${CLEF_WIDTH - 6} ${STAFF_TOP + 4}, ${CLEF_WIDTH + 6} ${STAFF_TOP + 4}, ${CLEF_WIDTH + 2} ${STAFF_TOP + 18}`}
          strokeWidth="1.4"
        />
      </g>

      <g stroke={STAFF_INK} vectorEffect="non-scaling-stroke">
        {Array.from({ length: 5 }, (_, index) => (
          <line
            key={index}
            x1={staffLineStart}
            x2={staffLineEnd}
            y1={STAFF_TOP + index * LINE_GAP}
            y2={STAFF_TOP + index * LINE_GAP}
            strokeWidth="1"
          />
        ))}
      </g>

      <Barline x={staffLineStart} variant={measures[0]?.measure.repeatStart ? "repeat-start" : "single"} />
      {measures.map((measure) => {
        const x = staffLineStart + (measure.unitStart + measure.unitWidth) * MEASURE_WIDTH;
        const variant = measure.measure.repeatEnd
          ? "repeat-end"
          : measure.measure.barline ?? "single";

        return <Barline key={measure.measure.id} x={x} variant={variant} />;
      })}
    </svg>
  );
}

function Barline({
  x,
  variant,
}: {
  x: number;
  variant?: "single" | "double" | "final" | "repeat-start" | "repeat-end";
}) {
  const top = STAFF_TOP - 1;
  const bottom = STAFF_TOP + LINE_GAP * 4 + 1;

  if (variant === "double") {
    return (
      <g stroke={INK} vectorEffect="non-scaling-stroke">
        <line x1={x - 4} x2={x - 4} y1={top} y2={bottom} strokeWidth="1.2" />
        <line x1={x} x2={x} y1={top} y2={bottom} strokeWidth="1.2" />
      </g>
    );
  }

  if (variant === "final") {
    return (
      <g stroke={INK} vectorEffect="non-scaling-stroke">
        <line x1={x - 5} x2={x - 5} y1={top} y2={bottom} strokeWidth="1.1" />
        <line x1={x} x2={x} y1={top} y2={bottom} strokeWidth="3" />
      </g>
    );
  }

  if (variant === "repeat-start") {
    return (
      <g stroke={INK} fill={INK} vectorEffect="non-scaling-stroke">
        <line x1={x} x2={x} y1={top} y2={bottom} strokeWidth="3" />
        <line x1={x + 5} x2={x + 5} y1={top} y2={bottom} strokeWidth="1.1" />
        <circle cx={x + 12} cy={STAFF_TOP + LINE_GAP * 1.45} r="1.8" />
        <circle cx={x + 12} cy={STAFF_TOP + LINE_GAP * 2.55} r="1.8" />
      </g>
    );
  }

  if (variant === "repeat-end") {
    return (
      <g stroke={INK} fill={INK} vectorEffect="non-scaling-stroke">
        <circle cx={x - 12} cy={STAFF_TOP + LINE_GAP * 1.45} r="1.8" />
        <circle cx={x - 12} cy={STAFF_TOP + LINE_GAP * 2.55} r="1.8" />
        <line x1={x - 5} x2={x - 5} y1={top} y2={bottom} strokeWidth="1.1" />
        <line x1={x} x2={x} y1={top} y2={bottom} strokeWidth="3" />
      </g>
    );
  }

  return (
    <line
      x1={x}
      x2={x}
      y1={top}
      y2={bottom}
      stroke={INK}
      strokeWidth="1.05"
      vectorEffect="non-scaling-stroke"
    />
  );
}

function ChordLayer({ system }: { system: SongSystem }) {
  const measures = getPositionedMeasures(system);

  return (
    <div
      aria-hidden="true"
      className="absolute top-0 bottom-0"
      style={{
        left: `${SIDE_LABEL_WIDTH}px`,
        width: `calc(100% - ${SIDE_LABEL_WIDTH}px)`,
      }}
    >
      {measures.flatMap((measure) => {
        const chordEvents = getChordEvents(measure.measure);
        const measureLeft = CLEF_WIDTH + measure.unitStart * MEASURE_WIDTH;
        const measureWidth = measure.unitWidth * MEASURE_WIDTH;
        const isDense = chordEvents.length >= 4;

        return chordEvents.map((event, index) => {
          const offset = event.offset ?? 0.1;
          const left = measureLeft + offset * measureWidth;
          const top = isDense && index >= 2 ? CHORD_TOP + 15 : CHORD_TOP;

          return (
            <span
              key={`${measure.measure.id}-${event.id}`}
              className="absolute whitespace-nowrap font-semibold tracking-[0] text-[var(--tone-text-primary)]"
              style={{
                left: toStaffPercent(left),
                top: `${top}px`,
                fontSize: isDense ? "10px" : chordEvents.length >= 3 ? "11px" : "12px",
                lineHeight: "1",
              }}
              title={formatChord(event.chord)}
            >
              {formatChord(event.chord)}
            </span>
          );
        });
      })}
    </div>
  );
}

function MarksLayer({ system }: { system: SongSystem }) {
  const measures = getPositionedMeasures(system);

  return (
    <div
      aria-hidden="true"
      className="absolute top-0 bottom-0"
      style={{
        left: `${SIDE_LABEL_WIDTH}px`,
        width: `calc(100% - ${SIDE_LABEL_WIDTH}px)`,
      }}
    >
      {measures.map((measure) => {
        const left = CLEF_WIDTH + measure.unitStart * MEASURE_WIDTH;
        const width = measure.unitWidth * MEASURE_WIDTH;

        return (
          <div key={measure.measure.id}>
            {measure.measure.ending ? (
              <div
                className="absolute border-t border-l border-[var(--tone-text-primary)] text-[11px] leading-none font-semibold tracking-[0] text-[var(--tone-text-primary)]"
                style={{
                  left: toStaffPercent(left + 5),
                  top: "0px",
                  width: toStaffPercent(width - 10),
                  height: "16px",
                  paddingLeft: "5px",
                  paddingTop: "2px",
                }}
              >
                {measure.measure.ending}
              </div>
            ) : null}
            {measure.measure.timeSignature ? (
              <span
                className="absolute text-sm leading-none font-bold tracking-[0] text-[var(--tone-text-primary)]"
              style={{ left: toStaffPercent(left + 8), top: `${STAFF_TOP + 36}px` }}
              >
                {measure.measure.timeSignature}
              </span>
            ) : null}
            {measure.measure.jump ? (
              <span
                className="absolute text-xs leading-none font-semibold tracking-[0] text-[var(--tone-text-muted)]"
                style={{ left: toStaffPercent(left + 8), top: `${STAFF_TOP + 38}px` }}
              >
                {measure.measure.jump}
              </span>
            ) : null}
            {measure.measure.footer ? (
              <span
                className="absolute text-xs leading-none font-semibold tracking-[0] text-[var(--tone-text-muted)]"
                style={{ left: toStaffPercent(left + 8), top: `${STAFF_TOP + 38}px` }}
              >
                {measure.measure.footer}
              </span>
            ) : null}
            {measure.measure.cue ? (
              <span
                className="absolute text-xs leading-none font-semibold tracking-[0] text-[var(--tone-text-muted)]"
                style={{ left: toStaffPercent(left + 8), top: `${STAFF_TOP + 32}px` }}
              >
                {measure.measure.cue}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function LeadSheetSystem({
  system,
  sectionTitle,
}: {
  system: SongSystem;
  sectionTitle: string;
}) {
  const rowLabel = getDisplayRowLabel(system, sectionTitle);

  return (
    <div className="overflow-x-auto py-0.5">
      <div
        data-lead-sheet-row="true"
        data-measure-count={ROW_MEASURE_COUNT}
        data-measure-width-mode="responsive"
        className="relative"
        style={
          {
            height: `${ROW_HEIGHT}px`,
            width: "100%",
          } as CSSProperties
        }
      >
        <div
          className="absolute left-0 text-xs leading-none font-semibold tracking-[0] text-[var(--tone-text-muted)]"
          style={{
            top: `${STAFF_TOP + 13}px`,
            width: `${SIDE_LABEL_WIDTH - 10}px`,
          }}
        >
          {rowLabel}
        </div>
        <StaffSvg system={system} />
        <ChordLayer system={system} />
        <MarksLayer system={system} />
      </div>
    </div>
  );
}

export function LeadSheetRenderer({ song }: { song: Song }) {
  return (
    <div className="pt-4">
      <div className="space-y-3">
        {song.sections.map((section) => (
          <section key={section.id} aria-label={section.title}>
            <div className="mb-0.5 flex items-baseline justify-between gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--tone-text-muted)]">
                {section.title}
              </h4>
              {section.annotation ? (
                <p className="text-xs leading-5 text-[var(--tone-text-muted)]">
                  {section.annotation}
                </p>
              ) : null}
            </div>
            <div>
              {section.systems.flatMap((system) =>
                chunkSystemRows(system).map((row) => (
                  <LeadSheetSystem
                    key={row.id}
                    system={row}
                    sectionTitle={section.title}
                  />
                )),
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
