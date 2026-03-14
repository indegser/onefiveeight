import * as TonalKey from "@tonaljs/key";
import * as TonalNote from "@tonaljs/note";
import type {
  NormalizedLeadSheet,
  ProbableKey,
} from "../schemas/music-analysis";

const KEY_CANDIDATES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

type MeasureSnapshot = {
  measureId: string;
  roots: string[];
};

function getMeasureSnapshots(leadSheet: NormalizedLeadSheet): MeasureSnapshot[] {
  return leadSheet.sections.flatMap((section) =>
    section.systems.flatMap((system) =>
      system.measures.map((measure) => ({
        measureId: measure.measureId,
        roots: measure.chordEvents
          .map((event) => event.root)
          .filter((root): root is string => Boolean(root)),
      })),
    ),
  );
}

function getRootStream(measures: MeasureSnapshot[]) {
  return measures.flatMap((measure) => measure.roots);
}

function uniquePitchClasses(notes: readonly string[]) {
  return Array.from(
    new Set(notes.map((note) => TonalNote.pitchClass(note) ?? note)),
  );
}

function getPrimaryRootsPerMeasure(measures: MeasureSnapshot[]) {
  return measures
    .map((measure) => measure.roots[0])
    .filter((root): root is string => Boolean(root));
}

function getPitchClass(note: string) {
  return TonalNote.pitchClass(note) ?? note;
}

function scoreKeyCandidate(
  tonic: string,
  mode: "major" | "minor",
  measures: MeasureSnapshot[],
) {
  const roots = getRootStream(measures);
  const primaryRoots = getPrimaryRootsPerMeasure(measures);
  const scale =
    mode === "major"
      ? uniquePitchClasses(TonalKey.majorKey(tonic).scale)
      : uniquePitchClasses(TonalKey.minorKey(tonic).natural.scale);
  const tonicPitchClass = getPitchClass(tonic);
  let score = 0;

  for (const root of roots) {
    const pitchClass = getPitchClass(root);

    if (pitchClass === tonicPitchClass) {
      score += 1.5;
      continue;
    }

    if (scale.includes(pitchClass)) {
      score += 0.9;
      continue;
    }

    score -= 0.6;
  }

  for (const root of primaryRoots) {
    const pitchClass = getPitchClass(root);

    if (pitchClass === tonicPitchClass) {
      score += 1.4;
    }
  }

  const openingWindow = primaryRoots.slice(0, 4).map(getPitchClass);
  const closingWindow = primaryRoots.slice(-4).map(getPitchClass);
  const midpointWindow = primaryRoots
    .slice(
      Math.max(0, Math.floor(primaryRoots.length / 2) - 2),
      Math.max(0, Math.floor(primaryRoots.length / 2) + 2),
    )
    .map(getPitchClass);

  if (openingWindow.includes(tonicPitchClass)) {
    score += 3;
  }

  if (closingWindow.includes(tonicPitchClass)) {
    score += 4;
  }

  if (midpointWindow.includes(tonicPitchClass)) {
    score += 1;
  }

  const tonicMeasureCount = primaryRoots.filter(
    (root) => getPitchClass(root) === tonicPitchClass,
  ).length;

  score += tonicMeasureCount * 0.75;

  const dominantPitchClass =
    mode === "major"
      ? getPitchClass(TonalNote.transpose(tonic, "5P"))
      : getPitchClass(TonalNote.transpose(tonic, "5P"));

  const strongCadenceCount = measures.filter((measure) => {
    const pcs = measure.roots.map(getPitchClass);

    return pcs.includes(dominantPitchClass) && pcs.includes(tonicPitchClass);
  }).length;

  score += strongCadenceCount * 0.6;

  return score;
}

export function estimateProbableKey(leadSheet: NormalizedLeadSheet): ProbableKey {
  const measures = getMeasureSnapshots(leadSheet);
  const roots = getRootStream(measures);

  if (!roots.length) {
    return {
      tonic: "Unknown",
      mode: "unknown",
      confidence: 0.1,
      rationale: ["No readable chord roots were available for key estimation."],
      alternatives: [],
    };
  }

  const ranked = KEY_CANDIDATES.flatMap((tonic) => {
    const majorScore = scoreKeyCandidate(tonic, "major", measures);
    const minorScore = scoreKeyCandidate(tonic, "minor", measures);

    return [
      { tonic, mode: "major" as const, score: majorScore },
      { tonic, mode: "minor" as const, score: minorScore },
    ];
  }).sort((left, right) => right.score - left.score);

  const [best, next] = ranked;
  const margin = Math.max(best.score - (next?.score ?? 0), 0);
  const confidence = Math.max(0.2, Math.min(0.95, 0.45 + margin / 8));

  return {
    tonic: best.tonic,
    mode: best.mode,
    confidence,
    rationale: [
      `Estimated from ${roots.length} readable chord roots.`,
      "Weighted whole-form tonic gravity above local tonicization, with extra emphasis on opening, closing, and repeated primary roots.",
      `Best candidate ${best.tonic} ${best.mode} outranked the next candidate by ${margin.toFixed(2)}.`,
    ],
    alternatives: ranked.slice(1, 4).map((candidate) => ({
      tonic: candidate.tonic,
      mode: candidate.mode,
      confidence: Math.max(0.1, confidence - 0.15),
    })),
  };
}
