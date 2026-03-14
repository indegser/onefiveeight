import fs from "node:fs/promises";
import path from "node:path";

export const ROOT_DIR = process.cwd();
export const LEAD_SHEET_AI_DIR = path.join(ROOT_DIR, ".lead-sheet-ai");
export const RUNS_DIR = path.join(LEAD_SHEET_AI_DIR, "runs");
export const SCHEMAS_DIR = path.join(LEAD_SHEET_AI_DIR, "schemas");

export async function ensureStateDirs() {
  await fs.mkdir(RUNS_DIR, { recursive: true });
  await fs.mkdir(SCHEMAS_DIR, { recursive: true });
}

export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function writeJson(filePath, value) {
  await ensureStateDirs();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function maybeReadJson(filePath) {
  return (await fileExists(filePath)) ? readJson(filePath) : null;
}

export function timestamp() {
  return new Date().toISOString();
}

export function makeRunId(inputName) {
  const slug = path
    .basename(inputName, path.extname(inputName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${timestamp().replaceAll(":", "-")}_${slug || "lead-sheet-run"}`;
}

export function getRunDir(runId) {
  return path.join(RUNS_DIR, runId);
}

export function getStateFiles(runId) {
  const runDir = getRunDir(runId);
  const reviewDir = path.join(runDir, "reviews");

  return {
    run: path.join(runDir, "run.json"),
    intake: path.join(runDir, "intake.json"),
    preprocess: path.join(runDir, "preprocess.json"),
    extract: path.join(runDir, "extract.json"),
    align: path.join(runDir, "align.json"),
    verify: path.join(runDir, "verify.json"),
    publish: path.join(runDir, "publish.json"),
    chartReview: path.join(reviewDir, "chart-review.json"),
  };
}
