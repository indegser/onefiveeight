import type { SymbolicInput } from "../../schemas/music-analysis";
import { LeadSheetAlignmentAdapter } from "./lead-sheet-alignment-adapter";
import type { SymbolicPipelineResult, SymbolicSourceAdapter } from "./types";

const DEFAULT_ADAPTERS: SymbolicSourceAdapter[] = [
  new LeadSheetAlignmentAdapter(),
];

export function runSymbolicPipeline(
  input: SymbolicInput,
  adapters: SymbolicSourceAdapter[] = DEFAULT_ADAPTERS,
): SymbolicPipelineResult {
  const adapter = adapters.find((candidate) => candidate.supports(input));

  if (!adapter) {
    throw new Error(
      `No symbolic adapter could handle source kind "${input.sourceKind}".`,
    );
  }

  return adapter.toNormalizedLeadSheet(input);
}
