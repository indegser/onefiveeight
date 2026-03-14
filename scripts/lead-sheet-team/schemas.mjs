import { z } from "zod";

const severitySchema = z.enum(["low", "medium", "high", "critical"]);

export const runSchema = z.object({
  run_id: z.string(),
  goal: z.string(),
  revision: z.number().int().positive().default(1),
  phase: z.enum([
    "intake",
    "preprocess",
    "extract",
    "align",
    "verify",
    "review",
    "publish",
    "done",
  ]),
  status: z.enum([
    "not_started",
    "in_progress",
    "blocked",
    "needs_human",
    "done",
  ]),
  next_agent: z
    .enum([
      "intake-supervisor",
      "preprocessor",
      "extractor",
      "aligner",
      "verifier",
      "chart-reviewer",
      "publisher",
      "human",
      "none",
    ])
    .optional(),
  inputs: z.object({
    source_ref: z.string(),
    score_id: z.string().nullable(),
    constraints: z.array(z.string()),
    accuracy_priority: z.literal("max"),
  }),
  artifacts: z.object({
    intake: z.string(),
    preprocess: z.string(),
    extract: z.string(),
    align: z.string(),
    verify: z.string(),
    publish: z.string(),
  }),
  approvals: z.object({
    human_review: z.boolean().default(false),
    publish: z.boolean().default(false),
  }),
  blockers: z.array(z.string()),
  uncertainties: z.array(z.string()),
  refinement_notes: z
    .array(
      z.object({
        at: z.string(),
        note: z.string(),
        target_agent: z.string(),
      }),
    )
    .default([]),
  history: z.array(
    z.object({
      at: z.string(),
      event: z.string(),
    }),
  ),
});

export const intakeSchema = z.object({
  source_type: z.enum(["image", "pdf", "folder", "external_ref"]),
  score_label: z.string(),
  requested_output: z.string(),
  source_files: z.array(z.string()),
  notes: z.array(z.string()),
  constraints: z.array(z.string()),
});

export const preprocessSchema = z.object({
  assets: z.array(
    z.object({
      id: z.string(),
      kind: z.enum(["original", "cropped", "rectified", "normalized"]),
      path: z.string(),
      derived_from: z.string().nullable(),
      notes: z.array(z.string()).optional(),
    }),
  ),
  issues: z.array(z.string()),
});

export const extractSchema = z.object({
  pages: z.array(
    z.object({
      page_id: z.string(),
      asset_path: z.string(),
      tokens: z.array(
        z.object({
          token_id: z.string(),
          type: z.enum([
            "section_label",
            "chord",
            "repeat",
            "jump",
            "time_signature",
            "barline",
            "note",
            "other",
          ]),
          raw_text: z.string(),
          bbox: z.object({
            x: z.number(),
            y: z.number(),
            width: z.number(),
            height: z.number(),
          }),
          confidence: z.number().min(0).max(1),
        }),
      ),
    }),
  ),
  unresolved: z.array(z.string()),
});

export const alignSchema = z.object({
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
  unresolved: z.array(z.string()),
});

export const verifySchema = z.object({
  checks: z.array(
    z.object({
      name: z.string(),
      status: z.enum(["passed", "failed", "skipped"]),
      details: z.string().optional(),
    }),
  ),
  passed: z.boolean(),
  blocking_issues: z.array(z.string()),
  review_required_count: z.number().int().nonnegative(),
});

export const chartReviewSchema = z.object({
  approved: z.boolean(),
  findings: z.array(
    z.object({
      severity: severitySchema,
      message: z.string(),
      area: z.string().optional(),
    }),
  ),
  unresolved_items: z.array(z.string()),
  next_steps: z.array(z.string()),
});

export const publishSchema = z.object({
  status: z.enum(["ready", "published", "withheld"]),
  target_ref: z.string(),
  published_artifacts: z.array(z.string()),
  notes: z.array(z.string()),
});

export const schemas = {
  run: runSchema,
  intake: intakeSchema,
  preprocess: preprocessSchema,
  extract: extractSchema,
  align: alignSchema,
  verify: verifySchema,
  chartReview: chartReviewSchema,
  publish: publishSchema,
};
