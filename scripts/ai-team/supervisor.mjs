#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { buildTaskMemory } from "./memory.mjs"
import { schemas } from "./schemas.mjs"
import {
  ensureStateDirs,
  fileExists,
  getCurrentRunId,
  getRunDir,
  getStateFiles,
  makeRunId,
  maybeReadJson,
  readJson,
  setCurrentRun,
  timestamp,
  writeJson
} from "./shared-state.mjs"

const [, , command, ...restArgs] = process.argv

async function main() {
  switch (command) {
    case "init":
      await initRun(restArgs[0])
      return
    case "route":
      await routeRun()
      return
    case "work":
      await printWorkPackage(restArgs[0])
      return
    case "validate":
      await validateState()
      return
    default:
      printUsage()
  }
}

function printUsage() {
  console.log(`Usage:
  npm run ai:init -- <idea-file>
  npm run ai:route
  npm run ai:work -- <agent>
  npm run ai:validate`)
}

async function initRun(ideaFileArg) {
  const ideaFile = ideaFileArg ?? "docs/idea.md"
  const absoluteIdeaFile = path.resolve(process.cwd(), ideaFile)

  if (!(await fileExists(absoluteIdeaFile))) {
    throw new Error(`Idea file not found: ${absoluteIdeaFile}`)
  }

  await ensureStateDirs()
  const runId = makeRunId(ideaFile)
  const stateFiles = getStateFiles(runId)
  const memory = await buildTaskMemory({
    ideaFilePath: absoluteIdeaFile,
    goal: `Build an app from ${ideaFile}`,
    constraints: []
  })

  const run = {
    run_id: runId,
    goal: `Build an app from ${ideaFile}`,
    phase: "plan",
    status: "in_progress",
    next_agent: "planner",
    stack: {
      frontend: "nextjs",
      ui: "shadcn-ui",
      backend: "supabase",
      language: "typescript"
    },
    inputs: {
      idea_file: ideaFile,
      constraints: [],
      brand_critical: false
    },
    artifacts: {
      plan: path.relative(process.cwd(), stateFiles.plan),
      memory: path.relative(process.cwd(), stateFiles.memory),
      design: path.relative(process.cwd(), stateFiles.design),
      build: path.relative(process.cwd(), stateFiles.build),
      verify: path.relative(process.cwd(), stateFiles.verify)
    },
    approvals: {
      brand: false,
      data_model: false,
      destructive_flows: false
    },
    blockers: [],
    decisions: [],
    risks: [],
    history: [
      {
        at: timestamp(),
        event: `Initialized run from ${ideaFile}`
      }
    ]
  }

  schemas.run.parse(run)
  await writeJson(stateFiles.run, run)
  schemas.memory.parse(memory)
  await writeJson(stateFiles.memory, memory)
  await setCurrentRun(runId)

  console.log(`Initialized run ${run.run_id}`)
  console.log(`Next agent: ${run.next_agent}`)
  console.log(`Run state: ${stateFiles.run}`)
}

async function routeRun() {
  const { run, stateFiles } = await getRunContext()
  const plan = await maybeReadJson(stateFiles.plan)
  const design = await maybeReadJson(stateFiles.design)
  const build = await maybeReadJson(stateFiles.build)
  const verify = await maybeReadJson(stateFiles.verify)
  const designReview = await maybeReadJson(stateFiles.designReview)
  const codeReview = await maybeReadJson(stateFiles.codeReview)

  let nextAgent = "planner"
  let phase = "plan"
  let status = "in_progress"
  const blockers = []

  if (!plan) {
    nextAgent = "planner"
    phase = "plan"
  } else if (!design) {
    nextAgent = "design-agent"
    phase = "design"
  } else if (run.inputs.brand_critical && !run.approvals.brand) {
    nextAgent = "human"
    phase = "design"
    status = "needs_human"
    blockers.push("Brand approval required before implementation.")
  } else if (!build) {
    nextAgent = "builder"
    phase = "build"
  } else if (!verify) {
    nextAgent = "verifier"
    phase = "verify"
  } else if (verify.passed === false) {
    nextAgent = "builder"
    phase = "build"
    blockers.push(...verify.blocking_issues)
  } else if (!designReview) {
    nextAgent = "design-critic"
    phase = "review"
  } else if (designReview.approved === false) {
    nextAgent = "builder"
    phase = "build"
    blockers.push("Design review requires refinement.")
  } else if (!codeReview) {
    nextAgent = "code-critic"
    phase = "review"
  } else if (codeReview.approved === false) {
    nextAgent = "builder"
    phase = "build"
    blockers.push("Code review requires refinement.")
  } else {
    nextAgent = "none"
    phase = "done"
    status = "done"
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
        event: `Supervisor routed to ${nextAgent}`
      }
    ]
  }

  schemas.run.parse(nextRun)
  await writeJson(stateFiles.run, nextRun)
  console.log(JSON.stringify(nextRun, null, 2))
}

