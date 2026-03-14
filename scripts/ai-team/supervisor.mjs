#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { buildTaskMemory } from "./memory.mjs";
import { schemas } from "./schemas.mjs";
import {
  ensureStateDirs,
  fileExists,
  getRunDir,
  getStateFiles,
  makeRunId,
  maybeReadJson,
  readJson,
  timestamp,
  writeJson,
} from "./shared-state.mjs";

const [, , command, ...restArgs] = process.argv;

async function main() {
  const args = parseCliArgs(restArgs);

  switch (command) {
    case "init":
      await initRun(args.positionals[0]);
      return;
    case "refine":
      await refineRun(args.positionals, args.options.runId);
      return;
    case "route":
      await routeRun(args.options.runId);
      return;
    case "work":
      await printWorkPackage(args.positionals[0], args.options.runId);
      return;
    case "validate":
      await validateState(args.options.runId);
      return;
    default:
      printUsage();
  }
}

function printUsage() {
  console.log(`Usage:
  npm run ai:init -- <idea-file>
  npm run ai:refine -- --run-id <run_id> [agent] <note>
  npm run ai:route -- --run-id <run_id>
  npm run ai:work -- <agent> --run-id <run_id>
  npm run ai:validate -- --run-id <run_id>`);
}

async function initRun(ideaFileArg) {
  const ideaFile = ideaFileArg ?? "docs/idea.md";
  const absoluteIdeaFile = path.resolve(process.cwd(), ideaFile);

  if (!(await fileExists(absoluteIdeaFile))) {
    throw new Error(`Idea file not found: ${absoluteIdeaFile}`);
  }

  await ensureStateDirs();
  const runId = makeRunId(ideaFile);
  const stateFiles = getStateFiles(runId);
  const memory = await buildTaskMemory({
    ideaFilePath: absoluteIdeaFile,
    goal: `Build an app from ${ideaFile}`,
    constraints: [],
  });

  const run = {
    run_id: runId,
    goal: `Build an app from ${ideaFile}`,
    revision: 1,
    phase: "plan",
    status: "in_progress",
    next_agent: "planner",
    stack: {
      frontend: "nextjs",
      ui: "shadcn-ui",
      backend: "supabase",
      language: "typescript",
    },
    inputs: {
      idea_file: ideaFile,
      constraints: [],
      brand_critical: false,
    },
    artifacts: {
      plan: path.relative(process.cwd(), stateFiles.plan),
      memory: path.relative(process.cwd(), stateFiles.memory),
      design: path.relative(process.cwd(), stateFiles.design),
      build: path.relative(process.cwd(), stateFiles.build),
      verify: path.relative(process.cwd(), stateFiles.verify),
    },
    approvals: {
      brand: false,
      data_model: false,
      destructive_flows: false,
    },
    blockers: [],
    decisions: [],
    risks: [],
    refinement_notes: [],
    history: [
      {
        at: timestamp(),
        event: `Initialized run from ${ideaFile}`,
      },
    ],
  };

  schemas.run.parse(run);
  await writeJson(stateFiles.run, run);
  schemas.memory.parse(memory);
  await writeJson(stateFiles.memory, memory);

  console.log(`Initialized run ${run.run_id}`);
  console.log(`Next agent: ${run.next_agent}`);
  console.log(`Run state: ${stateFiles.run}`);
}

