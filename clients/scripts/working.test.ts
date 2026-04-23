import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const FIXTURE_DIR = join(import.meta.dir, "__fixtures__");
const SCRIPT = join(import.meta.dir, "working.ts");

function run() {
  return spawnSync("bun", [SCRIPT], {
    env: { ...process.env, CLIENTS_DIR_OVERRIDE: FIXTURE_DIR },
    encoding: "utf-8",
  });
}

function client(name: string) {
  return join(FIXTURE_DIR, name);
}

function write(path: string, content = "test") {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content);
}

beforeEach(() => {
  mkdirSync(join(FIXTURE_DIR, "_template"), { recursive: true });
  writeFileSync(join(FIXTURE_DIR, "_template", "meeting.md"), "# Template");
});

afterEach(() => {
  rmSync(FIXTURE_DIR, { recursive: true, force: true });
});

describe("working script", () => {
  it("exits clean when no client directories exist", () => {
    const result = run();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Nothing to do");
  });

  it("exits clean when all transcripts are fully synthesized", () => {
    const dir = client("acme");
    write(join(dir, "2026-01-01.transcript.md"));
    write(join(dir, "2026-01-01.chatgpt.md"));
    write(join(dir, "2026-01-01.summary.md"));

    const result = run();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Nothing to do");
  });

  it("stops when transcript has no chatgpt file", () => {
    const dir = client("acme");
    write(join(dir, "2026-01-01.transcript.md"));

    const result = run();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("STOP");
    expect(result.stderr).toContain("chatgpt");
  });

  it("stops when transcript + chatgpt exist but no summary", () => {
    const dir = client("acme");
    write(join(dir, "2026-01-01.transcript.md"));
    write(join(dir, "2026-01-01.chatgpt.md"));

    const result = run();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("STOP");
    expect(result.stderr).toContain("summary");
  });

  it("stops at the earliest unsynthesized transcript when multiple exist", () => {
    const dir = client("acme");
    // Jan fully done
    write(join(dir, "2026-01-01.transcript.md"));
    write(join(dir, "2026-01-01.chatgpt.md"));
    write(join(dir, "2026-01-01.summary.md"));
    // Feb missing summary
    write(join(dir, "2026-02-01.transcript.md"));
    write(join(dir, "2026-02-01.chatgpt.md"));

    const result = run();
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("2026-02-01");
  });

  it("stops at first client alphabetically when two clients have work", () => {
    write(join(client("alpha"), "2026-01-01.transcript.md"));
    write(join(client("zebra"), "2026-01-01.transcript.md"));

    const result = run();
    expect(result.stderr).toContain("alpha");
    expect(result.stderr).not.toContain("zebra");
  });

  it("ignores _template and scripts directories", () => {
    // _template already exists from beforeEach; scripts dir shouldn't be treated as client
    mkdirSync(join(FIXTURE_DIR, "scripts"), { recursive: true });

    const result = run();
    expect(result.status).toBe(0);
  });

  it("includes full output file path in missing summary message", () => {
    const dir = client("acme");
    write(join(dir, "2026-01-01.transcript.md"), "transcript content");
    write(join(dir, "2026-01-01.chatgpt.md"), "chatgpt content");

    const result = run();
    expect(result.stdout).toContain("2026-01-01.summary.md");
  });
});
