import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("content:rollover dry run", () => {
  it("plans the current completed rollover without writing files", async () => {
    const { stdout, stderr } = await execFileAsync(
      "bun",
      ["run", "src/tools/rollover-month.ts", "2026-04", "2026-05", "--dry-run"],
      { cwd: path.resolve(import.meta.dirname, "../..") }
    );

    expect(stderr).toBe("");
    expect(JSON.parse(stdout)).toEqual({
      ok: true,
      outgoingMonth: "2026-04",
      incomingMonth: "2026-05",
      entries: 30,
      dryRun: true,
      requiresYesToWrite: true,
      writes: ["2026-04.html", "2026.html", "index.html"]
    });
  });
});
