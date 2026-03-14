import type {
  NormalizedLeadSheet,
  SymbolicInput,
  UncertaintyItem,
} from "../../schemas/music-analysis";
import {
  leadSheetAlignmentSourceSchema,
  normalizedLeadSheetSchema,
} from "../../schemas/music-analysis";
import {
  normalizeChordEvent,
  splitChordTokens,
} from "../../utils/chord-normalization";
import type {
  SymbolicPipelineResult,
  SymbolicSourceAdapter,
} from "./types";

export class LeadSheetAlignmentAdapter implements SymbolicSourceAdapter {
  name = "lead-sheet-alignment";

  supports(input: SymbolicInput) {
    return (
      input.sourceKind === "lead-sheet-alignment" ||
      input.sourceKind === "normalized-lead-sheet"
    );
  }

  toNormalizedLeadSheet(input: SymbolicInput): SymbolicPipelineResult {
    if (input.sourceKind === "normalized-lead-sheet") {
      return {
        normalizedLeadSheet: normalizedLeadSheetSchema.parse(input.payload),
        uncertainty: [],
      };
    }

    const payload = leadSheetAlignmentSourceSchema.parse(input.payload);
    const uncertainty: UncertaintyItem[] = payload.unresolved.map((message, index) => ({
      scope: "source",
      ref: `unresolved-${index + 1}`,
      severity: "medium",
      message,
      recommendation: "Resolve this during symbolic review before trusting a final publish step.",
    }));

    const sections = payload.sections.map((section) => {
      const systems = section.systems.map((system) => ({
        systemId: system.system_id,
        sourcePageId: system.source_page_id,
        label: section.label,
        directives: system.directives.map(
          (directive) => `${directive.type}: ${directive.text}`,
        ),
        measures: system.measures.map((measure) => {
          const tokens = measure.chord_text ? splitChordTokens(measure.chord_text) : [];
          const events = tokens.map((token, index) =>
            normalizeChordEvent(
              token,
              `${measure.measure_id}-event-${index + 1}`,
            ),
          );

          for (const item of events.flatMap((event) => event.uncertainty)) {
            uncertainty.push(item);
          }

          if (!tokens.length) {
            uncertainty.push({
              scope: "measure",
              ref: measure.measure_id,
              severity: "high",
              message: "No chord text was available for this measure.",
              recommendation:
                "Review the original score image or chart alignment for a missing bar.",
            });
          }

          return {
            measureId: measure.measure_id,
            sourceMeasureId: measure.measure_id,
            chordEvents: events.map((event) => event.event),
            annotations: [],
            evidenceRefs: measure.evidence_token_ids,
            reviewRequired:
              measure.review_required ||
              !tokens.length ||
              events.some((event) => event.uncertainty.length > 0),
          };
        }),
      }));

      return {
        sectionId: section.section_id,
        label: section.label,
        reviewRequired: systems.some((system) =>
          system.measures.some((measure) => measure.reviewRequired),
        ),
        systems,
      };
    });

    const normalizedLeadSheet: NormalizedLeadSheet = {
      title: input.title ?? null,
      sourceType: input.sourceType,
      evidence: [
        {
          sourceKind: "symbolic",
          reference: input.sourceKind,
          confidence: 0.92,
          notes: ["Derived from existing lead-sheet alignment artifacts."],
        },
      ],
      sections,
    };

    return {
      normalizedLeadSheet: normalizedLeadSheetSchema.parse(normalizedLeadSheet),
      uncertainty,
    };
  }
}
