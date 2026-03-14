#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { schemas } from "./schemas.mjs";
import {
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
  npm run lead-sheet:init -- <source-ref>
  npm run lead-sheet:refine -- --run-id <run_id> [agent] <note>
  npm run lead-sheet:route -- --run-id <run_id>
  npm run lead-sheet:work -- <agent> --run-id <run_id>
  npm run lead-sheet:validate -- --run-id <run_id>`);
}

async function initRun(sourceRefArg) {
  const sourceRef = sourceRefArg ?? "lead-sheet-source";
  const runId = makeRunId(sourceRef);
  const stateFiles = getStateFiles(runId);

  const run = {
    run_id: runId,
    goal: `Convert lead sheet source ${sourceRef} into verified chart data`,
    revision: 1,
    phase: "intake",
    status: "in_progress",
    next_agent: "intake-supervisor",
    inputs: {
      source_ref: sourceRef,
      score_id: null,
      constraints: [
        "Do not invent unreadable or implied chart content.",
        "Preserve uncertainty explicitly until review resolves it.",
      ],
      accuracy_priority: "max",
    },
    artifacts: {
      intake: path.relative(process.cwd(), stateFiles.intake),
      preprocess: path.relative(process.cwd(), stateFiles.preprocess),
      extract: path.relative(process.cwd(), stateFiles.extract),
      align: path.relative(process.cwd(), stateFiles.align),
      verify: path.relative(process.cwd(), stateFiles.verify),
      publish: path.relative(process.cwd(), stateFiles.publish),
    },
    approvals: {
      human_review: false,
      publish: false,
    },
    blockers: [],
    uncertainties: [],
    refinement_notes: [],
    history: [
      {
        at: timestamp(),
        event: `Initialized lead-sheet run from ${sourceRef}`,
      },
    ],
  };

  schemas.run.parse(run);
  await writeJson(stateFiles.run, run);

  console.log(`Initialized lead-sheet run ${run.run_id}`);
  console.log(`Next agent: ${run.next_agent}`);
  console.log(`Run state: ${stateFiles.run}`);
}

async function refineRun(positionals, runId) {
  const allowedAgents = new Set([
    "intake-supervisor",
    "preprocessor",
    "extractor",
    "aligner",
    "verifier",
    "chart-reviewer",
    "publisher",
  ]);
  const firstArg = positionals[0];
  const targetAgent = allowedAgents.has(firstArg) ? firstArg : "aligner";
  const note = allowedAgents.has(firstArg)
    ? positionals.slice(1).join(" ").trim()
    : positionals.join(" ").trim();

  if (!note) {
    throw new Error(
      "Missing refinement note. Example: npm run lead-sheet:refine -- --run-id <run_id> aligner resolve section labeling ambiguity",
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
  const intake = await maybeReadJson(stateFiles.intake);
  const preprocess = await maybeReadJson(stateFiles.preprocess);
  const extract = await maybeReadJson(stateFiles.extract);
  const align = await maybeReadJson(stateFiles.align);
  const verify = await maybeReadJson(stateFiles.verify);
  const chartReview = await maybeReadJson(stateFiles.chartReview);
  const publish = await maybeReadJson(stateFiles.publish);

  let nextAgent = "intake-supervisor";
  let phase = "intake";
  let status = "in_progress";
  const blockers = [];
  const uncertainties = [...(run.uncertainties ?? [])];

  if (!intake) {
    nextAgent = "intake-supervisor";
    phase = "intake";
  } else if (!preprocess) {
    nextAgent = "preprocessor";
    phase = "preprocess";
  } else if (!extract) {
    nextAgent = "extractor";
    phase = "extract";
  } else if (!align) {
    nextAgent = "aligner";
    phase = "align";
  } else if (!verify) {
    nextAgent = "verifier";
    phase = "verify";
  } else if (verify.passed === false) {
    nextAgent = "aligner";
    phase = "align";
    blockers.push(...verify.blocking_issues);
  } else if (!chartReview) {
    nextAgent = "chart-reviewer";
    phase = "review";
  } else if (chartReview.approved === false) {
    nextAgent = "aligner";
    phase = "align";
    blockers.push(...chartReview.unresolved_items);
  } else if (!publish) {
    nextAgent = "publisher";
    phase = "publish";
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
    uncertainties,
    approvals: {
      human_review: chartReview?.approved ?? false,
      publish: publish?.status === "published",
    },
    history: [
      ...run.history,
      {
        at: timestamp(),
        event: `Lead-sheet supervisor routed to ${nextAgent}`,
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
      "Missing agent name. Example: npm run lead-sheet:work -- extractor --run-id <run_id>",
    );
  }

  const { run } = await getRunContext(runId);
  const promptPath = path.join(
    process.cwd(),
    "agents-lead-sheet",
    `${agent}.md`,
  );

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
      "preprocessor",
      "extractor",
      "aligner",
      "verifier",
      "chart-reviewer",
      "publisher",
    ].includes(agent)
  ) {
    state.intake = await maybeReadJson(stateFiles.intake);
  }

  if (
    [
      "extractor",
      "aligner",
      "verifier",
      "chart-reviewer",
      "publisher",
    ].includes(agent)
  ) {
    state.preprocess = await maybeReadJson(stateFiles.preprocess);
  }

  if (["aligner", "verifier", "chart-reviewer", "publisher"].includes(agent)) {
    state.extract = await maybeReadJson(stateFiles.extract);
  }

  if (["verifier", "chart-reviewer", "publisher"].includes(agent)) {
    state.align = await maybeReadJson(stateFiles.align);
  }

  if (["chart-reviewer", "publisher"].includes(agent)) {
    state.verify = await maybeReadJson(stateFiles.verify);
  }

  return state;
}

function getRequiredRunId(runId) {
  if (!runId) {
    throw new Error(
      "Missing required --run-id. Example: npm run lead-sheet:route -- --run-id <run_id>",
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
    case "chartReview":
      return "chartReview";
    default:
      return key;
  }
}

function mapAgentToPhase(agent) {
  switch (agent) {
    case "intake-supervisor":
      return "intake";
    case "preprocessor":
      return "preprocess";
    case "extractor":
      return "extract";
    case "aligner":
      return "align";
    case "verifier":
      return "verify";
    case "chart-reviewer":
      return "review";
    case "publisher":
      return "publish";
    default:
      return "intake";
  }
}

function getArtifactsToClearForAgent(agent, stateFiles) {
  switch (agent) {
    case "intake-supervisor":
      return [
        stateFiles.intake,
        stateFiles.preprocess,
        stateFiles.extract,
        stateFiles.align,
        stateFiles.verify,
        stateFiles.chartReview,
        stateFiles.publish,
      ];
    case "preprocessor":
      return [
        stateFiles.preprocess,
        stateFiles.extract,
        stateFiles.align,
        stateFiles.verify,
        stateFiles.chartReview,
        stateFiles.publish,
      ];
    case "extractor":
      return [
        stateFiles.extract,
        stateFiles.align,
        stateFiles.verify,
        stateFiles.chartReview,
        stateFiles.publish,
      ];
    case "aligner":
      return [
        stateFiles.align,
        stateFiles.verify,
        stateFiles.chartReview,
        stateFiles.publish,
      ];
    case "verifier":
      return [stateFiles.verify, stateFiles.chartReview, stateFiles.publish];
    case "chart-reviewer":
      return [stateFiles.chartReview, stateFiles.publish];
    case "publisher":
      return [stateFiles.publish];
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
