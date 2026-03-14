import {
  musicAnalysisRequestSchema,
  musicAnalysisResultSchema,
  type MusicAnalysisRequest,
  type MusicAnalysisResult,
} from "../schemas/music-analysis";
import { buildCriticReport, mergeUncertainty } from "../critic/pipeline";
import type { AudioAnalysisAdapter } from "../pipelines/audio/types";
import { runAudioPipeline } from "../pipelines/audio/pipeline";
import type { SymbolicSourceAdapter } from "../pipelines/symbolic/types";
import { runSymbolicPipeline } from "../pipelines/symbolic/pipeline";
import { detectHarmonicDevices } from "../theory/harmonic-devices";
import { buildGuitaristExplanation } from "../theory/guitar-explanation";
import { estimateProbableKey } from "../theory/key-analysis";
import { estimateProbableMeter } from "../theory/meter-analysis";
import { analyzeRomanNumerals } from "../theory/roman-numerals";

export async function analyzeHarmony(
  request: MusicAnalysisRequest,
  dependencies?: {
    symbolicAdapters?: SymbolicSourceAdapter[];
    audioAdapter?: AudioAnalysisAdapter;
  },
): Promise<MusicAnalysisResult> {
  const parsedRequest = musicAnalysisRequestSchema.parse(request);
  const pipelineResult =
    parsedRequest.input.sourceKind === "audio-file"
      ? await runAudioPipeline(parsedRequest.input, dependencies?.audioAdapter)
      : runSymbolicPipeline(
          parsedRequest.input,
          dependencies?.symbolicAdapters,
        );

  const probableKey = estimateProbableKey(pipelineResult.normalizedLeadSheet);
  const probableMeter = estimateProbableMeter(
    pipelineResult.normalizedLeadSheet,
  );
  const romanNumeralAnalysis = analyzeRomanNumerals(
    pipelineResult.normalizedLeadSheet,
    probableKey,
  );
  const harmonicDevices = detectHarmonicDevices(
    pipelineResult.normalizedLeadSheet,
    probableKey,
    romanNumeralAnalysis,
  );
  const guitaristExplanation = buildGuitaristExplanation(
    pipelineResult.normalizedLeadSheet,
    probableKey,
    probableMeter,
    harmonicDevices,
  );

  const draftResult = {
    normalizedLeadSheet: pipelineResult.normalizedLeadSheet,
    probableKey,
    probableMeter,
    romanNumeralAnalysis,
    harmonicDevices,
    guitaristExplanation,
    uncertaintyReport: mergeUncertainty(pipelineResult.uncertainty),
  };

  return musicAnalysisResultSchema.parse({
    ...draftResult,
    criticReport: buildCriticReport(draftResult),
  });
}
