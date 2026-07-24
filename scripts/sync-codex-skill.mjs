#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const RECEIPT_FILE = ".codex-source.json";
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const SOURCE_ROOT = path.join(REPO_ROOT, "skills");

function assertSkillName(skillName) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skillName ?? "")) {
    throw new Error(
      "skill name must use lowercase letters, digits, and single hyphens only",
    );
  }
}

function assertInside(root, target, label) {
  const relative = path.relative(root, target);
  if (
    relative === "" ||
    relative.startsWith("..") ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`${label} must resolve to one named child of ${root}`);
  }
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function assertSkillSource(skillName) {
  assertSkillName(skillName);
  const source = path.resolve(SOURCE_ROOT, skillName);
  assertInside(SOURCE_ROOT, source, "skill source");
  const sourceStat = await stat(source).catch(() => null);
  if (!sourceStat?.isDirectory()) {
    throw new Error(`repository skill does not exist: ${source}`);
  }
  if (!(await exists(path.join(source, "SKILL.md")))) {
    throw new Error(`repository skill is missing SKILL.md: ${source}`);
  }
  return source;
}

async function collectFiles(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    if (entry.name === RECEIPT_FILE) {
      continue;
    }
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolute, base)));
    } else if (entry.isFile()) {
      files.push(path.relative(base, absolute));
    } else {
      throw new Error(`unsupported non-file entry in skill: ${absolute}`);
    }
  }
  return files;
}

export async function hashSkillDirectory(directory) {
  const hash = createHash("sha256");
  const files = await collectFiles(directory);
  for (const relative of files) {
    const content = await readFile(path.join(directory, relative));
    hash.update(relative);
    hash.update("\0");
    hash.update(content);
    hash.update("\0");
  }
  return hash.digest("hex");
}

function resolveInstalledRoot(codexHome) {
  const resolvedHome = path.resolve(
    codexHome || process.env.CODEX_HOME || path.join(os.homedir(), ".codex"),
  );
  return path.join(resolvedHome, "skills");
}

async function readReceipt(target) {
  try {
    return JSON.parse(await readFile(path.join(target, RECEIPT_FILE), "utf8"));
  } catch {
    return null;
  }
}

export async function checkSkill(skillName, options = {}) {
  const source = await assertSkillSource(skillName);
  const installedRoot = resolveInstalledRoot(options.codexHome);
  const target = path.resolve(installedRoot, skillName);
  assertInside(installedRoot, target, "installed skill target");

  if (!(await exists(target))) {
    return {
      ok: false,
      status: "missing",
      skill: skillName,
      source,
      target,
    };
  }

  const sourceHash = await hashSkillDirectory(source);
  const installedHash = await hashSkillDirectory(target);
  const receipt = await readReceipt(target);
  const receiptMatches =
    receipt?.skill === skillName &&
    receipt?.source_content_hash === sourceHash &&
    receipt?.installed_content_hash === installedHash;
  const ok = sourceHash === installedHash && receiptMatches;

  return {
    ok,
    status: ok ? "clean" : "drifted",
    skill: skillName,
    source,
    target,
    source_hash: sourceHash,
    installed_hash: installedHash,
    receipt_matches: receiptMatches,
  };
}

export async function installSkill(skillName, options = {}) {
  const source = await assertSkillSource(skillName);
  const installedRoot = resolveInstalledRoot(options.codexHome);
  const target = path.resolve(installedRoot, skillName);
  assertInside(installedRoot, target, "installed skill target");
  await mkdir(installedRoot, { recursive: true });

  const sourceHash = await hashSkillDirectory(source);
  const stagingRoot = await mkdtemp(
    path.join(installedRoot, `.${skillName}.stage-`),
  );
  const stagedSkill = path.join(stagingRoot, skillName);
  const backup = path.join(stagingRoot, `${skillName}.backup`);
  let movedExisting = false;

  try {
    await cp(source, stagedSkill, { recursive: true, errorOnExist: true });
    const stagedHash = await hashSkillDirectory(stagedSkill);
    if (stagedHash !== sourceHash) {
      throw new Error("staged skill hash differs from repository source");
    }
    const receipt = {
      skill: skillName,
      source_path: source,
      source_content_hash: sourceHash,
      installed_content_hash: stagedHash,
      installed_at: new Date().toISOString(),
    };
    await writeFile(
      path.join(stagedSkill, RECEIPT_FILE),
      `${JSON.stringify(receipt, null, 2)}\n`,
      "utf8",
    );

    if (await exists(target)) {
      await rename(target, backup);
      movedExisting = true;
    }
    await rename(stagedSkill, target);
    if (movedExisting) {
      await rm(backup, { recursive: true, force: true });
      movedExisting = false;
    }
    await rm(stagingRoot, { recursive: true, force: true });
  } catch (error) {
    if (!(await exists(target)) && movedExisting && (await exists(backup))) {
      await rename(backup, target);
      movedExisting = false;
    }
    await rm(stagingRoot, { recursive: true, force: true });
    throw error;
  }

  return checkSkill(skillName, options);
}

function usage() {
  return [
    "Usage:",
    "  node scripts/sync-codex-skill.mjs check <skill-name>",
    "  node scripts/sync-codex-skill.mjs install <skill-name>",
  ].join("\n");
}

async function main() {
  const [mode, skillName, ...extra] = process.argv.slice(2);
  if (!["check", "install"].includes(mode) || !skillName || extra.length) {
    console.error(usage());
    return 2;
  }
  try {
    const result =
      mode === "install"
        ? await installSkill(skillName)
        : await checkSkill(skillName);
    console.log(JSON.stringify(result, null, 2));
    return result.ok ? 0 : 1;
  } catch (error) {
    console.error(
      `ERROR: ${error instanceof Error ? error.message : String(error)}`,
    );
    return 1;
  }
}

if (path.resolve(process.argv[1] ?? "") === SCRIPT_PATH) {
  process.exitCode = await main();
}
