import fs from "node:fs/promises"
import path from "node:path"

export const ROOT_DIR = process.cwd()
export const AI_DIR = path.join(ROOT_DIR, ".ai")
export const STATE_DIR = path.join(AI_DIR, "state")
export const RUNS_DIR = path.join(AI_DIR, "runs")
export const KNOWLEDGE_DIR = path.join(AI_DIR, "knowledge")
export const KNOWLEDGE_PATTERNS_DIR = path.join(KNOWLEDGE_DIR, "patterns")
export const CURRENT_RUN_FILE = path.join(STATE_DIR, "current-run.json")

export async function ensureStateDirs() {
  await fs.mkdir(STATE_DIR, { recursive: true })
  await fs.mkdir(RUNS_DIR, { recursive: true })
  await fs.mkdir(KNOWLEDGE_PATTERNS_DIR, { recursive: true })
}

export async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8")
  return JSON.parse(raw)
}

export async function writeJson(filePath, value) {
  await ensureStateDirs()
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8")
}

export async function maybeReadJson(filePath) {
  return (await fileExists(filePath)) ? readJson(filePath) : null
}

export function timestamp() {
  return new Date().toISOString()
}

export function makeRunId(ideaFile) {
  const slug = path
    .basename(ideaFile, path.extname(ideaFile))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  return `${timestamp().replaceAll(":", "-")}_${slug || "run"}`
}

export function getRunDir(runId) {
  return path.join(RUNS_DIR, runId)
}

export function getStateFiles(runId) {
  const runDir = getRunDir(runId)
  const reviewDir = path.join(runDir, "reviews")

  return {
    run: path.join(runDir, "run.json"),
    plan: path.join(runDir, "plan.json"),
    memory: path.join(runDir, "memory.json"),
    design: path.join(runDir, "design.json"),
    build: path.join(runDir, "build.json"),
    verify: path.join(runDir, "verify.json"),
    designReview: path.join(reviewDir, "design-review.json"),
    codeReview: path.join(reviewDir, "code-review.json")
  }
}

export async function setCurrentRun(runId) {
  await writeJson(CURRENT_RUN_FILE, {
    run_id: runId,
    updated_at: timestamp()
  })
}

export async function getCurrentRunId() {
  const current = await maybeReadJson(CURRENT_RUN_FILE)
  return current?.run_id ?? null
}
