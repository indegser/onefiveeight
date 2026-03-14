import type {
  CriticReport,
  MusicAnalysisResult,
  UncertaintyItem,
} from "../schemas/music-analysis";

export function buildCriticReport(
  result: Omit<MusicAnalysisResult, "criticReport">,
): CriticReport {
  const findings: CriticReport["findings"] = [];
  const retryRecommendations: string[] = [];

  if (result.probableKey.confidence < 0.55) {
    findings.push({
      severity: "warning",
      message: "Key estimation confidence is low.",
      refs: ["probableKey"],
    });
    retryRecommendations.push(
      "Prefer a cleaner symbolic source or add section-specific cadence evidence before publishing a final key.",
    );
  }

  if (result.probableMeter.confidence < 0.6) {
    findings.push({
      severity: "warning",
      message: "Meter inference is heuristic rather than explicitly encoded in the source.",
      refs: ["probableMeter"],
    });
  }

  const flaggedMeasures = result.normalizedLeadSheet.sections.flatMap((section) =>
    section.systems.flatMap((system) =>
      system.measures
        .filter((measure) => measure.reviewRequired)
        .map((measure) => measure.measureId),
    ),
  );

  if (flaggedMeasures.length) {
    findings.push({
      severity: "warning",
      message: `${flaggedMeasures.length} measures still require review.`,
      refs: flaggedMeasures,
    });
    retryRecommendations.push(
      "Review unreadable or multi-token bars before treating the harmonic analysis as final.",
    );
  }

  if (!result.romanNumeralAnalysis.length) {
    findings.push({
      severity: "error",
      message: "Roman numeral analysis could not be generated from the current input.",
      refs: ["romanNumeralAnalysis"],
    });
  }

  return {
    status: findings.some((finding) => finding.severity === "error")
      ? "needs-review"
      : "ready",
    findings,
    retryRecommendations,
  };
}

export function mergeUncertainty(
  ...collections: UncertaintyItem[][]
): UncertaintyItem[] {
  return collections.flat();
}
