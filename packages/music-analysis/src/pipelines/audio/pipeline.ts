import {
  normalizedLeadSheetSchema,
  type AudioInput,
  type NormalizedMeasure,
  type UncertaintyItem,
} from "../../schemas/music-analysis";
import { normalizeChordEvent } from "../../utils/chord-normalization";
import { PythonLibrosaAudioAdapter } from "./librosa-adapter";
import type {
  AudioAnalysisAdapter,
  AudioBar,
  AudioChordCandidate,
  AudioPipelineResult,
} from "./types";

function buildMeasureSkeletons(bars: AudioBar[], sourceRef: string): NormalizedMeasure[] {
  return bars.map((bar, index) => ({
    measureId: `m${index + 1}`,
    sourceMeasureId: null,
    chordEvents: [],
    annotations: [
      `Audio bar ${bar.index + 1}: beats ${bar.startBeat}-${Math.max(bar.endBeat - 1, bar.startBeat)}.`,
    ],
    evidenceRefs: [sourceRef, `bar:${bar.index}`],
    reviewRequired: false,
  }));
}

function populateMeasuresFromCandidates(
  bars: AudioBar[],
  candidates: AudioChordCandidate[],
  sourceRef: string,
) {
  if (!bars.length) {
    return {
      measures: [] as NormalizedMeasure[],
      uncertainty: [
        {
          scope: "source" as const,
          ref: sourceRef,
          severity: "high" as const,
          message: "No bar grid was available to draft a lead sheet from audio analysis.",
          recommendation:
            "Retry with a cleaner audio source or inspect beat/downbeat tracking output.",
        },
      ],
    };
  }

  const measures = buildMeasureSkeletons(bars, sourceRef);
  const uncertainty: UncertaintyItem[] = [];

  for (const candidate of candidates) {
    const inferredStartBar =
      candidate.startBar ??
      bars.findIndex((bar) => candidate.startBeat >= bar.startBeat && candidate.startBeat < bar.endBeat);
    const normalizedStartBar =
      inferredStartBar >= 0 ? inferredStartBar : Math.max(0, bars.length - 1);
    const inferredEndBar =
      candidate.endBar ??
      bars.findIndex((bar) => candidate.endBeat > bar.startBeat && candidate.endBeat <= bar.endBeat) + 1;
    const normalizedEndBarExclusive =
      inferredEndBar > 0
        ? inferredEndBar
        : Math.min(
            bars.length,
            Math.max(normalizedStartBar + 1, bars.length),
          );

    for (
      let barIndex = normalizedStartBar;
      barIndex < Math.min(measures.length, normalizedEndBarExclusive);
      barIndex += 1
    ) {
      const measure = measures[barIndex];
      const bar = bars[barIndex];

      const eventId = `${measure.measureId}_e${measure.chordEvents.length + 1}`;
      const normalized = normalizeChordEvent(candidate.symbol, eventId);
      const overlappingStartBeat = Math.max(candidate.startBeat, bar.startBeat);
      const overlappingEndBeat = Math.min(candidate.endBeat, bar.endBeat);

      measure.chordEvents.push({
        ...normalized.event,
        beatSpan: Math.max(1, overlappingEndBeat - overlappingStartBeat),
        confidence: Math.max(
          0.2,
          Math.min(0.95, (normalized.event.confidence + candidate.confidence) / 2),
        ),
        parsingNotes: [
          ...normalized.event.parsingNotes,
          `Audio-derived chord candidate confidence ${candidate.confidence.toFixed(2)}.`,
          candidate.startBar !== undefined && candidate.endBar !== undefined
            ? `Smoothed across bars ${candidate.startBar + 1}-${candidate.endBar}.`
            : "Placed from overlapping audio bar boundaries.",
        ],
      });
      measure.reviewRequired ||= candidate.confidence < 0.58;
      uncertainty.push(...normalized.uncertainty);
    }
  }

  for (const measure of measures) {
    if (!measure.chordEvents.length) {
      measure.reviewRequired = true;
      measure.annotations.push("No chord candidate landed in this drafted measure.");
      uncertainty.push({
        scope: "measure",
        ref: measure.measureId,
        severity: "medium",
        message: "Draft measure has no chord content after audio segmentation.",
        recommendation:
          "Review neighboring beat boundaries or confirm whether the bar is an instrumental/rest.",
      });
    }
  }

  return { measures, uncertainty };
}

export async function runAudioPipeline(
  input: AudioInput,
  adapter?: AudioAnalysisAdapter,
): Promise<AudioPipelineResult> {
  const activeAdapter = adapter ?? new PythonLibrosaAudioAdapter();
  const analysis = await activeAdapter.analyze(input);
  const uncertainty: UncertaintyItem[] = [
    {
      scope: "source",
      ref: input.filePath,
      severity: "medium",
      message:
        `Audio analysis is probabilistic and currently derived from the ${activeAdapter.name} adapter.`,
      recommendation:
        "Cross-check the audio draft against symbolic evidence before treating the harmony as final.",
    },
    ...analysis.uncertainty,
  ];
  const bars = analysis.bars ?? [];
  const drafted = populateMeasuresFromCandidates(
    bars,
    analysis.chordCandidates,
    input.filePath,
  );
  const averageConfidence =
    analysis.chordCandidates.reduce(
      (sum, candidate) => sum + candidate.confidence,
      0,
    ) / Math.max(analysis.chordCandidates.length, 1);
  const systems = [];

  for (let index = 0; index < drafted.measures.length; index += 4) {
    systems.push({
      systemId: `system-${systems.length + 1}`,
      sourcePageId: null,
      label: systems.length === 0 ? "Audio Draft" : null,
      directives:
        systems.length === 0
          ? [
              analysis.meterHint ?? "4/4",
              ...(analysis.bpm
                ? [`Tempo ${Math.round(analysis.bpm)} bpm`]
                : []),
              ...(analysis.separationArtifacts
                ? [`Separation ${analysis.separationArtifacts.engine}`]
                : []),
            ]
          : [],
      measures: drafted.measures.slice(index, index + 4),
    });
  }

  return {
    normalizedLeadSheet: normalizedLeadSheetSchema.parse({
      title: null,
      sourceType: "audio",
      sections: systems.length
        ? [
            {
              sectionId: "section-1",
              label: "Audio Draft",
              systems,
              reviewRequired: uncertainty.some(
                (item) => item.severity === "medium" || item.severity === "high",
              ),
            },
          ]
        : [],
      evidence: [
        {
          sourceKind: "audio",
          reference: input.filePath,
          confidence: Math.max(0.2, Math.min(0.78, averageConfidence || 0.2)),
          notes: [
            `Drafted from ${analysis.chordCandidates.length} smoothed audio chord spans via ${activeAdapter.name}.`,
            ...(analysis.bars
              ? [`Bar grid contains ${analysis.bars.length} bars.`]
              : []),
            ...(analysis.bpm
              ? [`Estimated tempo ${Math.round(analysis.bpm)} bpm.`]
              : []),
            `Meter hint ${analysis.meterHint ?? "4/4"}.`,
            ...(analysis.stages?.map(
              (stage) => `${stage.stage}: ${stage.status} (${stage.details})`,
            ) ?? []),
          ],
        },
      ],
    }),
    uncertainty: [...uncertainty, ...drafted.uncertainty],
  };
}
