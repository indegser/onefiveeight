import type {
  AudioInput,
  NormalizedLeadSheet,
  UncertaintyItem,
} from "../../schemas/music-analysis";

export type AudioBeat = {
  index: number;
  time: number;
};

export type AudioDownbeat = {
  beatIndex: number;
  time: number;
  confidence: number;
};

export type AudioBar = {
  index: number;
  startBeat: number;
  endBeat: number;
  startTime: number;
  endTime: number;
  confidence: number;
};

export type AudioRootCandidate = {
  barIndex: number;
  root: string;
  confidence: number;
  alternatives?: Array<{
    root: string;
    confidence: number;
  }>;
};

export type AudioFrameChordCandidate = {
  barIndex: number;
  candidates: Array<{
    symbol: string;
    confidence: number;
  }>;
};

export type AudioChordCandidate = {
  symbol: string;
  confidence: number;
  startBeat: number;
  endBeat: number;
  startBar?: number;
  endBar?: number;
};

export type AudioSeparationArtifacts = {
  engine: "demucs" | "hpss" | "none";
  directory?: string;
  stems?: Partial<Record<"bass" | "drums" | "vocals" | "other", string>>;
};

export type AudioAnalysisStage = {
  stage:
    | "preprocess"
    | "separation"
    | "rhythm"
    | "harmony"
    | "smoothing"
    | "aggregation";
  status: "passed" | "skipped" | "failed";
  details: string;
};

export type AudioAdapterOutput = {
  bpm?: number;
  meterHint?: string;
  beats?: AudioBeat[];
  downbeats?: AudioDownbeat[];
  bars?: AudioBar[];
  rootCandidates?: AudioRootCandidate[];
  frameChordCandidates?: AudioFrameChordCandidate[];
  chordCandidates: AudioChordCandidate[];
  separationArtifacts?: AudioSeparationArtifacts;
  stages?: AudioAnalysisStage[];
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
