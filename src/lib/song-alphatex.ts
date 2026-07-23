import type { Song, SongMeasure } from "@/lib/songs";

const BEATS_PER_MEASURE = 4;

function escapeAlphaTex(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function splitChordSymbols(measure: SongMeasure) {
  if (measure.chords?.length) {
    return measure.chords.map(({ chord, offset = 0 }) => ({ chord, offset }));
  }
  if (!measure.chord) return [];

  const symbols = measure.chord
    .replace(/\s*->\s*/g, " ")
    .split(/\s+(?=[A-G][#b]?)/)
    .filter(Boolean);

  return symbols.map((chord, index) => ({
    chord,
    offset: symbols.length === 1 ? 0 : index / symbols.length,
  }));
}

function chordAtBeat(measure: SongMeasure, beat: number) {
  return splitChordSymbols(measure).find(
    ({ offset }) =>
      Math.min(BEATS_PER_MEASURE - 1, Math.floor(offset * BEATS_PER_MEASURE)) ===
      beat,
  )?.chord;
}

function chordEffect(chord?: string) {
  return chord ? ` {ch "${escapeAlphaTex(chord)}"}` : "";
}

function emptyChordBeat(measure: SongMeasure, beat: number) {
  const chord = chordAtBeat(measure, beat);
  return `().4${chordEffect(chord)}`;
}

function measureToAlphaTex(measure: SongMeasure) {
  return Array.from({ length: BEATS_PER_MEASURE }, (_, beat) =>
    emptyChordBeat(measure, beat),
  ).join(" ");
}

function chordDefinitions(song: Song) {
  const symbols = new Set<string>();
  for (const section of song.sections) {
    for (const system of section.systems) {
      for (const measure of system.measures) {
        for (const { chord } of splitChordSymbols(measure)) symbols.add(chord);
      }
    }
  }

  return [...symbols]
    .map(
      (chord) =>
        `\\chord ("${escapeAlphaTex(chord)}") {showdiagram false}`,
    )
    .join("\n");
}

export function songToAlphaTex(song: Song) {
  const bars: string[] = [];

  for (const section of song.sections) {
    for (const system of section.systems) {
      for (const measure of system.measures) {
        bars.push(`${measureToAlphaTex(measure)} |`);
      }
    }
  }

  return `\\tempo 76
\\track "Chord Chart"
\\staff {score}
${chordDefinitions(song)}
.
${bars.join("\n")}`;
}
