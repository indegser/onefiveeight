import { z } from "zod";

export const confidenceSchema = z.number().min(0).max(1);

export const chordQualitySchema = z.enum([
  "major",
  "minor",
  "dominant",
  "diminished",
  "half-diminished",
  "augmented",
  "suspended",
  "power",
  "unknown",
]);

export const sourceEvidenceSchema = z.object({
  sourceKind: z.enum(["symbolic", "audio", "combined"]),
  reference: z.string(),
  confidence: confidenceSchema,
  notes: z.array(z.string()).default([]),
});

export const normalizedChordEventSchema = z.object({
  eventId: z.string(),
  rawSymbol: z.string(),
  normalizedSymbol: z.string(),
  root: z.string().nullable(),
  bass: z.string().nullable(),
  quality: chordQualitySchema,
  beatSpan: z.number().positive().nullable(),
  confidence: confidenceSchema,
  parsingNotes: z.array(z.string()).default([]),
});

export const normalizedMeasureSchema = z.object({
  measureId: z.string(),
  sourceMeasureId: z.string().nullable().default(null),
  chordEvents: z.array(normalizedChordEventSchema),
  annotations: z.array(z.string()).default([]),
  evidenceRefs: z.array(z.string()).default([]),
  reviewRequired: z.boolean().default(false),
});

export const normalizedSystemSchema = z.object({
  systemId: z.string(),
  sourcePageId: z.string().nullable().default(null),
  label: z.string().nullable().default(null),
  directives: z.array(z.string()).default([]),
  measures: z.array(normalizedMeasureSchema),
});

export const normalizedSectionSchema = z.object({
  sectionId: z.string(),
  label: z.string(),
  systems: z.array(normalizedSystemSchema),
  reviewRequired: z.boolean().default(false),
});

export const normalizedLeadSheetSchema = z.object({
  title: z.string().nullable().default(null),
  sourceType: z.enum(["score-image", "chord-chart-image", "pdf", "audio", "structured"]),
  sections: z.array(normalizedSectionSchema),
  evidence: z.array(sourceEvidenceSchema).default([]),
});

export const probableKeySchema = z.object({
  tonic: z.string(),
  mode: z.enum(["major", "minor", "modal", "unknown"]),
  confidence: confidenceSchema,
  rationale: z.array(z.string()).default([]),
  alternatives: z
    .array(
      z.object({
        tonic: z.string(),
        mode: z.enum(["major", "minor", "modal", "unknown"]),
        confidence: confidenceSchema,
      }),
    )
    .default([]),
});

export const probableMeterSchema = z.object({
  meter: z.string(),
  confidence: confidenceSchema,
  rationale: z.array(z.string()).default([]),
  source: z.enum(["symbolic", "audio", "heuristic"]),
});

export const romanNumeralEventSchema = z.object({
  eventId: z.string(),
  chordSymbol: z.string(),
  romanNumeral: z.string(),
  functionLabel: z.string(),
  confidence: confidenceSchema,
  notes: z.array(z.string()).default([]),
});

export const romanNumeralMeasureSchema = z.object({
  measureId: z.string(),
  events: z.array(romanNumeralEventSchema),
});

export const harmonicDeviceSchema = z.object({
  device: z.string(),
  confidence: confidenceSchema,
  measures: z.array(z.string()).default([]),
  description: z.string(),
});

export const uncertaintyItemSchema = z.object({
  scope: z.enum(["source", "measure", "event", "key", "meter", "analysis"]),
  ref: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  message: z.string(),
  recommendation: z.string().nullable().default(null),
});

export const criticFindingSchema = z.object({
  severity: z.enum(["info", "warning", "error"]),
  message: z.string(),
  refs: z.array(z.string()).default([]),
});

export const criticReportSchema = z.object({
  status: z.enum(["ready", "needs-review"]),
  findings: z.array(criticFindingSchema),
  retryRecommendations: z.array(z.string()).default([]),
});

export const musicAnalysisResultSchema = z.object({
  normalizedLeadSheet: normalizedLeadSheetSchema,
  probableKey: probableKeySchema,
  probableMeter: probableMeterSchema,
  romanNumeralAnalysis: z.array(romanNumeralMeasureSchema),
  harmonicDevices: z.array(harmonicDeviceSchema),
  guitaristExplanation: z.string(),
  uncertaintyReport: z.array(uncertaintyItemSchema),
  criticReport: criticReportSchema,
});

export const leadSheetAlignmentSourceSchema = z.object({
  sections: z.array(
    z.object({
      section_id: z.string(),
      label: z.string(),
      systems: z.array(
        z.object({
          system_id: z.string(),
          source_page_id: z.string(),
          measures: z.array(
            z.object({
              measure_id: z.string(),
              chord_text: z.string().nullable(),
              evidence_token_ids: z.array(z.string()),
              review_required: z.boolean(),
            }),
          ),
          directives: z.array(
            z.object({
              type: z.string(),
              text: z.string(),
              evidence_token_ids: z.array(z.string()),
            }),
          ),
        }),
      ),
    }),
  ),
  unresolved: z.array(z.string()).default([]),
});

export const symbolicInputSchema = z.discriminatedUnion("sourceKind", [
  z.object({
    sourceKind: z.literal("lead-sheet-alignment"),
    sourceType: z.enum(["score-image", "chord-chart-image", "pdf", "structured"]),
    title: z.string().optional(),
    payload: leadSheetAlignmentSourceSchema,
  }),
  z.object({
    sourceKind: z.literal("normalized-lead-sheet"),
    sourceType: z.enum(["score-image", "chord-chart-image", "pdf", "structured"]),
    payload: normalizedLeadSheetSchema,
  }),
]);

export const audioInputSchema = z.object({
  sourceKind: z.literal("audio-file"),
  sourceType: z.enum(["audio"]),
  filePath: z.string(),
  mimeType: z.string().optional(),
});

export const musicAnalysisRequestSchema = z.object({
  input: z.union([symbolicInputSchema, audioInputSchema]),
  options: z
    .object({
      preferSymbolic: z.boolean().default(true),
      instrumentFocus: z.enum(["guitar", "general"]).default("guitar"),
    })
    .default({ preferSymbolic: true, instrumentFocus: "guitar" }),
});

export type Confidence = z.infer<typeof confidenceSchema>;
export type NormalizedLeadSheet = z.infer<typeof normalizedLeadSheetSchema>;
export type NormalizedMeasure = z.infer<typeof normalizedMeasureSchema>;
export type NormalizedChordEvent = z.infer<typeof normalizedChordEventSchema>;
export type ProbableKey = z.infer<typeof probableKeySchema>;
export type ProbableMeter = z.infer<typeof probableMeterSchema>;
export type RomanNumeralMeasure = z.infer<typeof romanNumeralMeasureSchema>;
export type HarmonicDevice = z.infer<typeof harmonicDeviceSchema>;
export type UncertaintyItem = z.infer<typeof uncertaintyItemSchema>;
export type CriticReport = z.infer<typeof criticReportSchema>;
export type MusicAnalysisResult = z.infer<typeof musicAnalysisResultSchema>;
export type SymbolicInput = z.infer<typeof symbolicInputSchema>;
export type AudioInput = z.infer<typeof audioInputSchema>;
export type MusicAnalysisRequest = z.infer<typeof musicAnalysisRequestSchema>;
export type LeadSheetAlignmentSource = z.infer<
  typeof leadSheetAlignmentSourceSchema
>;
