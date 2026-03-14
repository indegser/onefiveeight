import type {
  AudioInput,
  NormalizedLeadSheet,
  UncertaintyItem,
} from "../../schemas/music-analysis";

export type AudioChordCandidate = {
  symbol: string;
  confidence: number;
  startBeat: number;
  endBeat: number;
};

export type AudioAdapterOutput = {
  stemsPath?: string;
  bpm?: number;
  meterHint?: string;
  chordCandidates: AudioChordCandidate[];
  uncertainty: UncertaintyItem[];
};

export type AudioPipelineResult = {
  normalizedLeadSheet: NormalizedLeadSheet;
  uncertainty: UncertaintyItem[];
};

export interface AudioAnalysisAdapter {
  name: string;
  analyze(input: AudioInput): Promise<AudioAdapterOutput>;
}
