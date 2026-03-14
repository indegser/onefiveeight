#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ZOD_VERSION = "^3.25.67";
const SCRIPT_ENTRIES = {
  "ai:init": "node scripts/ai-team/supervisor.mjs init",
  "ai:route": "node scripts/ai-team/supervisor.mjs route",
  "ai:work": "node scripts/ai-team/supervisor.mjs work",
  "ai:validate": "node scripts/ai-team/supervisor.mjs validate",
  "ai:refine": "node scripts/ai-team/supervisor.mjs refine",
};

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const skillDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
  );
  const templateDir = path.join(skillDir, "assets", "template");
  const targetDir = path.resolve(options.target);
  const packageJsonPath = path.join(targetDir, "package.json");

  if (!(await exists(templateDir))) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }

  if (!(await exists(targetDir))) {
    throw new Error(`Target directory not found: ${targetDir}`);
  }

  if (!(await exists(packageJsonPath))) {
    throw new Error(
      `package.json not found in ${targetDir}. Install this workflow into a Node-based repo or add package.json first.`,
    );
  }

  const result = {
    created: [],
    overwritten: [],
    skipped: [],
    package_json_updated: false,
    dependency_added: false,
    target: targetDir,
  };

  await copyDirectory(templateDir, targetDir, options, result);
  await ensureRunsDir(targetDir, options, result);
  const packageResult = await patchPackageJson(packageJsonPath, options);
  result.package_json_updated = packageResult.updated;
  result.dependency_added = packageResult.dependencyAdded;

  console.log(JSON.stringify(result, null, 2));
}

function parseArgs(args) {
  const options = {
    dryRun: false,
    force: false,
    target: process.cwd(),
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--force") {
      options.force = true;
      continue;
    }

    if (arg === "--target") {
      const value = args[index + 1];

      if (!value) {
        throw new Error("Missing value for --target");
      }

      options.target = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

async function copyDirectory(sourceDir, targetDir, options, result) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      if (!options.dryRun) {
        await fs.mkdir(targetPath, { recursive: true });
      }

      await copyDirectory(sourcePath, targetPath, options, result);
      continue;
    }

    await copyFile(sourcePath, targetPath, options, result);
  }
}

async function copyFile(sourcePath, targetPath, options, result) {
  const relativeTargetPath = path.relative(result.target, targetPath);
  const targetExists = await exists(targetPath);

  if (targetExists && !options.force) {
    result.skipped.push(relativeTargetPath);
    return;
  }

  if (!options.dryRun) {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
  }

  if (targetExists) {
    result.overwritten.push(relativeTargetPath);
  } else {
    result.created.push(relativeTargetPath);
  }
}

async function ensureRunsDir(targetDir, options, result) {
  const runsDir = path.join(targetDir, ".ai", "runs");
  const gitkeepPath = path.join(runsDir, ".gitkeep");
  const relativeGitkeepPath = path.relative(targetDir, gitkeepPath);

  if (!(await exists(runsDir)) && !options.dryRun) {
    await fs.mkdir(runsDir, { recursive: true });
  }

  if (await exists(gitkeepPath)) {
    result.skipped.push(relativeGitkeepPath);
    return;
  }

  if (!options.dryRun) {
    await fs.writeFile(gitkeepPath, "", "utf8");
  }

  result.created.push(relativeGitkeepPath);
}

async function patchPackageJson(packageJsonPath, options) {
  const raw = await fs.readFile(packageJsonPath, "utf8");
  const pkg = JSON.parse(raw);
  const nextPkg = structuredClone(pkg);

  nextPkg.scripts ||= {};
  nextPkg.dependencies ||= {};

  let updated = false;
  let dependencyAdded = false;

  for (const [key, value] of Object.entries(SCRIPT_ENTRIES)) {
    if (nextPkg.scripts[key] === value) {
      continue;
    }

    if (nextPkg.scripts[key] && !options.force) {
      continue;
    }

    nextPkg.scripts[key] = value;
    updated = true;
  }

  if (!nextPkg.dependencies.zod && !(pkg.devDependencies && pkg.devDependencies.zod)) {
    nextPkg.dependencies.zod = ZOD_VERSION;
    updated = true;
    dependencyAdded = true;
  }

  if (!updated || options.dryRun) {
    return { updated, dependencyAdded };
  }

  await fs.writeFile(packageJsonPath, `${JSON.stringify(nextPkg, null, 2)}\n`, "utf8");
  return { updated, dependencyAdded };
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
