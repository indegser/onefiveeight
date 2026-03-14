import type {
  NormalizedLeadSheet,
  SymbolicInput,
  UncertaintyItem,
} from "../../schemas/music-analysis";

export type SymbolicPipelineResult = {
  normalizedLeadSheet: NormalizedLeadSheet;
  uncertainty: UncertaintyItem[];
};

export interface SymbolicSourceAdapter {
  name: string;
  supports(input: SymbolicInput): boolean;
  toNormalizedLeadSheet(input: SymbolicInput): SymbolicPipelineResult;
}