async function refineRun(positionals, runId) {
  const allowedAgents = new Set([
    "planner",
    "design-agent",
    "builder",
    "verifier",
    "design-critic",
    "code-critic",
  ]);
  const firstArg = positionals[0];
  const targetAgent = allowedAgents.has(firstArg) ? firstArg : "builder";
  const note = allowedAgents.has(firstArg)
    ? positionals.slice(1).join(" ").trim()
    : positionals.join(" ").trim();

  if (!note) {
    throw new Error(
      "Missing refinement note. Example: npm run ai:refine -- --run-id <run_id> builder tighten screenshot evidence flow",
    );
  }

  const { run, stateFiles } = await getRunContext(runId);
  const filesToClear = getArtifactsToClearForAgent(targetAgent, stateFiles);

  for (const filePath of filesToClear) {
    if (await fileExists(filePath)) {
      await fs.rm(filePath);
    }
  }

  const nextRun = {
    ...run,
    revision: (run.revision ?? 1) + 1,
    phase: mapAgentToPhase(targetAgent),
    status: "in_progress",
    next_agent: targetAgent,
    blockers: [],
    refinement_notes: [
      ...(run.refinement_notes ?? []),
      {
        at: timestamp(),
        note,
        target_agent: targetAgent,
      },
    ],
    history: [
      ...run.history,
      {
        at: timestamp(),
        event: `Refinement requested for ${targetAgent}: ${note}`,
      },
    ],
  };

  schemas.run.parse(nextRun);
  await writeJson(stateFiles.run, nextRun);
  console.log(JSON.stringify(nextRun, null, 2));
}

async function routeRun(runId) {
  const { run, stateFiles } = await getRunContext(runId);
  const plan = await maybeReadJson(stateFiles.plan);
  const design = await maybeReadJson(stateFiles.design);
  const build = await maybeReadJson(stateFiles.build);
  const verify = await maybeReadJson(stateFiles.verify);
  const designReview = await maybeReadJson(stateFiles.designReview);
  const codeReview = await maybeReadJson(stateFiles.codeReview);

  let nextAgent = "planner";
  let phase = "plan";
  let status = "in_progress";
  const blockers = [];

  if (!plan) {
    nextAgent = "planner";
    phase = "plan";
  } else if (!design) {
    nextAgent = "design-agent";
    phase = "design";
  } else if (run.inputs.brand_critical && !run.approvals.brand) {
    nextAgent = "human";
    phase = "design";
    status = "needs_human";
    blockers.push("Brand approval required before implementation.");
  } else if (!build) {
    nextAgent = "builder";
    phase = "build";
  } else if (!verify) {
    nextAgent = "verifier";
    phase = "verify";
  } else if (verify.passed === false) {
    nextAgent = "builder";
    phase = "build";
    blockers.push(...verify.blocking_issues);
  } else if (!designReview) {
    nextAgent = "design-critic";
    phase = "review";
  } else if (designReview.approved === false) {
    nextAgent = "builder";
    phase = "build";
    blockers.push("Design review requires refinement.");
  } else if (!codeReview) {
    nextAgent = "code-critic";
    phase = "review";
  } else if (codeReview.approved === false) {
    nextAgent = "builder";
    phase = "build";
    blockers.push("Code review requires refinement.");
  } else {
    nextAgent = "none";
    phase = "done";
    status = "done";
  }

  const nextRun = {
    ...run,
    phase,
    status,
    next_agent: nextAgent,
    blockers,
    history: [
      ...run.history,
      {
        at: timestamp(),
        event: `Supervisor routed to ${nextAgent}`,
      },
    ],
  };

  schemas.run.parse(nextRun);
  await writeJson(stateFiles.run, nextRun);
  console.log(JSON.stringify(nextRun, null, 2));
}

