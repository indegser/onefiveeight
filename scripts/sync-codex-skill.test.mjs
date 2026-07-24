import assert from "node:assert/strict";
import {
  appendFile,
  mkdir,
  mkdtemp,
  readFile,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(
  new URL("./sync-codex-skill.mjs", import.meta.url),
);

function run(codexHome, ...args) {
  return spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    env: { ...process.env, CODEX_HOME: codexHome },
  });
}

test("installs one skill, records a receipt, and reports clean", async (context) => {
  const codexHome = await mkdtemp(
    path.join(os.tmpdir(), "onefiveeight-skill-sync-"),
  );
  context.after(async () => {
    const { rm } = await import("node:fs/promises");
    await rm(codexHome, { recursive: true, force: true });
  });
  const unrelated = path.join(codexHome, "skills", "unrelated-skill");
  await mkdir(unrelated, { recursive: true });
  await writeFile(path.join(unrelated, "SKILL.md"), "unrelated\n");

  const install = run(codexHome, "install", "audio-to-score");
  assert.equal(install.status, 0, install.stderr);
  const installed = JSON.parse(install.stdout);
  assert.equal(installed.status, "clean");

  const receipt = JSON.parse(
    await readFile(
      path.join(codexHome, "skills", "audio-to-score", ".codex-source.json"),
      "utf8",
    ),
  );
  assert.equal(receipt.skill, "audio-to-score");
  assert.match(receipt.source_content_hash, /^[0-9a-f]{64}$/);
  assert.equal(
    await readFile(path.join(unrelated, "SKILL.md"), "utf8"),
    "unrelated\n",
  );

  const beforeReceipt = JSON.stringify(receipt);
  const check = run(codexHome, "check", "audio-to-score");
  assert.equal(check.status, 0, check.stderr);
  assert.equal(JSON.parse(check.stdout).status, "clean");
  const afterReceipt = JSON.stringify(
    JSON.parse(
      await readFile(
        path.join(codexHome, "skills", "audio-to-score", ".codex-source.json"),
        "utf8",
      ),
    ),
  );
  assert.equal(afterReceipt, beforeReceipt);
});

test("detects drift and a subsequent explicit install repairs it", async (context) => {
  const codexHome = await mkdtemp(
    path.join(os.tmpdir(), "onefiveeight-skill-drift-"),
  );
  context.after(async () => {
    const { rm } = await import("node:fs/promises");
    await rm(codexHome, { recursive: true, force: true });
  });
  assert.equal(run(codexHome, "install", "audio-to-score").status, 0);
  await appendFile(
    path.join(codexHome, "skills", "audio-to-score", "SKILL.md"),
    "\nlocal drift\n",
  );

  const drift = run(codexHome, "check", "audio-to-score");
  assert.equal(drift.status, 1);
  assert.equal(JSON.parse(drift.stdout).status, "drifted");

  const reinstall = run(codexHome, "install", "audio-to-score");
  assert.equal(reinstall.status, 0, reinstall.stderr);
  assert.equal(JSON.parse(reinstall.stdout).status, "clean");
});

test("rejects implicit, missing, and traversing targets", async (context) => {
  const codexHome = await mkdtemp(
    path.join(os.tmpdir(), "onefiveeight-skill-invalid-"),
  );
  context.after(async () => {
    const { rm } = await import("node:fs/promises");
    await rm(codexHome, { recursive: true, force: true });
  });

  assert.equal(run(codexHome, "check").status, 2);
  assert.equal(run(codexHome, "check", "../audio-to-score").status, 1);
  assert.equal(run(codexHome, "check", "missing-skill").status, 1);
});
