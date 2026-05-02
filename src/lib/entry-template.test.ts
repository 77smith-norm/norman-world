import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sampleInput from "../fixtures/daily-entry.sample.json";
import { renderDailyEntry, type DailyEntryInput } from "./entry";
import { sitePaths } from "./paths";

describe("daily entry template integration", () => {
  it("renders the real template without unresolved placeholders", () => {
    const template = fs.readFileSync(path.join(sitePaths.repoRoot, "templates", "entry.html"), "utf8");
    const html = renderDailyEntry(template, sampleInput as DailyEntryInput);

    expect(html).toContain("<title>May 2, 2026 — Norman World</title>");
    expect(html).toContain("../images/2026-05-02-norm.png");
    expect(html).toContain("../js/2026-05-02.js");
    expect(html).toContain("Another Test Story");
    expect(html).not.toMatch(/\{\{[A-Z_]+\}\}/);
  });
});
