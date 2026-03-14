import {
  normalizedLeadSheetSchema,
  type AudioInput,
  type UncertaintyItem,
} from "../../schemas/music-analysis";
import type {
  AudioAnalysisAdapter,
  AudioPipelineResult,
} from "./types";

export async function runAudioPipeline(
  input: AudioInput,
  adapter?: AudioAnalysisAdapter,
): Promise<AudioPipelineResult> {
  // TODO: Replace this placeholder with a repository-specific adapter chain
  // that handles ffmpeg conversion, stem separation, beat tracking, and
  // chord-candidate generation outside the LLM layer.
  const uncertainty: UncertaintyItem[] = [
    {
      scope: "source",
      ref: input.filePath,
      severity: "medium",
      message:
        "Audio analysis is probabilistic until a repository-specific MIR adapter is connected.",
      recommendation:
        "TODO: Wire ffmpeg preprocessing plus a Python or service adapter for beat tracking and chord candidates.",
    },
  ];

  if (!adapter) {
    return {
      normalizedLeadSheet: normalizedLeadSheetSchema.parse({
        title: null,
        sourceType: "audio",
        sections: [],
        evidence: [
          {
            sourceKind: "audio",
            reference: input.filePath,
            confidence: 0.2,
            notes: [
              "TODO: No audio adapter configured yet for stem separation or chord candidate generation.",
            ],
          },
        ],
      }),
      uncertainty,
    };
  }

  const analysis = await adapter.analyze(input);

  return {
    normalizedLeadSheet: normalizedLeadSheetSchema.parse({
      title: null,
      sourceType: "audio",
      sections: [],
      evidence: [
        {
          sourceKind: "audio",
          reference: input.filePath,
          confidence: 0.45,
          notes: [
            `TODO: Populate draft sections from ${analysis.chordCandidates.length} audio chord candidates.`,
          ],
        },
      ],
    }),
    uncertainty: [...uncertainty, ...analysis.uncertainty],
  };
}