async function printWorkPackage(agent) {
  if (!agent) {
    throw new Error("Missing agent name. Example: npm run ai:work -- planner")
  }

  const { run } = await getRunContext()
  const promptPath = path.join(process.cwd(), "agents", `${agent}.md`)

  if (!(await fileExists(promptPath))) {
    throw new Error(`Unknown agent prompt: ${promptPath}`)
  }

  const prompt = await fs.readFile(promptPath, "utf8")
  const payload = {
    agent,
    run_id: run.run_id,
    phase: run.phase,
    status: run.status,
    run_dir: path.relative(process.cwd(), getRunDir(run.run_id)),
    prompt_file: path.relative(process.cwd(), promptPath),
    relevant_state: await collectRelevantState(agent, run.run_id),
    instructions: prompt.trim()
  }

  console.log(JSON.stringify(payload, null, 2))
}

async function validateState() {
  const runId = await getRequiredRunId()
  const stateFiles = getStateFiles(runId)
  const validations = []

  for (const [key, filePath] of Object.entries(stateFiles)) {
    if (!(await fileExists(filePath))) {
      validations.push({ key, ok: true, skipped: true })
      continue
    }

    const json = await readJson(filePath)
    const schemaKey = mapStateKeyToSchemaKey(key)
    schemas[schemaKey].parse(json)
    validations.push({ key, ok: true, skipped: false })
  }

  console.log(JSON.stringify({ ok: true, run_id: runId, validations }, null, 2))
}

async function requireState(name, runId) {
  const filePath = getStateFiles(runId)[name]

  if (!(await fileExists(filePath))) {
    throw new Error(`Missing required state file: ${filePath}`)
  }

  const parsed = await readJson(filePath)
  schemas[mapStateKeyToSchemaKey(name)].parse(parsed)
  return parsed
}

async function collectRelevantState(agent, runId) {
  const stateFiles = getStateFiles(runId)
  const state = {
    run: await maybeReadJson(stateFiles.run)
  }

  if (["design-agent", "builder", "verifier", "design-critic", "code-critic"].includes(agent)) {
    state.plan = await maybeReadJson(stateFiles.plan)
  }

  if (["planner", "design-agent", "builder", "design-critic", "code-critic"].includes(agent)) {
    state.memory = await maybeReadJson(stateFiles.memory)
  }

  if (["builder", "design-critic"].includes(agent)) {
    state.design = await maybeReadJson(stateFiles.design)
  }

  if (["verifier", "code-critic"].includes(agent)) {
    state.build = await maybeReadJson(stateFiles.build)
  }

  if (["code-critic"].includes(agent)) {
    state.verify = await maybeReadJson(stateFiles.verify)
  }

  return state
}

async function getRequiredRunId() {
  const runId = await getCurrentRunId()

  if (!runId) {
    throw new Error("No active run found. Initialize one with: npm run ai:init -- <idea-file>")
  }

  return runId
}

async function getRunContext() {
  const runId = await getRequiredRunId()
  const run = await requireState("run", runId)
  const stateFiles = getStateFiles(runId)

  return { runId, run, stateFiles }
}

function mapStateKeyToSchemaKey(key) {
  switch (key) {
    case "designReview":
      return "designReview"
    case "codeReview":
      return "codeReview"
    default:
      return key
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