async function printWorkPackage(agent, runId) {
  if (!agent) {
    throw new Error(
      "Missing agent name. Example: npm run ai:work -- planner --run-id <run_id>",
    );
  }

  const { run } = await getRunContext(runId);
  const promptPath = path.join(process.cwd(), "agents", `${agent}.md`);

  if (!(await fileExists(promptPath))) {
    throw new Error(`Unknown agent prompt: ${promptPath}`);
  }

  const prompt = await fs.readFile(promptPath, "utf8");
  const payload = {
    agent,
    run_id: run.run_id,
    phase: run.phase,
    status: run.status,
    run_dir: path.relative(process.cwd(), getRunDir(run.run_id)),
    prompt_file: path.relative(process.cwd(), promptPath),
    relevant_state: await collectRelevantState(agent, run.run_id),
    instructions: prompt.trim(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

async function validateState(runId) {
  const requiredRunId = getRequiredRunId(runId);
  const stateFiles = getStateFiles(requiredRunId);
  const validations = [];

  for (const [key, filePath] of Object.entries(stateFiles)) {
    if (!(await fileExists(filePath))) {
      validations.push({ key, ok: true, skipped: true });
      continue;
    }

    const json = await readJson(filePath);
    const schemaKey = mapStateKeyToSchemaKey(key);
    schemas[schemaKey].parse(json);
    validations.push({ key, ok: true, skipped: false });
  }

  console.log(
    JSON.stringify({ ok: true, run_id: requiredRunId, validations }, null, 2),
  );
}

async function requireState(name, runId) {
  const filePath = getStateFiles(runId)[name];

  if (!(await fileExists(filePath))) {
    throw new Error(`Missing required state file: ${filePath}`);
  }

  const parsed = await readJson(filePath);
  schemas[mapStateKeyToSchemaKey(name)].parse(parsed);
  return parsed;
}

async function collectRelevantState(agent, runId) {
  const stateFiles = getStateFiles(runId);
  const state = {
    run: await maybeReadJson(stateFiles.run),
  };

  if (
    [
      "design-agent",
      "builder",
      "verifier",
      "design-critic",
      "code-critic",
    ].includes(agent)
  ) {
    state.plan = await maybeReadJson(stateFiles.plan);
  }

  if (
    [
      "planner",
      "design-agent",
      "builder",
      "design-critic",
      "code-critic",
    ].includes(agent)
  ) {
    state.memory = await maybeReadJson(stateFiles.memory);
  }

  if (["builder", "design-critic"].includes(agent)) {
    state.design = await maybeReadJson(stateFiles.design);
  }

  if (["verifier", "code-critic"].includes(agent)) {
    state.build = await maybeReadJson(stateFiles.build);
  }

  if (["code-critic"].includes(agent)) {
    state.verify = await maybeReadJson(stateFiles.verify);
  }

  return state;
}

function getRequiredRunId(runId) {
  if (!runId) {
    throw new Error(
      "Missing required --run-id. Example: npm run ai:route -- --run-id <run_id>",
    );
  }

  return runId;
}

async function getRunContext(runIdArg) {
  const runId = getRequiredRunId(runIdArg);
  const run = await requireState("run", runId);
  const stateFiles = getStateFiles(runId);

  return { runId, run, stateFiles };
}

function mapStateKeyToSchemaKey(key) {
  switch (key) {
    case "designReview":
      return "designReview";
    case "codeReview":
      return "codeReview";
    default:
      return key;
  }
}

function mapAgentToPhase(agent) {
  switch (agent) {
    case "planner":
      return "plan";
    case "design-agent":
      return "design";
    case "builder":
      return "build";
    case "verifier":
      return "verify";
    case "design-critic":
    case "code-critic":
      return "review";
    case "human":
      return "review";
    default:
      return "plan";
  }
}

function getArtifactsToClearForAgent(agent, stateFiles) {
  switch (agent) {
    case "planner":
      return [
        stateFiles.plan,
        stateFiles.design,
        stateFiles.build,
        stateFiles.verify,
        stateFiles.designReview,
        stateFiles.codeReview,
      ];
    case "design-agent":
      return [
        stateFiles.design,
        stateFiles.build,
        stateFiles.verify,
        stateFiles.designReview,
        stateFiles.codeReview,
      ];
    case "builder":
      return [
        stateFiles.build,
        stateFiles.verify,
        stateFiles.designReview,
        stateFiles.codeReview,
      ];
    case "verifier":
      return [
        stateFiles.verify,
        stateFiles.designReview,
        stateFiles.codeReview,
      ];
    case "design-critic":
      return [stateFiles.designReview, stateFiles.codeReview];
    case "code-critic":
      return [stateFiles.codeReview];
    default:
      return [];
  }
}

function parseCliArgs(args) {
  const options = {};
  const positionals = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--run-id") {
      const value = args[index + 1];

      if (!value) {
        throw new Error("Missing value for --run-id");
      }

      options.runId = value;
      index += 1;
      continue;
    }

    positionals.push(arg);
  }

  return { options, positionals };
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
