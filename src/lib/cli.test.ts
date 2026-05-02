import { describe, expect, it } from "vitest";
import { parseCliArgs } from "./cli";

describe("parseCliArgs", () => {
  it("extracts dry-run and pretty flags", () => {
    expect(parseCliArgs(["2026-05", "--dry-run", "--pretty"])).toEqual({
      dryRun: true,
      pretty: true,
      yes: false,
      positional: ["2026-05"]
    });
  });

  it("extracts the explicit write confirmation flag", () => {
    expect(parseCliArgs(["--yes"])).toEqual({
      dryRun: false,
      pretty: false,
      yes: true,
      positional: []
    });
  });

  it("leaves unknown arguments as positional values", () => {
    expect(parseCliArgs(["entry.json", "--format=json"])).toEqual({
      dryRun: false,
      pretty: false,
      yes: false,
      positional: ["entry.json", "--format=json"]
    });
  });
});
