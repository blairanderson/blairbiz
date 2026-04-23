/**
 * E2E smoke test — exercises the full pipeline using a temp fixture,
 * verifying the script output contains an actionable Claude prompt
 * when a summary is missing.
 */
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, writeFileSync, rmSync, readFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const FIXTURE_DIR = join(import.meta.dir, "__e2e__");
const SCRIPT = join(import.meta.dir, "working.ts");
const TEMPLATE = join(import.meta.dir, "..", "_template", "meeting.md");

function run() {
  return spawnSync("bun", [SCRIPT], {
    env: { ...process.env, CLIENTS_DIR_OVERRIDE: FIXTURE_DIR },
    encoding: "utf-8",
  });
}

beforeEach(() => {
  mkdirSync(join(FIXTURE_DIR, "_template"), { recursive: true });
  writeFileSync(join(FIXTURE_DIR, "_template", "meeting.md"), readFileSync(TEMPLATE, "utf-8"));

  const client = join(FIXTURE_DIR, "test-client");
  mkdirSync(client, { recursive: true });
  writeFileSync(join(client, "2026-01-15.transcript.md"), "Me: Hello.\nThem: Hi Blair.");
  writeFileSync(join(client, "2026-01-15.chatgpt.md"), "## Pain Points\n1. Manual processes");
});

afterEach(() => {
  rmSync(FIXTURE_DIR, { recursive: true, force: true });
});

describe("E2E: missing summary", () => {
  it("exits 1 and emits a self-contained Claude prompt with all source content", () => {
    const result = run();

    expect(result.status).toBe(1);

    // Header
    expect(result.stderr).toContain("STOP");
    expect(result.stderr).toContain("needs a meeting summary");

    // Output file path is explicit
    const combined = result.stdout + result.stderr;
    expect(combined).toContain("2026-01-15.summary.md");

    // Template is included in the prompt
    expect(result.stdout).toContain("## Context");

    // Transcript content is included
    expect(result.stdout).toContain("Me: Hello");

    // ChatGPT content is included
    expect(result.stdout).toContain("Pain Points");
  });
});
