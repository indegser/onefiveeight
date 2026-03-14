import { z } from "zod";

const severitySchema = z.enum(["low", "medium", "high", "critical"]);

export const runSchema = z.object({
  run_id: z.string(),
  goal: z.string(),
  revision: z.number().int().positive().default(1),
  phase: z.enum([
    "intake",
    "plan",
    "design",
    "build",
    "verify",
    "review",
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
      "planner",
      "design-agent",
      "builder",
      "verifier",
      "design-critic",
      "code-critic",
      "supervisor",
      "human",
      "none",
    ])
    .optional(),
  stack: z.object({
    frontend: z.string(),
    ui: z.string(),
    backend: z.string(),
    language: z.string(),
  }),
  inputs: z.object({
    idea_file: z.string(),
    constraints: z.array(z.string()),
    brand_critical: z.boolean(),
  }),
  artifacts: z.object({
    plan: z.string(),
    memory: z.string().optional(),
    design: z.string(),
    build: z.string(),
    verify: z.string(),
  }),
  approvals: z.object({
    brand: z.boolean().default(false),
    data_model: z.boolean().default(false),
    destructive_flows: z.boolean().default(false),
  }),
  blockers: z.array(z.string()),
  decisions: z.array(z.string()),
  risks: z.array(z.string()),
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

export const planSchema = z.object({
  epics: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      tasks: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          acceptance_criteria: z.array(z.string()),
          dependencies: z.array(z.string()),
          done_definition: z.array(z.string()).optional(),
        }),
      ),
    }),
  ),
  assumptions: z.array(z.string()),
  risks: z.array(z.string()),
});

export const designSchema = z.object({
  screens: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      purpose: z.string(),
      screen_type: z.string(),
      primary_action: z.string().optional(),
      states: z.array(z.string()).optional(),
    }),
  ),
  ux_rules: z.array(z.string()),
  component_map: z.array(
    z.object({
      screen_id: z.string(),
      components: z.array(z.string()),
    }),
  ),
  design_rule_engine: z.object({
    profile_id: z.string().nullable(),
    hard_rule_sets: z.array(z.string()),
    heuristic_sets: z.array(z.string()),
    allowed_pattern_sets: z.array(z.string()),
    banned_pattern_sets: z.array(z.string()),
    review_rubric_id: z.string(),
  }),
  screen_contexts: z.array(
    z.object({
      screen_id: z.string(),
      screen_type: z.string(),
      layout_intent: z.string(),
      interaction_risks: z.array(z.string()),
      required_states: z.array(z.string()),
      notes: z.array(z.string()).optional(),
    }),
  ),
  builder_constraints: z.array(
    z.object({
      screen_id: z.string(),
      constraints: z.array(z.string()),
      open_decisions: z.array(z.string()),
    }),
  ),
  review_targets: z.array(
    z.object({
      screen_id: z.string(),
      critical_judgments: z.array(z.string()),
      must_not_regress: z.array(z.string()),
    }),
  ),
  visual_constraints: z.array(z.string()),
  human_checkpoints: z.array(z.string()),
});

export const buildSchema = z.object({
  completed_tasks: z.array(z.string()),
  changed_files: z.array(z.string()),
  notes: z.array(z.string()).optional(),
  open_issues: z.array(z.string()),
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
});

export const reviewSchema = z.object({
  approved: z.boolean(),
  findings: z.array(
    z.object({
      severity: severitySchema,
      message: z.string(),
      area: z.string().optional(),
    }),
  ),
  next_steps: z.array(z.string()),
});

export const knowledgePatternSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  when_to_use: z.array(z.string()),
  constraints: z.array(z.string()),
  solution_outline: z.array(z.string()),
  source_projects: z.array(z.string()),
  source_files: z.array(z.string()),
  maintained_by: z.string().optional(),
});

export const memorySchema = z.object({
  patterns: z.array(
    knowledgePatternSchema.extend({
      applicability_score: z.number().int().nonnegative().optional(),
      selected_because: z.string().optional(),
    }),
  ),
  notes: z.array(z.string()),
});

export const designReviewSchema = z.object({
  approved: z.boolean(),
  preview_evidence: z.array(z.string()).min(1),
  summary: z.object({
    status: z.enum(["pass", "pass_with_followups", "refine", "blocked"]),
    rationale: z.string(),
  }),
  findings: z.array(
    z.object({
      id: z.string(),
      severity: severitySchema,
      layer: z.enum(["hard_rule", "ux_heuristic", "aesthetic_judgment"]),
      message: z.string(),
      screen_id: z.string().optional(),
      area: z.string().optional(),
      recommendation: z.string().optional(),
      evidence: z.array(z.string()).optional(),
    }),
  ),
  section_scores: z.array(
    z.object({
      section_id: z.string(),
      score: z.number(),
      notes: z.array(z.string()),
    }),
  ),
  profile_assessment: z.object({
    selected_profile_id: z.string().nullable(),
    fit_score: z.number(),
    anti_patterns_detected: z.array(z.string()),
    notes: z.array(z.string()).optional(),
  }),
  gates: z.object({
    hard_rules_passed: z.boolean(),
    needs_human_review: z.boolean(),
    requires_refinement: z.boolean(),
  }),
  next_steps: z.array(z.string()),
});

export const schemas = {
  run: runSchema,
  plan: planSchema,
  memory: memorySchema,
  design: designSchema,
  build: buildSchema,
  verify: verifySchema,
  knowledgePattern: knowledgePatternSchema,
  designReview: designReviewSchema,
  codeReview: reviewSchema,
};
