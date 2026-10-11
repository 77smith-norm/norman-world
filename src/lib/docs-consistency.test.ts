import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { IMAGE_MODEL_ALLOWLIST } from "./entry";
import { repoRoot } from "./paths";

// Model identifiers appear in the docs either backticked (`xai/...`) or
// double-quoted ("xai/..." in the JSON example). Matching the delimiters
// keeps the comparison exact, so a near-miss like `xai/grok-imagine-image-2`
// does not count as the allowlisted `xai/grok-imagine-image`.
const DELIMITED_MODEL = /(?:`|")([a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*)(?:`|")/g;

function imageModelsNamedIn(file: string): string[] {
  const text = readFileSync(path.join(repoRoot, file), "utf8");
  const tokens = [...text.matchAll(DELIMITED_MODEL)].map((match) => match[1]);
  return [...new Set(tokens.filter((token) => /imagin|image/.test(token)))].sort();
}

describe("docs ↔ IMAGE_MODEL_ALLOWLIST", () => {
  for (const doc of ["docs/openclaw-cron-prompt.md", "docs/openclaw-cron-contract.md"]) {
    it(`${doc} names exactly the allowlisted portrait image models`, () => {
      expect(imageModelsNamedIn(doc)).toEqual([...IMAGE_MODEL_ALLOWLIST].sort());
    });
  }
});
