import type {
  NormalizedLeadSheet,
  ProbableMeter,
} from "../schemas/music-analysis";

export function estimateProbableMeter(
  leadSheet: NormalizedLeadSheet,
): ProbableMeter {
  const explicit = leadSheet.sections.flatMap((section) =>
    section.systems
      .map((system) => system.directives.find((directive) => /\d+\/\d+/.test(directive)))
      .filter((directive): directive is string => Boolean(directive)),
  );

  if (explicit.length) {
    const meter = explicit[0].match(/\d+\/\d+/)?.[0] ?? explicit[0];

    return {
      meter,
      confidence: 0.95,
      rationale: ["Meter was found directly in the symbolic directives."],
      source: "symbolic",
    };
  }

  const averageEventsPerMeasure = (() => {
    const measures = leadSheet.sections.flatMap((section) =>
      section.systems.flatMap((system) => system.measures),
    );

    if (!measures.length) {
      return 0;
    }

    return (
      measures.reduce((sum, measure) => sum + measure.chordEvents.length, 0) /
      measures.length
    );
  })();

  return {
    meter: "4/4",
    confidence: averageEventsPerMeasure > 1.6 ? 0.45 : 0.35,
    rationale: [
      "No explicit time signature was found in the symbolic source.",
      "Defaulting to a conservative 4/4 guess because common-pop lead sheets most often collapse to simple meter in draft form.",
    ],
    source: "heuristic",
  };
}
