/**
 * Integration tests — run against real client directories.
 * Assumes clients/looped-sustainability is fully synthesized.
 */
import { describe, it, expect } from "bun:test";
import { spawnSync } from "child_process";
import { join } from "path";
import { existsSync } from "fs";

const SCRIPT = join(import.meta.dir, "working.ts");

function run(env?: Record<string, string>) {
  return spawnSync("bun", [SCRIPT], {
    encoding: "utf-8",
    env: { ...process.env, ...env },
  });
}

describe("working script (integration)", () => {
  it("passes clean against the real clients directory", () => {
    const result = run();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Nothing to do");
  });

  it("looped-sustainability has all three required files", () => {
    const dir = join(import.meta.dir, "..", "looped-sustainability");
    expect(existsSync(join(dir, "2026-04-22.transcript.md"))).toBe(true);
    expect(existsSync(join(dir, "2026-04-22.chatgpt.md"))).toBe(true);
    expect(existsSync(join(dir, "2026-04-22.summary.md"))).toBe(true);
  });

  it("template file exists and has required sections", () => {
    const template = join(import.meta.dir, "..", "_template", "meeting.md");
    expect(existsSync(template)).toBe(true);
    const content = require("fs").readFileSync(template, "utf-8");
    for (const section of ["Context", "Pain Points", "Action Items", "Next Steps"]) {
      expect(content).toContain(section);
    }
  });
});
